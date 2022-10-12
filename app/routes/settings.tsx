import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Form, useActionData, useLoaderData } from "@remix-run/react"
import { Minus, Plus } from "lucide-react"
import { useId } from "react"
import type { ZodError } from "zod"
import { z } from "zod"
import { getDefaultWorld } from "~/features/world/world-db.server"
import { defineField } from "~/helpers/form"
import { prisma } from "~/prisma.server"
import { Button } from "~/ui/button"
import {
  inputClass,
  labelTextClass,
  raisedPanelClass,
  solidButton,
} from "~/ui/styles"

const snowflakeSchema = z
  .string()
  .regex(/^\d+$/, "Value must be a valid snowflake (discord ID)")

function formatZodError(error: ZodError) {
  return error.issues.map((i) => i.message).join("\n")
}

const userDiscordIdField = defineField("userDiscordId", snowflakeSchema)

export async function loader({ request }: LoaderArgs) {
  const world = await getDefaultWorld()

  const players = await prisma.membership.findMany({
    where: {
      AND: {
        worldId: world.id,
        role: "PLAYER",
      },
    },
    select: {
      user: {
        select: { name: true },
      },
      userDiscordId: true,
    },
  })

  return json({ players })
}

export async function action({ request }: ActionArgs) {
  const method = request.method.toLowerCase()

  if (method === "post") {
    const form = await request.formData()

    const userDiscordId = userDiscordIdField.safeParse(form)
    if (!userDiscordId.success) {
      return json(
        { success: false, error: formatZodError(userDiscordId.error) },
        { status: 400 },
      )
    }

    const world = await getDefaultWorld()

    await prisma.membership.create({
      data: {
        user: {
          connectOrCreate: {
            where: { discordId: userDiscordId.data },
            create: { discordId: userDiscordId.data, name: "Unknown" },
          },
        },
        world: { connect: { id: world.id } },
        role: "PLAYER",
      },
    })

    return json({ success: true, error: "" })
  }

  if (method === "delete") {
    const form = await request.formData()

    const userDiscordId = userDiscordIdField.safeParse(form)
    if (!userDiscordId.success) {
      return json(
        { success: false, error: formatZodError(userDiscordId.error) },
        { status: 400 },
      )
    }

    const world = await getDefaultWorld()

    await prisma.membership.delete({
      where: {
        worldId_userDiscordId: {
          userDiscordId: userDiscordId.data,
          worldId: world.id,
        },
      },
    })

    return json({ success: true, error: "" })
  }

  return json({ success: false, error: "Invalid method" }, { status: 405 })
}

export default function SettingsPage() {
  const { players } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const inputId = useId()
  return (
    <div className={raisedPanelClass}>
      <div className="p-4">
        <h2 className="text-3xl font-light">Add players</h2>

        {actionData?.error && (
          <p className="text-red-400">{actionData.error}</p>
        )}

        <div className="mt-4 grid grid-cols-[1fr,auto] gap-2">
          <Form method="post" className="contents" replace>
            <div className="col-span-2 -mb-1">
              <label className={labelTextClass} htmlFor={inputId}>
                Discord user ID
              </label>
            </div>
            <userDiscordIdField.input
              id={inputId}
              className={inputClass}
              placeholder="0123456789"
              required
            />
            <Button type="submit" className={solidButton} title="Add player">
              <Plus />
            </Button>
          </Form>

          {players.map((player) => (
            <Form
              key={player.userDiscordId}
              method="delete"
              className="contents"
              replace
            >
              <p className={inputClass}>
                {player.user.name}
                <span className="ml-1 opacity-75">
                  ({player.userDiscordId})
                </span>
              </p>
              <userDiscordIdField.input
                type="hidden"
                value={player.userDiscordId}
              />
              <Button
                type="submit"
                className={solidButton}
                title="Remove player"
              >
                <Minus />
              </Button>
            </Form>
          ))}
        </div>
      </div>
    </div>
  )
}
