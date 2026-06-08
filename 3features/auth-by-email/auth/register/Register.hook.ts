import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "./Register.type";
import { registerUser } from "@/3features/auth-by-email/auth/actions/register";

export function useRegister() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { login: "", password: "" },
  });

  const handleOnSubmit = handleSubmit(async (data: RegisterFormData) => {
    await registerUser(data);
  });

  return { register, handleOnSubmit, errors };
}
