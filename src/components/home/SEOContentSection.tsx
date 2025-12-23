import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import waterSlideFun from "@/assets/water-slide-fun-1.jpg";
import kidsBouncingGroup from "@/assets/kids-group-bounce-1.jpg";
import kidsSlide from "@/assets/kids-slide-1.jpg";

export function SEOContentSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="section-padding">
      <div className="container-page">
        <div className="max-w-4xl mx-auto">
          {/* H2: Main Title */}
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            Water Slide Rentals Orlando That Turn Any Event Into a Showstopper
          </h2>
          
          <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
            If you're searching for water slide rentals in Orlando, you're in the right place. Orlando Inflatables has been helping families, schools, churches, and organizations throw unforgettable events for over 15 years. From backyard birthday parties to large-scale festivals, we provide clean, safe, and exciting inflatable rentals that make any celebration better.
          </p>
          
          <p className="text-muted-foreground leading-relaxed mb-6">
            We're locally owned and operated, proudly serving Orlando with professional delivery, well-maintained equipment, and a booking process that's actually easy. Whether you're planning a summer party, school field day, church event, or corporate gathering, our inventory is designed to keep guests entertained and coming back for more.
          </p>

          {/* Expandable Content */}
          <div className={`overflow-hidden transition-all duration-500 ${expanded ? 'max-h-[10000px]' : 'max-h-0'}`}>
            {/* H2: Orlando's Go-To Source */}
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4 mt-8">
              Orlando's Go-To Source for Water Slide Rentals
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Florida heat is no joke, which is why water slide rentals in Orlando are one of our most popular options. Our lineup includes towering single-lane slides, massive dual-lane racers, and tropical-themed slides that feel like a mini water park in your own yard.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">Every water slide is:</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Cleaned and sanitized before every rental</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Delivered and set up by trained professionals</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Designed for safety, durability, and maximum fun</span>
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Whether you're hosting kids, teens, or even adults, our water slides create instant excitement and nonstop action. If you're planning a summer event and want something guests will talk about long after it's over, a water slide rental is the move.
            </p>

            {/* Content Break Image 1 */}
            <div className="my-8 rounded-xl overflow-hidden shadow-lg">
              <img 
                src={waterSlideFun} 
                alt="Kids enjoying a water slide rental in Orlando" 
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>

            {/* H3: Bounce Houses */}
            <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Bounce Houses That Never Go Out of Style
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Bounce houses are a classic for a reason. They work for nearly every type of event and every age group. Orlando Inflatables offers a wide variety of bounce houses, from colorful traditional designs to themed inflatables kids instantly recognize.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-2">Our bounce houses are perfect for:</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Birthday parties</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Family gatherings</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">School events</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Church functions</span>
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-6">
              They're safe, spacious, and built to keep kids active and entertained. If you're looking for an easy win when planning a party, a bounce house rental always delivers.
            </p>

            {/* Content Break Image 2 */}
            <div className="my-8 rounded-xl overflow-hidden shadow-lg">
              <img 
                src={kidsBouncingGroup} 
                alt="Group of kids having fun in a bounce house rental" 
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>

            {/* H3: Bounce and Slide Combos */}
            <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Bounce and Slide Combos for Double the Fun
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Why choose between a bounce house and a slide when you can have both? Our bounce and slide combos combine jumping, climbing, and sliding into one action-packed inflatable.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-2">These units are ideal when:</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">You want more activity in a smaller footprint</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">You're hosting multiple age groups</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">You want a versatile option that works wet or dry</span>
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Bounce and slide combos are a favorite for birthdays and backyard parties because they give kids more to do without needing multiple rentals.
            </p>

            {/* H2: Obstacle Course Rentals */}
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Obstacle Course Rentals That Bring the Competition
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you want high energy and friendly competition, obstacle course rentals are hard to beat. These long, challenging inflatables are perfect for racing, team events, and larger gatherings.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-2">Obstacle courses are popular for:</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">School field days</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Church youth events</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Corporate team-building</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Festivals and community events</span>
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-6">
              They keep lines moving, guests engaged, and energy levels high. When you want something more interactive than a standard inflatable, obstacle courses deliver.
            </p>

            {/* Content Break Image 3 */}
            <div className="my-8 rounded-xl overflow-hidden shadow-lg">
              <img 
                src={kidsSlide} 
                alt="Kids sliding down an inflatable slide at a party" 
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>

            {/* H3: Interactive Games */}
            <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Interactive Games That Keep Everyone Involved
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Interactive inflatables take party entertainment to another level. From sports challenges to skill-based games, these rentals are designed to get guests cheering, competing, and laughing together.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-2">Interactive games are great for:</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Older kids and teens</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Corporate events</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">School carnivals</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Church festivals</span>
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-6">
              They're a perfect way to balance physical activity with friendly competition and crowd engagement.
            </p>

            {/* H3: Concession Rentals */}
            <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Concession Rentals That Complete the Party
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              No event feels complete without snacks. Orlando Inflatables offers concession rentals that add an extra layer of fun and nostalgia to your event.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-2">Popular options include:</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Popcorn machines</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Cotton candy machines</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Snow cone machines</span>
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Concessions are a hit with kids and adults alike and work especially well for school events, festivals, and large gatherings. They're easy to add to any rental package and instantly upgrade the guest experience.
            </p>

            {/* H3: Tables and Chairs */}
            <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Tables and Chairs for a Complete Setup
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Planning an event means thinking beyond entertainment. We offer table and chair rentals to make hosting easier and more organized.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-2">Tables and chairs are perfect for:</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Birthday cake and food areas</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Seating for guests and parents</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Event registration or gift tables</span>
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Pairing inflatables with tables and chairs helps everything run smoother and keeps your event comfortable and stress-free.
            </p>

            {/* H2: Why Orlando Inflatables */}
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Why Orlando Inflatables Is Trusted by So Many Families
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              With over 15 years in business and thousands of events served, Orlando Inflatables has built a reputation for reliability, quality, and customer care. We've earned tons of Google reviews because we consistently show up on time, deliver clean equipment, and make the rental process easy from start to finish.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-2">When you book with us, you can expect:</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Clean and sanitized inflatables</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Professional delivery and setup</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Friendly, knowledgeable service</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Clear communication and reliable scheduling</span>
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We treat every event like it matters, because it does.
            </p>

            {/* H3: Easy Online Booking */}
            <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Easy Online Booking and Real Availability
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We know planning an event can be overwhelming. That's why we've made booking simple. You can browse our inventory, check availability, and reserve your date online in just a few clicks.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              No guessing, no back-and-forth emails, and no surprises. What you see is what you get. If you already know what you want, go ahead and book online. If you're still deciding, checking availability is a great first step to locking in your date.
            </p>

            {/* H3: Perfect for Every Event */}
            <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Perfect for Every Type of Event
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-2">
              Orlando Inflatables proudly serves a wide range of events, including:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Birthday parties</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Backyard celebrations</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">School events and field days</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Church gatherings and festivals</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Corporate events and company parties</span>
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-6">
              No matter the size of your event, we have rentals that fit your space, your crowd, and your goals.
            </p>

            {/* H2: Reserve Your Rental */}
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Reserve Your Water Slide Rental in Orlando Today
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you're searching for water slide rentals Orlando families trust, Orlando Inflatables is ready to help you create an unforgettable event. From massive water slides to bounce houses, obstacle courses, concessions, and more, we make party planning easier and way more fun.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Dates fill quickly, especially during warmer months. Don't wait until the last minute. Your event deserves more than ordinary. Let Orlando Inflatables bring the fun.
            </p>
          </div>

          {/* See More / See Less Button */}
          <Button
            variant="outline"
            onClick={() => setExpanded(!expanded)}
            className="mt-6 flex items-center gap-2"
          >
            {expanded ? (
              <>
                See Less <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                See More <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}