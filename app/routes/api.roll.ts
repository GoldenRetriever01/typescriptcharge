import type { ActionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { z } from "zod"
import { getSessionUser } from "~/auth/session"
import { db } from "~/core/db.server"
import { range } from "~/helpers/range"
import { defaultRoomId } from "~/multiplayer/liveblocks-client"
import { triggerEvent } from "~/multiplayer/pusher.server"

export function loader() {
  return redirect("/")
}

export async function action({ request }: ActionArgs) {
  const user = await getSessionUser(request)
  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const bodySchema = z.object({
    count: z
      .string()
      .transform((value) => z.number().int().positive().parse(Number(value))),
    intent: z.string().max(100),
  })
  const body = bodySchema.parse(Object.fromEntries(await request.formData()))

  const results = range(1, body.count).map(() => ({
    sides: 6,
    result: Math.floor(Math.random() * 6) + 1,
  }))

  const log = await db.diceLog.create({
    data: {
      roomId: defaultRoomId,
      userId: user.id,
      dice: results,
      intent: body.intent,
    },
    select: {
      user: { select: { name: true } },
      dice: true,
      intent: true,
    },
  })

  await triggerEvent(`new-dice-log:${defaultRoomId}`, log)

  return redirect(request.headers.get("Referer") ?? "/")
}
