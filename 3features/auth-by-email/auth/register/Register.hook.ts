import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "./Register.type";
import { registerUser } from "@/3features/auth-by-email/auth/actions/register";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function useRegister() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { login: "", password: "" },
  });

  const handleOnSubmit = handleSubmit(async (data: RegisterFormData) => {
    setServerError(null)
    const result = await registerUser(data)

    if (result.status === "error") {
      setServerError(result.message)
      return
    }

    // Юзер создан — логиним его чтобы получить сессию
    const signInResult = await signIn("credentials", {
      redirect: false,
      login: data.login,
      password: data.password,
    })

    if (signInResult?.error) {
      setServerError("Регистрация прошла, но войти не удалось. Попробуй войти вручную.")
      return
    }

    router.push("/profile")
  });

  return { register, handleOnSubmit, errors, serverError, isSubmitting };
}
