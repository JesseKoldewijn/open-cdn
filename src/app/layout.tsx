import "../styles/tailwind.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className="system">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
