import { SignInForm } from "@/components/auth/sign-in-form";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await auth();
  
  // If user is already signed in, redirect to dashboard
  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <SignInForm />
      </div>
    </div>
  );
}
