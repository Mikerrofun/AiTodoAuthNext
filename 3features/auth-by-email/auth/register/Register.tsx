"use client";

import { useRegister } from "./Register.hook";

export function Register() {
  const { register, handleSubmit, errors, onSubmit } = useRegister();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Регистрация
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Login */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="login"
              className="text-sm font-medium text-gray-600"
            >
              Логин
            </label>
            <input
              id="login"
              type="text"
              placeholder="Введите логин"
              {...register("login", { required: "Логин обязателен" })}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            {errors.login && (
              <span className="text-xs text-red-500">{errors.login.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-600"
            >
              Пароль
            </label>
            <input
              id="password"
              type="password"
              placeholder="Введите пароль"
              {...register("password", {
                required: "Пароль обязателен",
                minLength: { value: 6, message: "Минимум 6 символов" },
              })}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            {errors.password && (
              <span className="text-xs text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition"
          >
            Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  );
}
