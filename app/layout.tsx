import "./globals.css";
import { QueryProvider } from "@/5shared/providers/QueryProvider";
import { SessionProviderWrapper } from "@/5shared/providers/SessionProviderWrapper";
import { Redirector } from "@/5shared/components/Redirector";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <SessionProviderWrapper>
          <QueryProvider>{children}</QueryProvider>
          <Redirector />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
