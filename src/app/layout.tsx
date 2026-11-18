import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { TessroProvider } from "@/lib/tessro-context";
import CookieConsent from "@/components/CookieConsent";

export const metadata: Metadata = {
  title: "Intelligence Designed To Evolve — Tessro",
  description: "Bespoke digital architecture and autonomous design intelligence by Tessro & Adeline.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#ededeb",
          colorBackground: "#0c0c0d",
          borderRadius: "0.5rem",
        },
        elements: {
          card: "bg-[#0c0c0d] border border-white/10 shadow-2xl backdrop-blur-xl",
          formButtonPrimary:
            "bg-white text-black hover:bg-neutral-200 font-medium transition-all duration-200",
          footerActionLink: "text-white hover:text-neutral-300 underline",
        },
      } as any}
    >
      <html lang="en" className="dark">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,300..500;1,6..72,300..500&family=Inter:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          />
          <link
            href="https://db.onlinewebfonts.com/c/8cb707a9b8a73f8a7403336b861c3074?family=BubbledotICG-FinePos"
            rel="stylesheet"
          />
          <link
            href="https://db.onlinewebfonts.com/c/e55e9079ee863276569c8a68d776ef04?family=Futura+Md+BT+Medium"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
            integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        </head>
        <body className="bg-black text-white min-h-screen overflow-x-clip antialiased">
          <TessroProvider>
            {children}
            <CookieConsent />
          </TessroProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
