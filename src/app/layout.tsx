import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
export const metadata: Metadata = {
  title: "Rituel — Un petit geste. Chaque jour.",
  description:
    "Ton traqueur d’habitudes personnel. Cultive ta régularité avec un calendrier visuel et garde tes données sur ton appareil.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="dark">
      <body>
        {children}
        <Toaster theme="dark" richColors position="bottom-right" />
      </body>
    </html>
  );
}
