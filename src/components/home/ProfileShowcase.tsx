import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/router-compat";
import { ExploreGallery } from "@/components/explore/ExploreGallery";
import { listShowcaseCards, type ShowcaseCard } from "@/lib/showcase.functions";

/** Landing page teaser: the first four admin-picked profiles + a link to /explore. */
export function ProfileShowcase() {
  const [cards, setCards] = useState<ShowcaseCard[] | null>(null);
  useEffect(() => {
    listShowcaseCards()
      .then((c) => setCards(c.slice(0, 4)))
      .catch(() => setCards([]));
  }, []);

  if (cards && cards.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 md:py-14">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Live voorbeelden</p>
        <h2 className="mt-2 font-serif text-2xl font-semibold text-foreground sm:text-3xl">Echte profielen, echte mensen</h2>
      </div>
      <div className="mt-8 min-h-[200px]">{cards && <ExploreGallery cards={cards} />}</div>
      <div className="mt-8 text-center">
        <Link
          to="/explore"
          className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-foreground px-8 font-semibold text-background transition-opacity hover:opacity-90"
        >
          Ontdek meer profielen <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
