import type { ActionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { randomInt } from "node:crypto"
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
    poolSize: z
      .string()
      .transform((value) => z.number().int().parse(Number(value))),
    intent: z.string().max(100),
  })
  const body = bodySchema.parse(Object.fromEntries(await request.formData()))

  const diceCount = body.poolSize <= 0 ? 2 : Math.max(body.poolSize, 1)

  const results = range(1, diceCount).map(() => ({
    sides: 6,
    result: randomInt(1, 7),
  }))

  const log = await db.diceLog.create({
    data: {
      roomId: defaultRoomId,
      userId: user.id,
      dice: results,
      intent: body.intent,
      isDisadvantage: body.poolSize <= 0,
    },
    select: {
      user: { select: { name: true } },
      dice: true,
      intent: true,
      isDisadvantage: true,
    },
  })

  await triggerEvent(`new-dice-log:${defaultRoomId}`, log)

  return redirect(request.headers.get("Referer") ?? "/")
}
