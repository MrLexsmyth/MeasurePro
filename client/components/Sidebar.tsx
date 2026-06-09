"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Menu,
  X,
  LogOut,
  Settings,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: "Customers",
    href: "/dashboard/clients",
    icon: <Users size={20} />,
  },
  // Add more items as needed
  // {
  //   label: "Reports",
  //   href: "/dashboard/reports",
  //   icon: <BarChart3 size={20} />,
  // },
];

const bottomItems = [
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: <Settings size={20} />,
  },
  {
    label: "Help",
    href: "/dashboard/help",
    icon: <HelpCircle size={20} />,
  },
];

export default function Sidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = async () => {
    try {
      // await API.post("/auth/logout");
      // localStorage.clear();
      // router.push("/login");
      console.log("Logout clicked");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const NavLink = ({
    item,
    onClick,
  }: {
    item: NavItem;
    onClick?: () => void;
  }) => {
    const isActive = pathname === item.href;

    return (
      <Link href={item.href} onClick={onClick}>
        <motion.div
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onHoverStart={() => setIsHovering(item.href)}
          onHoverEnd={() => setIsHovering(null)}
          className={`
            relative flex items-center gap-3 px-4 py-3 rounded-lg
            font-medium transition-all duration-200 group
            ${
              isActive
                ? "bg-white/10 text-white shadow-lg"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }
          `}
        >
          {/* Active indicator */}
          {isActive && (
            <motion.div
              layoutId="activeNavIndicator"
              className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-blue-600 rounded-r-lg"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}

          {/* Icon */}
          <motion.div
            animate={
              isActive ? { scale: 1.1, color: "#60a5fa" } : { scale: 1 }
            }
            transition={{ duration: 0.2 }}
            className={isActive ? "text-blue-400" : "text-white/60"}
          >
            {item.icon}
          </motion.div>

          {/* Label */}
          <span className="flex-1">{item.label}</span>

          {/* Badge */}
          {item.badge && (
            <span className="text-xs bg-blue-500/80 px-2 py-1 rounded-full">
              {item.badge}
            </span>
          )}

          {/* Chevron on hover */}
          {isHovering === item.href && !isActive && (
            <motion.div
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-white/40"
            >
              <ChevronRight size={16} />
            </motion.div>
          )}
        </motion.div>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay - Only on mobile */}
      {isMobile && (
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
          )}
        </AnimatePresence>
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={isMobile ? { x: open ? 0 : -280 } : { x: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className={`
          ${isMobile ? "fixed" : "static"}
          top-0 left-0 h-screen w-64 z-50
          bg-gradient-to-br from-[#041459] via-[#0a1f5e] to-[#0d2a6b]
          text-white flex flex-col border-r border-white/10
        `}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 border-b border-white/10 flex items-center justify-between"
        >
          <Link href="/dashboard" onClick={() => isMobile && setOpen(false)}>
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all">
                MP
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg leading-none">MeasurePro</p>
                <p className="text-xs text-white/60 mt-0.5">Dashboard</p>
              </div>
            </div>
          </Link>

          {/* Close Button - Mobile Only */}
          {isMobile && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </motion.button>
          )}
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05, delayChildren: 0.2 }}
            className="space-y-2"
          >
            {navItems.map((item, idx) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <NavLink
                  item={item}
                  onClick={() => isMobile && setOpen(false)}
                />
              </motion.div>
            ))}
          </motion.div>
        </nav>

        {/* Divider */}
        <div className="mx-3 my-4 h-px bg-gradient-to-r from-white/0 via-white/20 to-white/0" />

        {/* Bottom Navigation */}
        <nav className="px-3 py-4 space-y-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05, delayChildren: 0.3 }}
            className="space-y-2"
          >
            {bottomItems.map((item, idx) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <NavLink
                  item={item}
                  onClick={() => isMobile && setOpen(false)}
                />
              </motion.div>
            ))}
          </motion.div>
        </nav>

        {/* Logout Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="border-t border-white/10 p-4"
        >
          <motion.button
            whileHover={{ x: 4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg
                       text-white/70 hover:text-white hover:bg-red-500/10
                       font-medium transition-all duration-200 group"
          >
            <LogOut
              size={20}
              className="text-white/60 group-hover:text-red-400 transition-colors"
            />
            <span className="flex-1">Logout</span>
          </motion.button>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="px-4 py-3 text-xs text-white/40 border-t border-white/10"
        >
          <p>© 2024 MeasurePro</p>
          <p>v1.0.0</p>
        </motion.div>
      </motion.aside>
    </>
  );
}

// Mobile Menu Button for Header
export function SidebarToggle({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setOpen(!open)}
      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors md:hidden"
      aria-label="Toggle sidebar"
    >
      <motion.div
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </motion.div>
    </motion.button>
  );
}