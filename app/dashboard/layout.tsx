export const metadata = {
  title: "Dashboard | FinWiseAI",
  description: "Manage your financial activities and loan applications",
};

import { DashboardClientWrapper } from "./dashboard-client-wrapper";
import { LanguageProvider } from "@/context/language-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <DashboardClientWrapper>{children}</DashboardClientWrapper>
    </LanguageProvider>
  );
}
