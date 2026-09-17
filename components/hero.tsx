import Image from "next/image";
import Link from "next/link";

const SLIDES = [
  {
    id: "slide-1",
    eyebrow: "Nouvelle collection",
    title: "L’automne se porte simple",
    text: "Des pièces faciles à assortir, livrées chez vous en 24 h.",
    cta: { href: "/categorie/femme", label: "Voir la collection femme" },
    image: "https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/1.webp",
    tone: "bg-sand",
  },
  {
    id: "slide-2",
    eyebrow: "Jusqu’à −50 %",
    title: "Les bonnes affaires de la semaine",
    text: "Prix barrés sur une sélection de chemises, robes et sneakers.",
    cta: { href: "#promos", label: "Voir les promos" },
    image: "https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/1.webp",
    tone: "bg-[#efeae3]",
  },
  {
    id: "slide-3",
    eyebrow: "Rentrée des petits",
    title: "Enfant, du 2 au 10 ans",
    text: "Des matières douces qui passent au lave-linge sans broncher.",
    cta: { href: "/categorie/enfant", label: "Voir la collection enfant" },
    image: "https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/1.webp",
    tone: "bg-[#f3f1ec]",
  },
];

export function Hero() {
  return (
    <section aria-label="Mises en avant">
      <div className="snap-row flex overflow-x-auto">
        {SLIDES.map((slide) => (
          <div
            key={slide.id}
            id={slide.id}
            className={`snap-item w-full shrink-0 ${slide.tone}`}
          >
            <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 py-10 sm:grid-cols-2 sm:py-14">
              <div className="order-2 sm:order-1">
                <p className="text-[11px] font-bold tracking-[0.22em] text-promo uppercase">
                  {slide.eyebrow}
                </p>
                <h1 className="mt-3 text-3xl leading-tight font-extrabold sm:text-5xl">
                  {slide.title}
                </h1>
                <p className="mt-4 max-w-md text-sm text-muted sm:text-base">{slide.text}</p>
                <Link
                  href={slide.cta.href}
                  className="mt-7 inline-block bg-ink px-7 py-3 text-sm font-semibold text-white hover:bg-promo"
                >
                  {slide.cta.label}
                </Link>
              </div>

              <div className="relative order-1 aspect-[4/3] sm:order-2 sm:aspect-square">
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  priority={slide.id === "slide-1"}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 bg-sand pb-5">
        {SLIDES.map((slide, i) => (
          <a
            key={slide.id}
            href={`#${slide.id}`}
            aria-label={`Aller à la mise en avant ${i + 1}`}
            className="h-2 w-8 bg-ink/20 transition-colors hover:bg-ink"
          />
        ))}
      </div>
    </section>
  );
}
