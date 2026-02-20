import "./globals.css";

export const metadata = {
  title: "Pharmacy Wholesale System",
  description: "Inventory & Sales Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        {children}
      </body>
    </html>
  );
}
