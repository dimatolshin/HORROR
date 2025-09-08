import { Footer } from "../widgets/footer/footer";
import { HeaderDocuments } from "../widgets/headerDocuments/headerDocuments";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeaderDocuments />
      {children}
      <Footer />
    </>
  );
}
