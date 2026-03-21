import { AppPageFrame } from "@/components/app/AppPageFrame";
import { TrendViewPage } from "@/components/pages";

export default function ProductTrendsPage() {
  return (
    <AppPageFrame
      eyebrow="Trends"
      title="See market movement before you take action."
      description="Review token price movement, supporting metrics, and market context from a dedicated trends surface inside the app."
    >
      <TrendViewPage />
    </AppPageFrame>
  );
}
