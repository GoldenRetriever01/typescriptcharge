import type { ActionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { z } from "zod"
import { clockEvents } from "~/features/clocks/actions.server"
import { clockStateSchema } from "~/features/clocks/clock-state"
import { defaultWorldId } from "~/features/worlds/db.server"
import { prisma } from "~/prisma.server"

export function loader() {
  return redirect("/")
}

export async function action({ request }: ActionArgs) {
  const schema = z.object({
    authorId: z.string(),
    clocks: z
      .string()
      .transform((s) => z.array(clockStateSchema).parse(JSON.parse(s))),
  })

  const body = schema.parse(Object.fromEntries(await request.formData()))

  await prisma.world.update({
    where: { id: defaultWorldId },
    data: { clocks: body.clocks },
  })

  clockEvents.emit({
    authorId: body.authorId,
    clocks: body.clocks,
  })

  return redirect("/")
}
