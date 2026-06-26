import "./globals.css";
import { QueryProvider } from "@/5shared/providers/QueryProvider";
import { Redirector } from "@/5shared/components/Redirector";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <QueryProvider>{children}</QueryProvider>
        <Redirector />
      </body>
    </html>
  );
}
