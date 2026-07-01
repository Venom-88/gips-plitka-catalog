import Hero from "@/components/Hero";
import Advantages from "@/components/Advantages";
import Categories from "@/components/Categories";
import Bestsellers from "@/components/Bestsellers";
import Works from "@/components/Works";
import About from "@/components/About";
import Process from "@/components/Process";
import B2B from "@/components/B2B";
import Reviews from "@/components/Reviews";
import Guarantees from "@/components/Guarantees";
import LeadForm from "@/components/LeadForm";
import { getBestsellers, getReviews, getSiteImages } from "@/lib/catalog";

// Главная статична — кешируем, ревалидация по необходимости.
export const revalidate = 60;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Гипс Стиль 31",
  description: "Студия гипсовой плитки ручной работы в Губкине.",
  address: { "@type": "PostalAddress", addressLocality: "Губкин", addressCountry: "RU" },
  openingHours: "Mo-Su 09:00-20:00",
  priceRange: "₽₽",
};

export default async function HomePage() {
  const [products, reviews, images] = await Promise.all([getBestsellers(), getReviews(), getSiteImages()]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero imageUrl={images.heroImageUrl} imagePos={images.heroImagePos} />
      <Advantages />
      <Categories />
      <Bestsellers products={products} />
      <Works />
      <About imageUrl={images.aboutImageUrl} imagePos={images.aboutImagePos} />
      <Process />
      <B2B />
      <Reviews reviews={reviews} />
      <Guarantees />
      <LeadForm />
    </>
  );
}
