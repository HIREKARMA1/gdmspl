import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToHashElement from "@/components/ScrollToHashElement";
import HideOnAdmin from "@/components/layout/HideOnAdmin";
import "./globals.css";
import "@/styles/legacy/bundle.css";

export const metadata = {
  title: "GDMSPL | Geometric Design Management Services",
  description: "Pioneering innovative architectural solutions and crafting sustainable spaces.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <HideOnAdmin>
          <ScrollToHashElement />
          <Header />
        </HideOnAdmin>
        <main>{children}</main>
        <HideOnAdmin>
          <Footer />
        </HideOnAdmin>
      </body>
    </html>
  );
}
