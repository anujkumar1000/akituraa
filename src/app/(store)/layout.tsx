import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { getCategories } from "@/lib/data/repository";
import { SITE } from "@/lib/utils";
import { Navbar, TaskbarBottom, TitleBarTop } from "@/components/xp/chrome";

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  slogan: SITE.tagline,
  sameAs: [SITE.instagram, SITE.pinterest, SITE.tiktok],
};

export default async function StoreLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const categories = await getCategories();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <TitleBarTop />
      <AnnouncementBar />
      {/* <Header categories={categories} /> */}
      <Navbar categories={categories} />
      <main>{children}</main> <TaskbarBottom />
      <Footer />
      <CartDrawer />
    </>
  );
}
