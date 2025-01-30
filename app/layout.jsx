import "./globals.css";

export const metadata = {
  title: "Shantnu Watch List",
  description:
    "This is a list of movies and series that I find interesting to watch or would like you to watch",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="m-0 p-0">
        <header></header>
        {children}
      </body>
    </html>
  );
}
