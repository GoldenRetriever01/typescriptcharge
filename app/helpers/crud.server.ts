import type { ActionArgs, DataFunctionArgs } from "@remix-run/node"
import type { FormMethod } from "@remix-run/react"
import type { ZodType, ZodTypeDef } from "zod"

type CrudActionsConfig<
  GetInput,
  GetBody,
  PostInput,
  PostBody,
  PutInput,
  PutBody,
  PatchInput,
  PatchBody,
  DeleteInput,
  DeleteBody,
> = {
  get?: {
    input?: ZodType<GetInput, ZodTypeDef, GetBody>
    action: (input: GetInput, args: ActionArgs) => Promise<Response> | Response
  }
  post?: {
    input?: ZodType<PostInput, ZodTypeDef, PostBody>
    action: (input: PostInput, args: ActionArgs) => Promise<Response> | Response
  }
  put?: {
    input?: ZodType<PutInput, ZodTypeDef, PutBody>
    action: (input: PutInput, args: ActionArgs) => Promise<Response> | Response
  }
  patch?: {
    input?: ZodType<PatchInput, ZodTypeDef, PatchBody>
    action: (
      input: PatchInput,
      args: ActionArgs,
    ) => Promise<Response> | Response
  }
  delete?: {
    input?: ZodType<DeleteInput, ZodTypeDef, DeleteBody>
    action: (
      input: DeleteInput,
      args: ActionArgs,
    ) => Promise<Response> | Response
  }
}

export type CrudActionsTemplate = {
  config: CrudActionsConfig<any, any, any, any, any, any, any, any, any, any>
  handleRequest: (args: ActionArgs) => Promise<Response> | Response
}

export function defineCrudActions<
  GetInput,
  GetBody,
  PostInput,
  PostBody,
  PutInput,
  PutBody,
  PatchInput,
  PatchBody,
  DeleteInput,
  DeleteBody,
>(
  config: CrudActionsConfig<
    GetInput,
    GetBody,
    PostInput,
    PostBody,
    PutInput,
    PutBody,
    PatchInput,
    PatchBody,
    DeleteInput,
    DeleteBody
  >,
) {
  return {
    config,
    handleRequest: async (args: DataFunctionArgs) => {
      const handler = config[args.request.method.toLowerCase() as FormMethod]
      if (!handler) return new Response(undefined, { status: 405 })

      const body = Object.fromEntries(await args.request.formData())
      const input = handler.input ? await handler.input.parseAsync(body) : body
      return handler.action(input as any, args)
    },
  }
}
