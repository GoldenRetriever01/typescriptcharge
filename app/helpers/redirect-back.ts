import { redirect } from "@remix-run/node"

export function redirectBack(request: Request) {
  return redirect(request.headers.get("Referer") ?? "/")
}
