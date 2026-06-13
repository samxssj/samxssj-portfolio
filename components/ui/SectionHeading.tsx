export function SectionHeading({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-24 text-4xl font-extrabold tracking-tight text-text sm:text-5xl"
    >
      {children}
      <span className="text-accent">.</span>
    </h2>
  );
}
