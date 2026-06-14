import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { entranceSchema, type EntranceFormData, type OAuthProvider } from "./Entrance.type";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

    const result = await signIn("credentials", {
      redirect: false,
      login: data.login,
      password: data.password,
    });

    if (result?.error) {
      setServerError("Неверный логин или пароль");
      return;
    }

    router.push("/profile");
  });

  const handleOAuthSignIn = (provider: OAuthProvider) => {
    signIn(provider, { callbackUrl: "/profile" });
  };

  return { register, handleOnSubmit, errors, serverError, isSubmitting, handleOAuthSignIn };
}
