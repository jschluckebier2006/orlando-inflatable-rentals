import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

export default function PrivacyPolicy() {
  return (
    <Layout>
      <SEOHead
        title="Privacy Policy | Orlando Inflatables"
        description="Privacy Policy for Orlando Inflatable Rentals, LLC. Learn how we collect, use, and protect your personal information."
        canonical="/privacy-policy"
      />
      <BreadcrumbSchema items={[{ name: "Privacy Policy", href: "/privacy-policy" }]} />

      <section className="section-padding">
        <div className="container-page">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">
              Privacy Policy for Orlando Inflatable Rentals, LLC
            </h1>

            <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">Who we are</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              <strong>Orlando Inflatable Rentals, LLC</strong> – Our website address is:{" "}
              <a href="https://orlandoinflatables.com" className="text-primary hover:underline">
                https://orlandoinflatables.com
              </a>
            </p>

            <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">Comments</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor's IP address and browser user agent string to help spam detection.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here: https://automattic.com/privacy/. After approval of your comment, your profile picture is visible to the public in the context of your comment.
            </p>

            <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">Media</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.
            </p>

            <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">Cookies</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select "Remember Me", your login will persist for two weeks. If you log out of your account, the login cookies will be removed.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after 1 day.
            </p>

            <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">Embedded content from other websites</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.
            </p>

            <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">Who we share your data with</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              If you request a password reset, your IP address will be included in the reset email.
            </p>

            <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">How long do we retain your data?</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              For users that register on our website (if any), we also store the personal information they provide in their user profiles. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.
            </p>

            <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">What rights you have over your data</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              If you have an account on this site or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.
            </p>

            <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">Security</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We always use industry-standard encryption technologies when transferring and receiving consumer data exchanged with our site. We have appropriate security measures in place in our physical facilities to protect against the loss, misuse, or alteration of information that we have collected from you at our site. If you feel that this site is not following its stated information policy, please feel free to contact us.
            </p>

            <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">Credit Card transactions</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We guarantee that your Credit Card transactions are safe and secure. You do not have to be concerned. We also guarantee the safety of any information you provide us. Your Safety and Security are Important to us.
            </p>

            <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">Credit Card Guarantee</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Based on the Fair Credit Billing Act passed by the U.S. Congress, your bank is not allowed to hold you liable for more than $50.00 of fraudulent charges. If your bank should decide to exercise their right to hold you liable for that $50.00, Orlando Inflatable Rentals LLC will reimburse you for that amount, up to the full $50.00. We will only cover your liability if the unauthorized use of your credit card was caused by no fault of your own from purchases made with us while using our SSL secure server.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              In the event that you suffer a loss due to unauthorized use of the credit card, according to law, you must notify your credit card company immediately based on the reporting rules and procedures which they have provided you.
            </p>

            <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">What will you do with my personal information?</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We are very concerned about how other websites use our personal information (name, e-mail address, preferences, etc.). We at Orlando Inflatable Rentals are committed to your privacy. As a result, we will always make sure that any information you elect to provide us is kept confidential. We pledge that we will never provide that information to anyone else.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We only use your e-mail address and, any other information you elect to provide us, to better serve you and to keep you informed about changes in our site, party, and rental ideas and suggestions, or new products and special pricing only available to our customers. You can rest assured that your information is safe with us. We look forward to serving you.
            </p>

            <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">Where we send your data</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Visitor comments may be checked through an automated spam detection service.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
