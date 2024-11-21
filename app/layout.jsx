import "./globals.css";
// import "datatables.net-dt/css/jquery.dataTables.css";

export const metadata = {
  title: "Shantnu Watch List",
  description:
    "This is a list of movies and series that I find interesting to watch or would like you to watch",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header></header>
        {children}
      </body>
    </html>
  );
}
