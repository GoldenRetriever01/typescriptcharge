import { ClockList } from "./features/clocks/clock-list"
import { proxyClient } from "./trpc/client"

const world = await proxyClient.worlds.default.query()

export function App() {
  return (
    <main className="max-w-screen-md mx-auto px-4 py-16 grid gap-8">
      <Card title={world.name}>
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
        <ClockList />
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
