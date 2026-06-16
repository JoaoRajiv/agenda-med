import { ProgressBarProvider } from "@/components/providers/progress-bar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="flex min-h-screen w-full flex-col overflow-hidden antialiased">
				<SidebarTrigger />
				<ProgressBarProvider>{children}</ProgressBarProvider>
			</main>
		</SidebarProvider>
	);
};

export default ProtectedLayout;
