import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// Wrappers
import QueryClientProviders from "./Wrappers/QueryClientProviders";
import IsAuthenticated from "./Wrappers/IsAuthenticated";

// Components
import ToastContainer from "./components/ToastContainer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
});

export const metadata: Metadata = {
  title: "RenxFrame",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <QueryClientProviders>
        <IsAuthenticated>
          <body className={`${poppins.variable} antialiased`}>
            {children}
            <ToastContainer />
          </body>
        </IsAuthenticated>
      </QueryClientProviders>
    </html>
  );
}
