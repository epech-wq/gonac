import SignInForm from "@/components/auth/SignInForm";
import AuthLayout from "@/components/auth/AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
}
