export function Cursor({ name, x, y }: { name: string; x: number; y: number }) {
  return (
    <div
      className="pointer-events-none absolute top-0 left-0 flex items-center gap-2 text-gray-200 drop-shadow-md transition-transform duration-[0.25s] ease-out"
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
    >
      <svg
        width="22"
        height="33"
        viewBox="0 0 22 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 32.5V0.5L21.4908 23.4077H9.21033L0 32.5Z"
          fill="currentColor"
        />
      </svg>
      <p>{name}</p>
    </div>
  )
}
