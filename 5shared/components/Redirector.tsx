"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export function Redirector() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.isBanned && pathname !== "/banned") {
      router.push("/banned");
    }
  }, [session?.user?.isBanned, pathname, router]);

  return null;
}
