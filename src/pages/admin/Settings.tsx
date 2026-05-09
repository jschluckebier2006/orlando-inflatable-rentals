import { TAX_RATE, DAMAGE_WAIVER_RATE } from "@/lib/pricing";

export default function Settings() {
  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="font-display text-2xl md:text-3xl font-bold">Settings</h1>
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <h2 className="font-semibold">Pricing</h2>
        <div className="text-sm space-y-1">
          <div className="flex justify-between"><span>Sales tax rate</span><span>{(TAX_RATE * 100).toFixed(1)}%</span></div>
          <div className="flex justify-between"><span>Damage waiver rate</span><span>{(DAMAGE_WAIVER_RATE * 100).toFixed(1)}%</span></div>
          <div className="flex justify-between"><span>Default deposit</span><span>$50</span></div>
        </div>
        <p className="text-xs text-muted-foreground">
          These are configured in code. Ask the developer to change rates.
        </p>
      </div>
      <div className="bg-card border border-border rounded-lg p-4 space-y-2">
        <h2 className="font-semibold">Delivery zones</h2>
        <p className="text-sm text-muted-foreground">
          Delivery zip-code fees live in <code className="text-xs bg-muted px-1.5 py-0.5 rounded">src/data/deliveryZones.ts</code>.
          Tell the developer the zip and the fee to update them.
        </p>
      </div>
    </div>
  );
}
