export const metadata = {
  title: "Dashboard | FinWiseAI",
  description: "Manage your financial activities and loan applications",
};

import { DashboardClientWrapper } from "./dashboard-client-wrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardClientWrapper>{children}</DashboardClientWrapper>;
}
