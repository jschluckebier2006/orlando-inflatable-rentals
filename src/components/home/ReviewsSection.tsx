import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const reviews = [
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

export function ReviewsSection() {
  return (
    <section className="section-padding">
      <div className="container-page">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Don't just take our word for it - hear from families across East Orlando!
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
