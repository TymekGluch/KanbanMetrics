import { getUserFetch } from "@/api/getUserFetch";
import { QueryProvider } from "@/providers/QueryProvider/QueryProvider";
import { UserProvider } from "@/providers/UserProvider/UserProvider";
import { ResponsiveProvider } from "@/responsive/Responsive.Provider";
import { parseUABreakpoint } from "@/responsive/utils/parseUABreakpoint";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.scss";
import styles from "./layout.module.scss";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") ?? "";
  const ssrBreakpoint = parseUABreakpoint(userAgent);

  const user = await getUserFetch(headersList);

  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className={inter.className}>
        <QueryProvider>
          <ResponsiveProvider ssrBreakpoint={ssrBreakpoint}>
            <UserProvider user={user}>
              <div className={styles.layout}>{children}</div>
            </UserProvider>
          </ResponsiveProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
