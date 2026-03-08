import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const { registered } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to your account to continue
          </p>
        </div>
        {registered && (
          <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700">
            Account created successfully! Please sign in.
          </div>
        )}
        <LoginForm />
      </div>
    </div>
  );
}
