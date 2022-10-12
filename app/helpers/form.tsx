import type { ComponentProps } from "react"
import type * as z from "zod"
import { autoRef } from "./react"

export function defineField<Output>(
  name: string,
  schema: z.ZodType<Output, z.ZodTypeDef, string>,
) {
  return {
    parse: (data: FormData) => schema.parse(data.get(name)),
    safeParse: (data: FormData) => schema.safeParse(data.get(name)),
    input: autoRef(function Input(
      props: Omit<ComponentProps<"input">, "name">,
    ) {
      return <input {...props} name={name} />
    }),
  }
}
