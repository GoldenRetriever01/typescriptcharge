import type { LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { prisma } from "~/prisma.server"

export async function loader({ params }: LoaderArgs) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      name: true,
      avatar: true,
    },
  })

  return json({ user })
}

export { loader as apiUserLoader }
