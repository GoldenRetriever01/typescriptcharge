import type {
  FetcherWithComponents,
  FormMethod,
  FormProps,
  SubmitOptions,
} from "@remix-run/react"
import { Form, useFetcher } from "@remix-run/react"
import type { Submission } from "@remix-run/react/dist/transition"
import { useCallback } from "react"
import type { z } from "zod"
import type { CrudActionsTemplate } from "./crud.server"
import { useEvent } from "./react"

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
      submission: Submission | undefined,
    ) => ExtractInputType<Method, CrudActions> // | undefined
    useFetcher: () => Merge<
      FetcherWithComponents<never>,
      {
        submit: (
          data: ExtractInputType<Method, CrudActions>,
          options?: SubmitOptions,
        ) => void
      }
    >
  }
}

export function createCrudClient<CrudActions extends CrudActionsTemplate>(
  routePath: string,
): CrudClient<CrudActions> {
  const client: any = {}

  for (const method of ["get", "post", "patch", "put", "delete"] as const) {
    client[method] = {
      Form: (props: any) => (
        <Form {...props} method={method} action={routePath} />
      ),
      input: (props: any) => <input {...props} />,
      textarea: (props: any) => <textarea {...props} />,

      getSubmissionInput: (submission: Submission | undefined) => {
        if (
          submission?.action === routePath &&
          submission.method === method.toUpperCase()
        ) {
          return Object.fromEntries(submission.formData) as any
        }
      },

      useFetcher: () => {
        const fetcher = useFetcher()
        return {
          ...fetcher,
          submit: useEvent((data: any, options: SubmitOptions) => {
            fetcher.submit(data, { ...options, action: routePath, method })
          }),
          Form: useCallback(
            function Form(props: FormProps) {
              return (
                <fetcher.Form {...props} action={routePath} method={method} />
              )
            },
            [fetcher],
          ),
        }
      },
    }
  }

  return client
}
