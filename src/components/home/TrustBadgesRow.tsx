import { Shield, Zap, Award } from "lucide-react";

const badges = [
  { icon: Shield, label: "Fully Insured" },
  { icon: Zap, label: "Same-Day Response" },
  { icon: Award, label: "5-Star Rated on Google" },
];

export function TrustBadgesRow() {
  return (
    <section className="bg-secondary/30 border-y border-border py-5">
      <div className="container-page">
        <div className="flex flex-nowrap items-center justify-center gap-4 md:gap-10 overflow-x-auto">
          {badges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="inline-flex items-center gap-2 text-foreground"
            >
              <Icon className="h-5 w-5 text-primary" strokeWidth={2.25} />
              <span className="text-sm md:text-base font-semibold">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}