import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Backend Intern Task",
  description: "Auth + Tasks demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        {children}
        <Toaster /> {/* 🔥 Global toast notifications */}
      </body>
    </html>
  );
}
