import { CMSLayout } from "@/components/cms";

export default function RootCMSLayout({ children }: { children: React.ReactNode }) {
  return <CMSLayout>{children}</CMSLayout>;
}
