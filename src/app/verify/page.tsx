import { VerificationForm } from "~/components/verification-form";

export default function VerifyPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center">
          <img src="/logo.png" className="w-28 h-28" />
        </a>
        <VerificationForm />
      </div>
    </div>
  );
}


