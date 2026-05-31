import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">{children}</main>
      </SidebarProvider>
    </div>
  );
};
export default ProtectedLayout;
