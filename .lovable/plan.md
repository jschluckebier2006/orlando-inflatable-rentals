## Fix FAQ section on /water-slide-rentals

The FAQ section currently uses a Radix `Accordion` (collapsed by default), so answers are hidden in the DOM until clicked. Search engines can technically still read them, but the user wants them fully visible as plain text. We'll also update the four Q&A entries to the new copy.

### Changes to `src/pages/WaterSlideRentals.tsx`

1. **Update the `faqs` array** with the four new questions/answers exactly as provided:
   - Do I need to provide a water source? — 50 ft garden hose, minimal usage, normal spigot.
   - How much water do water slides use? — ~2–5 gallons/minute, runs continuously.
   - What surface can water slides be set up on? — Grass ideal; dirt/mulch OK; no concrete/asphalt/gravel.
   - Are water slides safe for younger children? — Yes with right slide; tell us ages; adult supervision required.

2. **Replace the Accordion markup** in the FAQ section with a static list. Each item renders the question as a heading and the answer as a paragraph, both always visible:
   ```tsx
   <div className="space-y-6">
     {faqs.map((faq, i) => (
       <div key={i} className="bg-card rounded-lg border border-border p-6">
         <h3 className="font-display font-semibold text-lg text-foreground mb-2">
           {faq.question}
         </h3>
         <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
       </div>
     ))}
   </div>
   ```

3. **Remove unused imports** (`Accordion`, `AccordionContent`, `AccordionItem`, `AccordionTrigger`).

4. **Keep `FAQPageSchema`** with the updated `faqs` array so the structured data stays in sync with the visible copy (good for Google indexing).

No other files need to change.
