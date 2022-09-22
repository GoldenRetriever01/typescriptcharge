import type { ActionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { clockActions } from "~/features/clocks/actions.server"

export function loader() {
  return redirect("/")
}

export async function action(args: ActionArgs) {
  return clockActions.handleRequest(args)
}
