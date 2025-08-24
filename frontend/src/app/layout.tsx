import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spec2Labs - API to Tutorials",
  description: "Transform OpenAPI specifications into interactive tutorials",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Spec2Labs
                  </h1>
                  <span className="ml-2 text-sm text-gray-500">
                    API to Tutorials
                  </span>
                </div>
                <nav className="flex space-x-4">
                  <a href="/" className="text-gray-700 hover:text-blue-600">
                    Home
                  </a>
                  <a href="/new" className="text-gray-700 hover:text-blue-600">
                    New Tutorial
                  </a>
                </nav>
              </div>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
