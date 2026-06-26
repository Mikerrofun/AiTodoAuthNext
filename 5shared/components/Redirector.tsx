"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/5shared/store/useSessionStore";

export function Redirector() {
  const router = useRouter();
  const isBanned = useSessionStore((s) => s.isBanned);

  useEffect(() => {
    if (isBanned) {
      router.push("/banned");
    }
  }, [isBanned, router]);

  return null;
}
