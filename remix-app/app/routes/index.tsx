import { useLoaderData } from "@remix-run/react"
import { useEffect, useState } from "react"
import { getClocks } from "~/features/clocks/actions.server"
import { ClockList } from "~/features/clocks/clock-list"
import { getWorld } from "~/features/worlds/db.server"

export async function loader() {
  const world = await getWorld()
  const clocks = await getClocks()
  return { world, clocks }
}

export default function Index() {
  const data = useLoaderData<typeof loader>()

  const [clocks, setClocks] = useState(data.clocks)
  useEffect(() => {
    const eventStream = new EventSource("/clocks/sse")
    eventStream.addEventListener("message", (event) => {
      setClocks(JSON.parse(event.data))
    })
    return () => eventStream.close()
  }, [])

  return (
    <main className="grid gap-8">
      <Card title={data.world.name}>
        <p>
          Sit aliqua cillum et irure reprehenderit irure tempor eu amet. Tempor
          sunt excepteur tempor sint culpa irure. Cillum esse laboris sunt esse.
          Deserunt cillum cupidatat aliqua consequat aliqua esse deserunt
          laboris magna aliqua ex nostrud anim est.
        </p>
        <p>
          Fugiat tempor nostrud Lorem est dolor deserunt eu fugiat nostrud sint
          quis id elit. Dolore culpa sit tempor sunt mollit eu ad ea. Dolore do
          deserunt sit enim deserunt proident quis adipisicing ad culpa anim.
          Nostrud in culpa veniam elit cupidatat ad fugiat nostrud qui et
          incididunt officia mollit mollit. Consectetur magna magna enim aliquip
          incididunt. Reprehenderit culpa laboris exercitation nostrud. Ea sint
          ullamco velit nostrud ipsum.
        </p>
      </Card>
      <Card title="Clocks">
        <ClockList clocks={clocks} />
      </Card>
      <Card title="Characters">
        <p>
          Sit aliqua cillum et irure reprehenderit irure tempor eu amet. Tempor
          sunt excepteur tempor sint culpa irure. Cillum esse laboris sunt esse.
          Deserunt cillum cupidatat aliqua consequat aliqua esse deserunt
          laboris magna aliqua ex nostrud anim est.
        </p>
        <p>
          Fugiat tempor nostrud Lorem est dolor deserunt eu fugiat nostrud sint
          quis id elit. Dolore culpa sit tempor sunt mollit eu ad ea. Dolore do
          deserunt sit enim deserunt proident quis adipisicing ad culpa anim.
          Nostrud in culpa veniam elit cupidatat ad fugiat nostrud qui et
          incididunt officia mollit mollit. Consectetur magna magna enim aliquip
          incididunt. Reprehenderit culpa laboris exercitation nostrud. Ea sint
          ullamco velit nostrud ipsum.
        </p>
      </Card>
    </main>
  )
}

function Card({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-gray-700 border-2 border-gray-600 p-4 shadow-md shadow-[rgba(0,0,0,0.25)] grid gap-4">
      <h1 className="font-header uppercase tracking-wide text-3xl">{title}</h1>
      {children}
    </div>
  )
}
