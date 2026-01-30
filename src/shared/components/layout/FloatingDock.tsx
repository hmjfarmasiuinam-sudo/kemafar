'use client';

/**
 * FloatingDock Component
 * "Liquid Glass" navigation pill that floats at the bottom of the screen.
 * Replaces the traditional top navbar.
 */

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/config/navigation.config';
import { cn } from '@/shared/utils/cn';
import { motion } from 'framer-motion';
import { Info, Users, Mic, Calendar, UserCircle, type LucideIcon } from 'lucide-react';
import { useSectionDetection } from '@/shared/hooks/useSectionDetection';

type NavIcon = LucideIcon | 'custom-logo';

const NAV_ITEMS: Array<{ label: string; href: string; icon: NavIcon }> = [
    { label: 'Beranda', href: ROUTES.home, icon: 'custom-logo' },
    { label: 'Tentang', href: ROUTES.about, icon: Info },
    { label: 'Event', href: ROUTES.events, icon: Calendar },
    { label: 'Artikel', href: ROUTES.articles, icon: Mic },
    { label: 'Kepengurusan', href: ROUTES.leadership, icon: Users },
    { label: 'Anggota', href: ROUTES.members, icon: UserCircle },
];

export function FloatingDock() {
    const pathname = usePathname();
    const sectionType = useSectionDetection();

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] md:bottom-auto md:top-8">
            <div className="relative group">
                {/* Liquid Glass Container */}
                <div
                    className={cn(
                        "flex items-center gap-1 md:gap-2 px-2 py-2 md:px-3 md:py-2.5",
                        "backdrop-blur-2xl shadow-2xl",
                        "rounded-full transition-all duration-300",
                        "hover:scale-[1.02]",
                        // Adaptive based on section detection
                        sectionType === 'light'
                            ? "bg-gray-900/40 border border-white/40 shadow-black/20 hover:bg-gray-900/50"
                            : "bg-white/30 border border-white/50 shadow-white/10 hover:bg-white/40"
                    )}
                    style={{
                        boxShadow: sectionType === 'light'
                            ? '0 8px 32px 0 rgba(0, 0, 0, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
                            : '0 8px 32px 0 rgba(31, 38, 135, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
                    }}
                >
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        const isCustomLogo = Icon === 'custom-logo';

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative"
                                aria-label={item.label}
                            >
                                <div
                                    className={cn(
                                        "relative flex items-center justify-center rounded-full transition-all duration-300",
                                        "hover:bg-white/20",
                                        isActive && "text-white",
                                        // Wider when custom logo is inactive
                                        isCustomLogo && !isActive
                                            ? "w-auto h-10 md:h-12 px-3 md:px-4 gap-2"
                                            : "w-10 h-10 md:w-12 md:h-12"
                                    )}
                                >
                                    {/* Active Background Pill */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="absolute inset-0 bg-primary-600 rounded-full shadow-[0_0_20px_rgba(83,113,146,0.5)]"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}

                                    {/* Icon */}
                                    <div className={cn(
                                        "relative z-10 flex items-center gap-2 transition-colors duration-200",
                                        !isCustomLogo && (isActive
                                            ? "text-white"
                                            : sectionType === 'light'
                                                ? "text-white group-hover:text-white"
                                                : "text-gray-800 group-hover:text-gray-950")
                                    )}>
                                        {isCustomLogo ? (
                                            <>
                                                <motion.div
                                                    className={cn(
                                                        "relative w-6 h-6 md:w-7 md:h-7 flex-shrink-0 transition-all duration-200 rounded-lg flex items-center justify-center",
                                                        !isActive && "bg-white/90 shadow-md backdrop-blur-sm"
                                                    )}
                                                    whileHover={!isActive ? { scale: 1.05 } : {}}
                                                    whileTap={!isActive ? { scale: 0.95 } : {}}
                                                >
                                                    <div className="relative w-full h-full p-1">
                                                        <Image
                                                            src={isActive ? "/icons/logo-active.webp" : "/icons/logo-inactive.webp"}
                                                            alt="Home"
                                                            fill
                                                            className="object-contain transition-all duration-200"
                                                            sizes="32px"
                                                        />
                                                    </div>
                                                </motion.div>
                                                {!isActive && (
                                                    <motion.span
                                                        initial={{ opacity: 0, width: 0 }}
                                                        animate={{ opacity: 1, width: "auto" }}
                                                        exit={{ opacity: 0, width: 0 }}
                                                        className={cn(
                                                            "text-xs md:text-sm font-bold whitespace-nowrap transition-colors duration-200",
                                                            sectionType === 'light'
                                                                ? "text-white group-hover:text-white"
                                                                : "text-gray-800 group-hover:text-gray-950"
                                                        )}
                                                    >
                                                        Beranda
                                                    </motion.span>
                                                )}
                                            </>
                                        ) : (
                                            <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
                                        )}
                                    </div>

                                    {/* Tooltip (Desktop) */}
                                    <div className={cn(
                                        "absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-0 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm",
                                        "md:top-full md:mt-2 md:-top-auto", // Position below on desktop
                                        "group-hover:opacity-100 hidden md:block" // Only show on desktop hover
                                    )}>
                                        {item.label}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
