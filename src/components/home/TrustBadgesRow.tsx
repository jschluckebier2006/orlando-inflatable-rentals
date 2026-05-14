import { Shield, Zap, Award } from "lucide-react";

const badges = [
  { icon: Shield, label: "Fully Insured" },
  { icon: Zap, label: "Same-Day Response" },
  { icon: Award, label: "5-Star Rated on Google" },
];

export function TrustBadgesRow() {
  return (
    <section className="bg-primary/15 border-y border-primary/25 py-4">
      <div className="container-page px-4">
        <div className="flex flex-row flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {badges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="inline-flex items-center gap-1.5 text-foreground whitespace-nowrap"
            >
              <Icon className="h-4 w-4 text-primary" strokeWidth={2.25} />
              <span className="text-sm font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}