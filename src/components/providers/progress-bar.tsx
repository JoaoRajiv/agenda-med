"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { Suspense } from "react";

export function ProgressBarProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{children}
			<Suspense fallback={null}>
				<ProgressBar
					height="4px"
					color="#14b8a6" // Seu Teal 500
					options={{ showSpinner: false }}
					shallowRouting
					delay={0} // 🚨 Zera o delay: obriga a barra a aparecer imediatamente ao clicar
					style={`
            #nprogress .bar {
              z-index: 99999 !important; /* Garante que a barra fique por cima de modais/sidebars */
            }
          `}
				/>
			</Suspense>
		</>
	);
}
