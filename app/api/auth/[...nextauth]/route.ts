import NextAuth from "next-auth";
import { authOptions } from "@/5shared/lib/auth/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
