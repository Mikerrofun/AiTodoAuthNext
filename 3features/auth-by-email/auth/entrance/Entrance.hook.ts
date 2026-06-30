import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { entranceSchema, type EntranceFormData, type OAuthProvider } from "./Entrance.type";
import { checkLoginStatus } from "@/3features/auth-by-email/auth/actions/checkLoginStatus";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthErrorMessage } from "@/5shared/lib/auth/authErrors";

export function useEntrance() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EntranceFormData>({
    resolver: zodResolver(entranceSchema),
    defaultValues: { login: "", password: "" },
  });

  const handleOnSubmit = handleSubmit(async (data: EntranceFormData) => {
    setServerError(null);

    const banCheck = await checkLoginStatus(data.login);
    
    if (banCheck.status === "success" && banCheck.data?.banned) {
      router.push("/banned");
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      login: data.login,
      password: data.password,
    });

    if (result?.error) {
      // Get translated error message from error code
      const errorMessage = getAuthErrorMessage(result.error);
      setServerError(errorMessage);
      return;
    }

    router.push("/profile");
  });

  const handleOAuthSignIn = (provider: OAuthProvider) => {
    signIn(provider, { callbackUrl: "/profile" });
  };

  return { register, handleOnSubmit, errors, serverError, isSubmitting, handleOAuthSignIn };
}
