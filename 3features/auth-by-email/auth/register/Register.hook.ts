import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "./Register.type";

export function useRegister() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { login: "", password: "" },
  });

  const onSubmit = (data: RegisterFormData) => {
    // TODO: implement registration logic
    void data;
  };

  return { register, handleSubmit, errors, onSubmit };
}
