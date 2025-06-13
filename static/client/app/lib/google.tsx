import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";

interface GoogleAnalyticsProps {
  id: string;
}

export function GoogleAnalytics({ id }: GoogleAnalyticsProps) {
  return <NextGoogleAnalytics gaId={id} />;
}
