import { LiveList } from "@liveblocks/client"
import {
  NodeOnDiskFile,
  unstable_createFileUploadHandler,
} from "@remix-run/node"
import type { ActionArgs } from "@remix-run/server-runtime"
import {
  json,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/server-runtime"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { createHash } from "node:crypto"
import sharp from "sharp"
import { env } from "~/env.server"
import { serverLiveblocksRoom } from "~/features/multiplayer/liveblocks-client.server"

export async function action({ request, params }: ActionArgs) {
  let form
  try {
    form = await unstable_parseMultipartFormData(
      request,
      unstable_composeUploadHandlers(
        unstable_createFileUploadHandler({
          file: ({ filename }) => filename,
        }),
        unstable_createMemoryUploadHandler(),
      ),
    )
  } catch (error: any) {
    return json(
      { error: error?.message ?? "Failed to parse form data" },
      { status: 400 },
    )
  }

  const image = form.get("image")
  if (!(image instanceof NodeOnDiskFile)) {
    return json({ error: "Invalid image" }, { status: 400 })
  }

  const imageBuffer = Buffer.from(await image.arrayBuffer())

  const hash = createHash("sha256")
    .update(imageBuffer)
    .digest("hex")
    .slice(0, 16)

  const convertedImage = sharp(imageBuffer).webp()
  const uploadedImageName = `${hash}.webp`

  const imageStorage = createSupabaseClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_KEY,
  ).storage.from("character-images")

  const result = await imageStorage.upload(uploadedImageName, convertedImage, {
    upsert: true,
    contentType: "image/webp",
  })

  if (result.error) {
    console.error(result.error)
    return json({ error: "Failed to upload image" }, { status: 500 })
  }

  if (serverLiveblocksRoom.getConnectionState() !== "open") {
    return json({ error: "Liveblocks connection is not open" }, { status: 500 })
  }

  const roomStorage = await serverLiveblocksRoom.getStorage()

  let characters = roomStorage.root.get("characters")
  if (!characters) {
    characters = new LiveList()
    roomStorage.root.set("characters", characters)
  }

  const index =
    characters.findIndex((character) => character.id === params.id) ?? -1
  if (index === -1) {
    return json({ error: "Character not found" }, { status: 404 })
  }

  characters.set(index, {
    ...characters.get(index)!,
    imageUrl: imageStorage.getPublicUrl(uploadedImageName).data.publicUrl,
  })

  return json({ error: "" })
}

export { action as characterImageAction }
