import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const { registered } = await searchParams;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px] -z-10 mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[128px] -z-10 mix-blend-screen pointer-events-none" />
      
      <div className="w-full max-w-md space-y-8 glass-card p-8 rounded-2xl animate-fade-in relative z-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Sign in to continue generating stickers
          </p>
        </div>
        {registered && (
          <div className="rounded-md bg-green-500/10 border border-green-500/20 p-3 text-sm text-green-400">
            Account created successfully! Please sign in.
          </div>
        )}
        <LoginForm />
      </div>
    </div>
  );
}
