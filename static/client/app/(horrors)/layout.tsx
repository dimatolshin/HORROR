import { Footer } from "../widgets/footer/footer";
import { HeaderHorror } from "../widgets/headerHorror/headerHorror";

export default function HorrorsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeaderHorror />
      {children}
      <Footer />
    </>
  );
}
