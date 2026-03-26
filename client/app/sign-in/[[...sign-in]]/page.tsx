import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-base)]">
      <SignIn routing="path" path="/sign-in" />
    </div>
  );
}
