import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Wrappers
import QueryClientProviders from "./Wrappers/QueryClientProviders";
import IsAuthenticated from "./Wrappers/IsAuthenticated";
import FetchData from "./Wrappers/FetchData";
import NotAvailable from "./Wrappers/NotAvailable";

// Components
import ToastContainer from "./components/ToastContainer";

// Windows
import SitesListWindow from "./windows/SitesListWindow";
import CreateNewProjectWindow from "./windows/CreateNewProject";
import WorkspaceWindow from "./windows/WorkspaceWindow";

const inter = Inter({
  variable: "--font-inter",
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
      <body className={`${inter.className} antialiased select-none`}>
        <NotAvailable>
          <QueryClientProviders>
            <IsAuthenticated>
              <FetchData>
                {children}
                <SitesListWindow />
                <CreateNewProjectWindow />
                <WorkspaceWindow />
                <ToastContainer />
              </FetchData>
            </IsAuthenticated>
          </QueryClientProviders>
        </NotAvailable>
      </body>
    </html>
  );
}
