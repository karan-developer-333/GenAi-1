import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-base)]">
      <SignUp routing="path" path="/sign-up" />
    </div>
  );
}
