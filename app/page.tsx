import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          AI Sticker Generator
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Browse AI-generated sticker designs and create your own unique variations
        </p>
      </div>

      <div className="flex gap-4">
        <Link
          href="/gallery"
          className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Browse Gallery
        </Link>
        <Link
          href="/admin/templates"
          className="inline-flex h-11 items-center justify-center rounded-md border border-border px-6 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Admin Panel
        </Link>
      </div>
    </div>
  );
}
