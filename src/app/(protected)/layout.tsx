import { ProgressBarProvider } from "@/components/providers/progress-bar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className={`w-full antialiased`}>
				<SidebarTrigger />
				<ProgressBarProvider>{children}</ProgressBarProvider>
			</main>
		</SidebarProvider>
	);
};
export default ProtectedLayout;
