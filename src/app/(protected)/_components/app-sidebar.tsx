"use client";

import {
	CalendarDays,
	Gem,
	LayoutDashboard,
	LogOut,
	Stethoscope,
	UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { PlanBadge } from "./plan-badge";

const items = [
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		title: "Agendamentos",
		url: "/appointments",
		icon: CalendarDays,
	},
	{
		title: "Médicos",
		url: "/doctors",
		icon: Stethoscope,
	},
	{
		title: "Pacientes",
		url: "/patients",
		icon: UsersRound,
	},
];

export function AppSidebar() {
	const router = useRouter();
	const session = authClient.useSession();
	const pathname = usePathname();

	const handleSignOut = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/authentication");
				},
			},
		});
	};
	return (
		<Sidebar>
			<SidebarHeader className="flex flex-row items-center border-b p-4 justify-center">
				<div className="flex items-center gap-1">
					<Image src="/logo.svg" alt="Doutor Agenda" width={28} height={28} />
					<span className="font-nunito text-md font-bold">agenda.med</span>
				</div>
				<PlanBadge plan={session.data?.user?.plan || "free"} size="sm" />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild isActive={pathname === item.url}>
										<Link href={item.url}>
											<item.icon
												className={`${pathname === item.url ? "text-primary" : "text-muted-foreground"} font-medium`}
											/>
											<span
												className={`${pathname === item.url ? "text-primary" : "text-muted-foreground"} font-medium`}
											>
												{item.title}
											</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>Outros</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={pathname === "/subscription"}
								>
									<Link href="/subscription">
										<Gem />
										<span className="font-medium">Assinatura</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton size="lg">
									<Avatar>
										<AvatarFallback>
											{session.data?.user?.image ? (
												<Image
													src={session.data.user.image}
													alt={session.data.user.name}
													width={32}
													height={32}
												/>
											) : (
												session.data?.user?.name?.[0] || "U"
											)}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className="text-sm">
											{session.data?.user?.clinic?.name}
										</p>
										<p className="text-muted-foreground text-sm">
											{session.data?.user.email}
										</p>
									</div>
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem onClick={handleSignOut}>
									<LogOut />
									Sair
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
