import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[128px] -z-10 mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] -z-10 mix-blend-screen pointer-events-none" />
      
      <div className="w-full max-w-md space-y-8 glass-card p-8 rounded-2xl animate-fade-in relative z-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Join us to start generating unique stickers
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
