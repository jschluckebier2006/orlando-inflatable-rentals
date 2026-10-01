/** "We deliver to [City] — call or text (407) 497-1840 to book your date." with tel:/sms: links. */
export function CallOrTextLine({ city, className }: { city: string; className?: string }) {
  return (
    <span className={className}>
      We deliver to {city} —{" "}
      <a href="tel:4074971840" className="underline font-semibold">call</a> or{" "}
      <a href="sms:4074971840" className="underline font-semibold">text</a>{" "}
      <a href="tel:4074971840" className="underline font-semibold whitespace-nowrap">(407) 497-1840</a> to book your date.
    </span>
  );
}
