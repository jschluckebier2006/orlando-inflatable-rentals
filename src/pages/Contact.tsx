import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { JotformEmbed } from "@/components/JotformEmbed";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <Layout>
      <SEOHead title="Contact Us - Get a Free Quote" description="Contact Orlando Inflatables for bounce house and party rental quotes. Call (407) 497-1840 or fill out our form for fast, friendly service in East Orlando." canonical="/contact" />
      <BreadcrumbSchema items={[{ name: "Contact", href: "/contact" }]} />
      <section className="section-padding">
        <div className="container-page">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">Contact Us</h1>
          <p className="text-muted-foreground text-lg text-center mb-12 max-w-2xl mx-auto">Ready to book? Fill out the form below or give us a call!</p>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <JotformEmbed height="800px" />
            </div>
            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="font-display text-xl font-semibold mb-4">Get in Touch</h2>
                <div className="space-y-4">
                  <a href="tel:4074971840" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                    <Phone className="h-5 w-5 text-primary" />
                    <span>(407) 497-1840</span>
                  </a>
                  <a href="mailto:orlandoinflatablesllc@gmail.com" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>orlandoinflatablesllc@gmail.com</span>
                  </a>
                  <div className="flex items-center gap-3 text-foreground">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>East Orlando, FL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
