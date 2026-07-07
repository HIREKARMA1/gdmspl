import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToHashElement from "@/components/ScrollToHashElement";

export const metadata = {
  title: "GDMSPL | Geometric Design Management Services",
  description: "Pioneering innovative architectural solutions and crafting sustainable spaces.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ScrollToHashElement />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
