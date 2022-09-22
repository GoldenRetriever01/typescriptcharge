import { useLoaderData } from "@remix-run/react"
import { getWorld } from "~/db"

export async function loader() {
  const world = await getWorld()
  return { name: world.name }
}

export default function Index() {
  const data = useLoaderData<typeof loader>()
  return (
    <>
      <h1>{data.name}</h1>
    </>
  )
}
