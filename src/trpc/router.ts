import { initTRPC } from "@trpc/server"
import { observable } from "@trpc/server/observable"
import { z } from "zod"

const t = initTRPC.create()

export const appRouter = t.router({
  sayHi: t.procedure.input(z.string()).query(({ input }) => `hi ${input}`),
  counter: t.procedure.subscription(() => {
    return observable<number>((emit) => {
      let i = 0
      const interval = setInterval(() => {
        emit.next(i)
        i += 1
      }, 1000)
      return () => {
        clearInterval(interval)
      }
    })
  }),
})

export type AppRouter = typeof appRouter
