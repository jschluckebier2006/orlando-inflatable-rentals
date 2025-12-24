import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

interface Review {
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
}

// Default reviews for homepage and pages without city context
const defaultReviews: Review[] = [
  {
    name: "Sarah M.",
    location: "Waterford Lakes",
    rating: 5,
    text: "Orlando Inflatables made my son's birthday party amazing! The bounce house was clean, set up on time, and the kids had a blast. Highly recommend!",
    date: "2 weeks ago",
  },
  {
    name: "Michael T.",
    location: "Avalon Park",
    rating: 5,
    text: "We rented a water slide for our summer party and it was a hit! Professional service from start to finish. Will definitely use again.",
    date: "1 month ago",
  },
  {
    name: "Jennifer K.",
    location: "Alafaya",
    rating: 5,
    text: "The obstacle course we rented was perfect for our church event. Great communication and fair pricing. Thank you Orlando Inflatables!",
    date: "3 weeks ago",
  },
  {
    name: "David R.",
    location: "Stoneybrook",
    rating: 5,
    text: "Best rental company in East Orlando! They showed up early, set everything up quickly, and the equipment was in excellent condition.",
    date: "1 week ago",
  },
];

// City-specific reviews
const cityReviews: Record<string, Review[]> = {
  "Waterford Lakes": [
    {
      name: "Sarah M.",
      location: "Waterford Lakes",
      rating: 5,
      text: "Orlando Inflatables made my son's birthday party amazing! The bounce house was clean, set up on time, and the kids had a blast. Highly recommend!",
      date: "2 weeks ago",
    },
    {
      name: "Amanda P.",
      location: "Waterford Lakes",
      rating: 5,
      text: "We've used them three times now for parties at our Waterford Lakes home. Always reliable, always professional. The kids love the water slides!",
      date: "3 weeks ago",
    },
    {
      name: "Robert L.",
      location: "Waterford Lakes",
      rating: 5,
      text: "Great experience renting the obstacle course for my daughter's birthday. Setup was quick and the equipment was spotless. Will use again!",
      date: "1 month ago",
    },
    {
      name: "Christina H.",
      location: "Waterford Lakes",
      rating: 5,
      text: "Fantastic service from start to finish! They delivered right on time to our Waterford Lakes address. The bounce house was a huge hit!",
      date: "2 weeks ago",
    },
  ],
  "Avalon Park": [
    {
      name: "Michael T.",
      location: "Avalon Park",
      rating: 5,
      text: "We rented a water slide for our summer party and it was a hit! Professional service from start to finish. Will definitely use again.",
      date: "1 month ago",
    },
    {
      name: "Jessica R.",
      location: "Avalon Park",
      rating: 5,
      text: "Perfect for our Avalon Park neighborhood block party! Everyone loved the bounce house combo. Great prices and amazing service!",
      date: "2 weeks ago",
    },
    {
      name: "Daniel K.",
      location: "Avalon Park",
      rating: 5,
      text: "The team was so helpful and professional. They set everything up in our Avalon Park backyard and the kids had the best time ever!",
      date: "3 weeks ago",
    },
    {
      name: "Michelle S.",
      location: "Avalon Park",
      rating: 5,
      text: "We've recommended Orlando Inflatables to all our Avalon Park neighbors. Excellent equipment, fair pricing, and super friendly staff!",
      date: "1 week ago",
    },
  ],
  "Alafaya": [
    {
      name: "Jennifer K.",
      location: "Alafaya",
      rating: 5,
      text: "The obstacle course we rented was perfect for our church event. Great communication and fair pricing. Thank you Orlando Inflatables!",
      date: "3 weeks ago",
    },
    {
      name: "Carlos M.",
      location: "Alafaya",
      rating: 5,
      text: "Best party rental experience in Alafaya! The bounce house was clean, safe, and the kids absolutely loved it. Booking was so easy!",
      date: "2 weeks ago",
    },
    {
      name: "Patricia W.",
      location: "Alafaya",
      rating: 5,
      text: "We had our son's 7th birthday in Alafaya and the water slide was the highlight! Professional delivery and pickup. Highly recommend!",
      date: "1 month ago",
    },
    {
      name: "Kevin T.",
      location: "Alafaya",
      rating: 5,
      text: "Orlando Inflatables serves the Alafaya area with excellent service. Our neighborhood party was a huge success thanks to them!",
      date: "3 weeks ago",
    },
  ],
  "Stoneybrook": [
    {
      name: "David R.",
      location: "Stoneybrook",
      rating: 5,
      text: "Best rental company in East Orlando! They showed up early, set everything up quickly, and the equipment was in excellent condition.",
      date: "1 week ago",
    },
    {
      name: "Lauren B.",
      location: "Stoneybrook",
      rating: 5,
      text: "We've used Orlando Inflatables for three parties at our Stoneybrook home. Always on time, always clean equipment. The kids love them!",
      date: "2 weeks ago",
    },
    {
      name: "Thomas G.",
      location: "Stoneybrook",
      rating: 5,
      text: "The combo bounce house with slide was perfect for our Stoneybrook backyard. Setup and takedown were quick and professional!",
      date: "3 weeks ago",
    },
    {
      name: "Samantha J.",
      location: "Stoneybrook",
      rating: 5,
      text: "Excellent experience from booking to pickup! Our Stoneybrook neighborhood event was a blast. Fair prices and great communication!",
      date: "1 month ago",
    },
  ],
  "Christmas": [
    {
      name: "Mark H.",
      location: "Christmas",
      rating: 5,
      text: "So glad Orlando Inflatables delivers to Christmas! The kids had an amazing time on the bounce house. Will definitely rent again!",
      date: "2 weeks ago",
    },
    {
      name: "Emily C.",
      location: "Christmas",
      rating: 5,
      text: "We were worried about finding rentals in Christmas, FL but these guys came through! Professional, on-time, and great equipment!",
      date: "3 weeks ago",
    },
    {
      name: "Brian F.",
      location: "Christmas",
      rating: 5,
      text: "Perfect water slide for our summer party in Christmas! The delivery team was friendly and setup was quick. Highly recommend!",
      date: "1 month ago",
    },
    {
      name: "Lisa M.",
      location: "Christmas",
      rating: 5,
      text: "Orlando Inflatables made our Christmas community event special! Great service and the obstacle course was a huge hit with everyone!",
      date: "2 weeks ago",
    },
  ],
  "Chuluota": [
    {
      name: "Ryan P.",
      location: "Chuluota",
      rating: 5,
      text: "Excellent service in Chuluota! The bounce house was clean and safe. The kids had a blast at my daughter's birthday party!",
      date: "2 weeks ago",
    },
    {
      name: "Megan D.",
      location: "Chuluota",
      rating: 5,
      text: "We love that they deliver to Chuluota! Always professional, always reliable. We've used them for multiple family events now.",
      date: "3 weeks ago",
    },
    {
      name: "Anthony V.",
      location: "Chuluota",
      rating: 5,
      text: "The water slide was the best decision for our Chuluota backyard party! Setup was quick and the kids didn't want to get off!",
      date: "1 month ago",
    },
    {
      name: "Heather N.",
      location: "Chuluota",
      rating: 5,
      text: "Orlando Inflatables provides top-notch service to Chuluota. Fair pricing and amazing equipment. Can't wait to book again!",
      date: "1 week ago",
    },
  ],
  "Bithlo": [
    {
      name: "James W.",
      location: "Bithlo",
      rating: 5,
      text: "Great to find a company that delivers to Bithlo! The bounce house was in perfect condition and the kids loved it!",
      date: "2 weeks ago",
    },
    {
      name: "Angela R.",
      location: "Bithlo",
      rating: 5,
      text: "We had our church event in Bithlo and Orlando Inflatables made it special. Professional service and great communication!",
      date: "3 weeks ago",
    },
    {
      name: "Steven K.",
      location: "Bithlo",
      rating: 5,
      text: "The obstacle course was perfect for our Bithlo community gathering. Everyone had a great time. Highly recommend!",
      date: "1 month ago",
    },
    {
      name: "Nicole B.",
      location: "Bithlo",
      rating: 5,
      text: "Orlando Inflatables serves Bithlo with the same great service as anywhere else. Clean equipment, on-time delivery, fair prices!",
      date: "2 weeks ago",
    },
  ],
  "Wedgefield": [
    {
      name: "Christopher A.",
      location: "Wedgefield",
      rating: 5,
      text: "Fantastic experience with Orlando Inflatables in Wedgefield! The water slide was perfect for our summer birthday party!",
      date: "2 weeks ago",
    },
    {
      name: "Stephanie L.",
      location: "Wedgefield",
      rating: 5,
      text: "We love that they deliver to Wedgefield! The combo bounce house was a hit. Professional setup and friendly staff!",
      date: "3 weeks ago",
    },
    {
      name: "Jonathan M.",
      location: "Wedgefield",
      rating: 5,
      text: "Our Wedgefield neighborhood loves Orlando Inflatables! We've used them for multiple block parties. Always excellent!",
      date: "1 month ago",
    },
    {
      name: "Kimberly S.",
      location: "Wedgefield",
      rating: 5,
      text: "Best rental company serving Wedgefield! Clean equipment, fair prices, and they always show up on time. Highly recommend!",
      date: "1 week ago",
    },
  ],
  "Azalea Park": [
    {
      name: "Marcus J.",
      location: "Azalea Park",
      rating: 5,
      text: "Orlando Inflatables made my son's birthday in Azalea Park unforgettable! The bounce house was clean and setup was fast!",
      date: "2 weeks ago",
    },
    {
      name: "Diana T.",
      location: "Azalea Park",
      rating: 5,
      text: "We've recommended them to everyone in Azalea Park! Great prices, professional service, and the kids always have a blast!",
      date: "3 weeks ago",
    },
    {
      name: "Victor R.",
      location: "Azalea Park",
      rating: 5,
      text: "The water slide was perfect for our Azalea Park backyard party! Easy booking and excellent customer service!",
      date: "1 month ago",
    },
    {
      name: "Rachel H.",
      location: "Azalea Park",
      rating: 5,
      text: "Excellent experience from start to finish! They delivered to our Azalea Park home right on time. Will use again!",
      date: "2 weeks ago",
    },
  ],
  "Eastwood": [
    {
      name: "William C.",
      location: "Eastwood",
      rating: 5,
      text: "Great service in the Eastwood area! The bounce house combo was perfect for our kids' party. Professional and reliable!",
      date: "2 weeks ago",
    },
    {
      name: "Amanda K.",
      location: "Eastwood",
      rating: 5,
      text: "We love Orlando Inflatables! They always deliver great service to Eastwood. Clean equipment and friendly team!",
      date: "3 weeks ago",
    },
    {
      name: "Derek M.",
      location: "Eastwood",
      rating: 5,
      text: "The obstacle course was amazing for our Eastwood neighborhood event! Everyone had a fantastic time. Highly recommend!",
      date: "1 month ago",
    },
    {
      name: "Tiffany B.",
      location: "Eastwood",
      rating: 5,
      text: "Best party rental company serving Eastwood! On-time delivery, clean equipment, and great communication throughout!",
      date: "1 week ago",
    },
  ],
};

interface ReviewsSectionProps {
  cityName?: string;
}

export function ReviewsSection({ cityName }: ReviewsSectionProps) {
  // Get city-specific reviews or fall back to default
  const reviews = cityName && cityReviews[cityName] ? cityReviews[cityName] : defaultReviews;

  return (
    <section className="section-padding">
      <div className="container-page">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our {cityName ? `${cityName} ` : ""}Customers Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Don't just take our word for it - hear from families{cityName ? ` in ${cityName}` : " across East Orlando"}!
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <Card key={index} className="h-full">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary/20 mb-4" aria-hidden="true" />
                <p className="text-foreground mb-4 leading-relaxed">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-1 mb-3" role="img" aria-label={`${review.rating} out of 5 stars`}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      aria-hidden="true"
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "text-accent fill-accent"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{review.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {review.location} • {review.date}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
