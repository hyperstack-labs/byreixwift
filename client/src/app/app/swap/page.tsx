import { AppPageFrame } from "@/components/app/AppPageFrame";
import { SwapPage } from "@/components/pages";

export default function ProductSwapPage() {
  return (
    <AppPageFrame
      eyebrow="Swap"
      title="Review a token quote before you move value."
      description="Use the swap flow to inspect token conversion details, pricing context, and estimated outcomes before confirming any action."
    >
      <SwapPage />
    </AppPageFrame>
  );
}
