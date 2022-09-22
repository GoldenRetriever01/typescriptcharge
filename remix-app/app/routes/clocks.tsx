import type { ActionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { z } from "zod"
import {
  createClock,
  deleteClock,
  updateClock,
} from "~/features/clocks/db.server"

function parseUnsignedInt(input: unknown): number {
  const value = Number(input)
  if (Number.isInteger(value) && value >= 0) return value
  throw new Error(`Expected an unsigned integer, got ${input}`)
}

export async function action({ request }: ActionArgs) {
  const method = request.method.toLowerCase()

  if (method === "post") {
    await createClock()
    return redirect("/")
  }

  if (method === "delete") {
    const schema = z.object({ id: z.string() })
    const body = schema.parse(Object.fromEntries(await request.formData()))
    await deleteClock(body.id)
    return redirect("/")
  }

  if (method === "patch") {
    const schema = z.object({
      id: z.string(),
      name: z.string().optional(),
      progress: z.string().transform(parseUnsignedInt).optional(),
      maxProgress: z.string().transform(parseUnsignedInt).optional(),
    })
    const { id, ...data } = schema.parse(
      Object.fromEntries(await request.formData()),
    )

    await updateClock(id, data)

    return redirect("/")
  }

  return new Response(undefined, { status: 405 })
}
