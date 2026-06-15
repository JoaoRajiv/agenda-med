"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	return (
		<motion.div
			key={pathname} // Isso força a animação rodar a cada troca de rota
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ ease: "easeInOut", duration: 0.4 }}
			className="h-full w-full"
		>
			{children}
		</motion.div>
	);
}
