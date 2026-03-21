import { AppPageFrame } from "@/components/app/AppPageFrame";
import { SendPage } from "@/components/pages";

export default function ProductSendPage() {
  return (
    <AppPageFrame
      eyebrow="Send"
      title="Transfer funds with a cleaner review step."
      description="Confirm the recipient, amount, memo, and network cost before you send funds through the app."
    >
      <SendPage />
    </AppPageFrame>
  );
}
