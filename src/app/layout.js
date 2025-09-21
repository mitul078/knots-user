import Nav from "../components/navbar/Nav";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "./providers";

export const metadata = {
  title: "Knots - Social Media App",
  description:
    "Knots is a modern social media app where you can connect, share, and engage with friends. Built with Next.js, it offers a clean UI, smooth navigation, and real-time interactions for an enhanced social experience.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400..700;1,400..700&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />

        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet"></link>
      </head>
      <body>

        <Providers>

          {children}
          <Nav />
          <Toaster position="top-center" />
        </Providers>



      </body>
    </html>
  );
}
