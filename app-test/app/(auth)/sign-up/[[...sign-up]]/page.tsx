import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen auth-bg-pattern flex items-center justify-center p-8">
      <SignUp />
    </div>
  );
}
