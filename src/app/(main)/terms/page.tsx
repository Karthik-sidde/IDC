import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Terms & Conditions</CardTitle>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none text-foreground/90 leading-relaxed space-y-6">
          <section>
            <h2 className="font-headline text-xl font-semibold">1. Introduction</h2>
            <p>Welcome to Indian Data Club (“we”, “us”, “our”), a community focused on data education and networking. These Terms & Conditions govern your use of our website (www.indiandataclub.com), participation in our community, and attendance at our events and workshops. By accessing or using our services, you agree to these terms. If you do not agree, please do not use our services.</p>
          </section>
          <section>
            <h2 className="font-headline text-xl font-semibold">2. Membership</h2>
            <p>Membership in the Indian Data Club is open to individuals interested in data education and networking. Minors may join but are advised to seek parental guidance. Some memberships or events may require payment of fees, which are non-refundable unless otherwise stated in the specific refund policy. By becoming a member, you gain access to our community forums, events, and resources, and you agree to abide by our community guidelines and these terms.</p>
          </section>
          <section>
            <h2 className="font-headline text-xl font-semibold">3. Events and Workshops</h2>
            <p>We offer both free and paid events and workshops. Details and pricing for each event will be provided at the time of registration. Refund and cancellation policies vary by event, and you are encouraged to refer to the specific refund policy for each event. Please note that we may take photos or videos at events for promotional purposes. If you do not wish to be photographed, please notify the event organizer in writing before the event begins.</p>
          </section>
          <section>
            <h2 className="font-headline text-xl font-semibold">4. User Conduct</h2>
            <p>As a member of the Indian Data Club, you agree not to engage in harassment, spamming, or sharing illegal content. You also agree not to violate any laws or infringe on the rights of others while using our services. Violations of these rules may result in warnings, suspension, or termination of membership at our sole discretion.</p>
          </section>
          <section>
            <h2 className="font-headline text-xl font-semibold">5. Content Ownership</h2>
            <p>Members retain ownership of the content they share within the community, such as posts and projects. By sharing content, you grant us a non-exclusive license to use, display, and distribute the content within our community. All materials created by Indian Data Club, including workshop slides, tutorials, logos, and website content, are our exclusive property and protected by copyright laws. These materials cannot be copied, sold, or reused without our written permission.</p>
          </section>
          <section>
            <h2 className="font-headline text-xl font-semibold">6. Payments</h2>
            <p>If paid events are offered, payment details will be provided at the time of registration. Refund policies vary by event, and you are encouraged to refer to the specific refund policy for details.</p>
          </section>
          <section>
            <h2 className="font-headline text-xl font-semibold">7. Data Collection and Privacy</h2>
            <p>We collect personal information such as your name, email address, phone number, and profession through website forms, Discord, and online forms. Your data is used to provide services, communicate with you, and improve our offerings. We do not sell your data to third parties. Your data will be retained until you request deletion. For more details, please read our Privacy Policy.</p>
          </section>
          <section>
            <h2 className="font-headline text-xl font-semibold">8. Amendments</h2>
            <p>We may update these terms from time to time. Changes will be communicated via email. Your continued use of our services after such changes constitutes your acceptance of the updated terms.</p>
          </section>
          <section>
            <h2 className="font-headline text-xl font-semibold">9. Contact Us</h2>
            <p>If you have any legal or compliance queries, please contact us at <a href="mailto:hello@indiandataclub.com" className="text-primary hover:underline">hello@indiandataclub.com</a>.</p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
