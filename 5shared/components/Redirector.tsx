"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSessionStore } from "@/5shared/store/useSessionStore";

export function Redirector() {
  const router = useRouter();
  const pathname = usePathname();
  const isBanned = useSessionStore((s) => s.isBanned);

  useEffect(() => {
    if (isBanned && pathname !== "/banned") {
      router.push("/banned");
    }
  }, [isBanned, pathname, router]);

  return null;
}
