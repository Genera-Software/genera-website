import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createMetadata({
    title: "Genera Driver App Support | Genera Software",
    description:
      "Help and support for the Genera Driver iOS app — sign in, location permissions, notifications, troubleshooting and how to contact us.",
    path: "/driver-support",
  }),
};

const BODY = `
<p>Last updated: 9 September 2026</p>

<p>This page is the support home for the <strong>Genera Driver</strong> iOS app, used by drivers and staff of pet care businesses that run on Genera. If something isn't working, start here — and if you can't find the answer, email us and a human will reply.</p>

<h2>Contact us</h2>
<ul>
  <li><strong>Email</strong> — <a href="mailto:help@generasoftware.com">help@generasoftware.com</a></li>
  <li><strong>Response time</strong> — we aim to reply within one working day (Monday to Friday, UK hours)</li>
  <li><strong>Company</strong> — Genera Software Ltd, registered in England and Wales (Company No. 15009675), C/O Mjf Accountancy, 47 Booker Avenue, Liverpool, England, L18 4QZ</li>
</ul>
<p>To help us fix things faster, please include your name, the business you drive for, your iPhone model and iOS version, and roughly when the problem happened.</p>

<h2>Getting started</h2>
<p>Genera Driver is a workplace app. Your account is created by the business you work for, not by you — there is no public sign-up.</p>
<ol>
  <li>Ask your manager to add you as a driver or staff member in Genera. They'll set the email address you sign in with.</li>
  <li>Install <strong>Genera Driver</strong> from the App Store and open it.</li>
  <li>Sign in with that email address and the password you were given or set.</li>
  <li>Allow location access when prompted, so your route can share live progress. Turn on notifications if you'd like alerts about routes, notes and messages.</li>
</ol>
<p>If you can't sign in, the most common cause is that your account hasn't been created yet, or has been created with a different email address. Check with your manager first.</p>

<h2>Common questions</h2>

<h3>I've forgotten my password</h3>
<p>Use the password reset link on the sign-in screen, and follow the email that arrives. If no email arrives within a few minutes, check your spam folder and confirm with your manager which address your account uses.</p>

<h3>Live tracking isn't showing my position</h3>
<p>The app only shares location while it is open and you are on an active run. Check the following:</p>
<ul>
  <li>Location permission is granted — iOS <strong>Settings &rarr; Privacy &amp; Security &rarr; Location Services &rarr; Genera Driver</strong>, set to <em>While Using the App</em>.</li>
  <li><strong>Precise Location</strong> is switched on for the app in that same screen.</li>
  <li>You have started the route in the app, and the app is open on screen rather than backgrounded or locked.</li>
  <li>You have a mobile data signal. Points collected in a dead spot may take a moment to catch up once you're back in coverage.</li>
</ul>
<p>Low Power Mode reduces location accuracy and sampling frequency, so turn it off if tracking looks coarse.</p>

<h3>I'm not receiving notifications</h3>
<p>Check that notifications are enabled in iOS <strong>Settings &rarr; Notifications &rarr; Genera Driver</strong>, and that Focus or Do Not Disturb isn't filtering them. Signing out clears every device registered to your account, so sign back in and re-enable notifications in the app if you've recently signed out.</p>

<h3>My route or stops look wrong</h3>
<p>Routes, stops, owners and pets all come from your employer's Genera account. If a stop is missing or in the wrong order, ask whoever schedules your work to correct it in Genera — it will update in the app. Pull down to refresh if you don't see a change straight away.</p>

<h3>The app is slow, blank or crashing</h3>
<ul>
  <li>Force quit the app and reopen it.</li>
  <li>Check you're on the latest version in the App Store.</li>
  <li>Confirm you have a working internet connection.</li>
  <li>If it persists, email us with the time it happened and what you were doing — we can look at the logs from our side.</li>
</ul>

<h2>Your account and your data</h2>
<p>Driver accounts are created and removed by the business that employs you, so to close your account please ask them first. You can also email <a href="mailto:info@generasoftware.com">info@generasoftware.com</a> to request access to, or deletion of, your personal data and we will action or forward the request within 30 days.</p>
<p>For full detail on what the app collects — including precise location data, what it is used for and how to withdraw permission — see the <a href="/privacy-policy#genera-driver-app">Genera Driver section of our Privacy Policy</a>.</p>

<h2>Not a driver?</h2>
<p>If you run a pet care business and want to know more about Genera, visit our <a href="/">homepage</a> or <a href="/contact">get in touch</a>.</p>
`;

export default function DriverSupportPage() {
  return (
    <>
      <Reveal />

      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-8 py-24 text-white">
        <div className="mx-auto max-w-[860px] text-center">
          <p className="eyebrow !text-gold-soft">Support</p>
          <h1 className="mt-2 text-white">Genera Driver app support</h1>
          <p className="mt-4 font-niveau text-body-lg leading-[1.7] text-white/80">
            Help with the Genera Driver iOS app — sign in, location, notifications and getting hold of us.
          </p>
        </div>
      </section>

      <section className="bg-cream px-6 py-16 md:px-8 md:py-24">
        <article
          className="rev mx-auto max-w-[720px] font-niveau text-body-lg leading-[1.75] text-ink-soft [&_a]:font-semibold [&_a]:text-forest [&_a]:underline [&_a]:decoration-gold [&_a]:underline-offset-2 hover:[&_a]:text-forest-mid [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:scroll-mt-28 [&_h2]:font-massilia [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-[var(--leading-title)] [&_h2]:text-forest [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:scroll-mt-28 [&_h3]:font-massilia [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-forest [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-5 [&_strong]:font-bold [&_strong]:text-forest [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: BODY }}
        />
      </section>
    </>
  );
}
