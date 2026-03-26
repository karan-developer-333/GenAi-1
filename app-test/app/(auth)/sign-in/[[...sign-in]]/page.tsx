import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen auth-bg-pattern flex items-center justify-center p-8">
      <SignIn />
    </div>
  );
}
