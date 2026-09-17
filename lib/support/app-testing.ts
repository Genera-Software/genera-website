/* Requests to join the mobile app betas — TestFlight on iPhone, Google Play
   closed testing on Android. Shared by the docs support form and the public
   ticket route, so every request is filed the same way. */

export const TEST_PLATFORMS = ["ios", "android", "both"] as const;

/** Google Play closed-testing opt-in page. It only works once the person's
 *  Google account is on the testers list, so it's shown after they've asked
 *  to be added — never as a bare link. */
export const PLAY_TESTING_URL =
  "https://play.google.com/apps/testing/com.genera.driver";
export type TestPlatform = (typeof TEST_PLATFORMS)[number];

export const TEST_PLATFORM_LABEL: Record<TestPlatform, string> = {
  ios: "iPhone (TestFlight)",
  android: "Android (closed testing)",
  both: "iPhone (TestFlight) and Android (closed testing)",
};

/** The subject and body a tester request is filed with. */
export function appTestingTicket(
  platform: TestPlatform,
  name: string,
  email: string,
): { subject: string; description: string } {
  const apps = TEST_PLATFORM_LABEL[platform];
  return {
    subject: `Tester request: ${apps}`,
    description: [
      `Please add me as a tester for ${apps}.`,
      "",
      `Name: ${name}`,
      `Email: ${email}`,
    ].join("\n"),
  };
}
