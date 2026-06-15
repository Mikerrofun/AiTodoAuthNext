"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Plus, X } from "lucide-react";
import { useCreateTodo } from "./CreateTodo.hook";

export function CreateTodoDialog() {
  const [open, setOpen] = useState(false);
  const { register, handleOnSubmit, errors, isSubmitting, serverError } = useCreateTodo({
    onSuccess: () => setOpen(false),
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          aria-label="Создать задачу"
        >
          <Plus size={16} />
          Новая задача
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-lg font-semibold text-gray-800">
              Новая задача
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600 transition" aria-label="Закрыть">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleOnSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="title" className="text-sm font-medium text-gray-600">
                Заголовок
              </label>
              <input
                id="title"
                type="text"
                placeholder="Введите заголовок"
                {...register("title")}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {errors.title && (
                <span className="text-xs text-red-500">{errors.title.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="description" className="text-sm font-medium text-gray-600">
                Описание <span className="text-gray-400 font-normal">(необязательно)</span>
              </label>
              <textarea
                id="description"
                placeholder="Введите описание"
                rows={3}
                {...register("description")}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition"
            >
              {isSubmitting ? "Создание..." : "Создать"}
            </button>

            {serverError && (
              <span className="text-xs text-red-500 text-center">{serverError}</span>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
