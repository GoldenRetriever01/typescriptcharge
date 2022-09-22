import type { FormMethod, FormProps } from "@remix-run/react"
import { Form } from "@remix-run/react"
import type { Transition } from "@remix-run/react/dist/transition"
import type { z } from "zod"
import type { CrudActionsTemplate } from "./crud.server"

type ExtractInputType<
  Method extends FormMethod,
  CrudActions extends CrudActionsTemplate,
> = z.input<NonNullable<NonNullable<CrudActions["config"][Method]>["input"]>>

type Merge<A, B> = Omit<A, keyof B> & B

type CrudClient<CrudActions extends CrudActionsTemplate> = {
  [Method in FormMethod]: {
    Form: (props: FormProps) => React.ReactElement
    input: <Name extends keyof ExtractInputType<Method, CrudActions>>(
      props: Merge<React.InputHTMLAttributes<HTMLInputElement>, { name: Name }>,
    ) => React.ReactElement
    textarea: <Name extends keyof ExtractInputType<Method, CrudActions>>(
      props: Merge<
        React.TextareaHTMLAttributes<HTMLTextAreaElement>,
        { name: Name }
      >,
    ) => React.ReactElement
    getSubmissionInput: (
      transition: Transition,
    ) => ExtractInputType<Method, CrudActions> | undefined
  }
}

export function createCrudClient<CrudActions extends CrudActionsTemplate>(
  routePath: string,
): CrudClient<CrudActions> {
  const client: any = {}

  for (const method of ["get", "post", "patch", "put", "delete"] as const) {
    client[method] = {
      Form: (props: any) => (
        <Form method={method} action={routePath} {...props} />
      ),
      input: (props: any) => <input {...props} />,
      textarea: (props: any) => <textarea {...props} />,

      getSubmissionInput: (transition: Transition) => {
        if (
          transition.submission?.action === routePath &&
          transition.submission.method === method.toUpperCase()
        ) {
          return Object.fromEntries(transition.submission.formData) as any
        }
      },
    }
  }

  return client
}
