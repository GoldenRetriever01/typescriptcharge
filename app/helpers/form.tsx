import type { ComponentPropsWithoutRef, ForwardedRef } from "react"
import type * as z from "zod"

export function defineField<Output>(
  name: string,
  schema: z.ZodType<Output, z.ZodTypeDef, string>,
) {
  return {
    parse: (data: FormData) => schema.parse(data.get(name)),
    safeParse: (data: FormData) => schema.safeParse(data.get(name)),
    input: (
      props: Omit<ComponentPropsWithoutRef<"input">, "name">,
      ref: ForwardedRef<HTMLInputElement>,
    ) => <input {...props} name={name} ref={ref} />,
  }
}
