import { Link } from "react-router-dom";

const cities = [
  { name: "Alafaya", slug: "alafaya" },
  { name: "Avalon Park", slug: "avalon-park" },
  { name: "Azalea Park", slug: "azalea-park" },
  { name: "Bithlo", slug: "bithlo" },
  { name: "Christmas", slug: "christmas" },
  { name: "Chuluota", slug: "chuluota" },
  { name: "Eastwood", slug: "eastwood" },
  { name: "Stoneybrook", slug: "stoneybrook" },
  { name: "Waterford Lakes", slug: "waterford-lakes" },
  { name: "Wedgefield", slug: "wedgefield" },
];

export function DeliveryAreaLinks() {
  return (
    <section className="section-padding section-alt">
      <div className="container-page">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Delivery Areas We Serve
          </h2>
          <p className="text-muted-foreground mb-8">
            Free delivery and professional setup throughout East Orlando and Orange County.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {cities.map((c) => (
              <Link
                key={c.slug}
                to={`/water-slide-and-bounce-house-rental-${c.slug}`}
                className="bg-card border border-border rounded-lg px-4 py-3 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors font-medium"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
