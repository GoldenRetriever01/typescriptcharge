import { trpc } from "./trpc/react"

export function App() {
  const { data } = trpc.message.useQuery()
  return (
    <div>
      <h1>ayy lmao</h1>
      <p>{data}</p>
    </div>
  )
}
