export function CardSection({ children }: { children: React.ReactNode }) {
  return (
    // eslint-disable-next-line tailwindcss/no-contradicting-classname
    <section className="grid gap-4 border-2 border-gray-600 bg-gray-700 p-4 shadow-md shadow-[rgba(0,0,0,0.25)]">
      {children}
    </section>
  )
}
