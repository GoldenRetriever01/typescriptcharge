import { useFetcher } from "@remix-run/react"
import type { SerializeFrom } from "@remix-run/server-runtime"
import clsx from "clsx"
import { ImagePlus } from "lucide-react"
import { useCallback, useRef } from "react"
import { route } from "routes-gen"
import type { characterImageAction } from "~/routes/api/characters.$id.image"
import { Button } from "~/ui/button"
import { LoadingSpinner } from "~/ui/loading"
import { activePressClass } from "~/ui/styles"
import type { Character } from "./character-sheet-data"

export function CharacterImageUploader({
  character,
}: {
  character: Character
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const fetcher = useFetcher<SerializeFrom<typeof characterImageAction>>()

  return (
    <>
      <input
        name="image"
        type="file"
        hidden
        accept="image/*"
        ref={inputRef}
        onChange={(event) => {
          const image = event.target.files?.[0]
          if (!image) return

          const formData = new FormData()
          formData.append("image", image)
          fetcher.submit(formData, {
            action: route("/api/characters/:id/image", { id: character.id }),
            method: "post",
            encType: "multipart/form-data",
          })
        }}
      />
      <Button
        className={clsx(
          "group relative grid h-full min-h-[24rem] w-full place-content-center place-items-center gap-4 overflow-clip rounded-md bg-black/25 p-4 ring-blue-500 transition hover:bg-black/50 focus:outline-none focus-visible:ring-2 sm:min-h-[unset]",
          activePressClass,
        )}
        onClick={() => inputRef.current!.click()}
        disabled={!!fetcher.submission}
      >
        {fetcher.submission ? (
          <LoadingSpinner />
        ) : character.imageUrl ? (
          <div className="absolute inset-0">
            <ImagePreview src={character.imageUrl} />
          </div>
        ) : (
          <DropzonePlaceholder />
        )}

        {fetcher.data?.error && (
          <span className="absolute inset-x-0 bottom-0 bg-black/75 p-2 text-sm leading-tight text-red-400">
            {fetcher.data.error}
          </span>
        )}
      </Button>
    </>
  )
}

function ImagePreview({ src }: { src: string }) {
  const ref = useCallback(
    (root: HTMLElement | null) => {
      if (!root) return

      const imageElement = root.querySelector(
        "[data-image]",
      ) as HTMLImageElement

      const loadingElement = root.querySelector(
        "[data-loading]",
      ) as HTMLDivElement

      const image = new Image()
      image.src = src
      if (image.complete) {
        imageElement.style.opacity = "1"
        loadingElement.style.opacity = "0"
        return
      }

      imageElement.style.opacity = "0"
      loadingElement.style.opacity = "1"
      image.addEventListener(
        "load",
        () => {
          imageElement.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 200,
            fill: "forwards",
          })
          loadingElement.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 200,
            fill: "forwards",
          })
        },
        { once: true },
      )
    },
    [src],
  )

  return (
    <div className="group relative h-full" ref={ref}>
      <div className="absolute inset-0" data-image>
        <div
          style={{ backgroundImage: `url(${src})` }}
          className="absolute inset-0 scale-110 bg-cover bg-center bg-no-repeat blur-md brightness-50"
        />
        <div
          style={{ backgroundImage: `url(${src})` }}
          className="absolute inset-0 bg-contain bg-center bg-no-repeat "
        />
      </div>
      <div
        className="absolute inset-0 grid place-items-center p-4"
        data-loading
      >
        <LoadingSpinner />
      </div>
      <div className="absolute inset-0 bg-black opacity-0 transition-opacity group-hover:opacity-60">
        <DropzonePlaceholder />
      </div>
    </div>
  )
}

function DropzonePlaceholder() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <ImagePlus size={48} />
      <span>
        Add reference image
        <br />
        (max 3MB)
      </span>
    </div>
  )
}
