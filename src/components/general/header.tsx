"use client";

import { LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, type FC } from "react";
import { FaFacebook, FaLinkedin, FaSignal, FaTwitter } from "react-icons/fa6";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface HeaderProps {
  disabled?: boolean;
}

function getLinkProps(href: string, disabled?: boolean, baseClass?: string) {
  return {
    href: disabled ? "#" : href,
    onClick: disabled ? (e: React.MouseEvent) => e.preventDefault() : undefined,
    className: cn(
      baseClass,
      disabled && "cursor-not-allowed pointer-events-none text-gray-400",
    ),
  };
}

const links = [
  { href: "/", title: "Home" },
  { href: "/artisan", title: "Craft School" },
  { href: "/safari", title: "Craft Safari" },
  { href: "/fair", title: "Craft Fair" },
  { href: "/shop", title: "Craft Store" },
  { href: "/", title: "Craft Documenter" },
  { href: "/", title: "Eco Retreat" },
  { href: "/", title: "Dining Voyage" },
  { href: "/", title: "Eco Transit" },
  { href: "/", title: "Travel Planner" },
  { href: "/", title: "Language Services" },
];

export const Header: FC<HeaderProps> = ({ disabled = false }) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-[103] flex w-full flex-col bg-secondary text-white transition-colors duration-300",
        isScrolled && "bg-primary",
      )}
    >
      <div
        className={cn(
          "hidden gap-6 bg-primary p-6 py-2 text-white lg:flex",
          isScrolled && "lg:hidden",
        )}
      >
        <div className="mx-auto flex justify-between">
          <div className="flex items-center gap-1 font-text xl:gap-3 2xl:gap-12">
            <p className="font-bold">
              DE KOSHUR CRAFTS&apos; - Kashmir Craft & Tourism Convergence
              initiative
            </p>
            <div className="flex items-center gap-2">
              <div className="flex gap-2">
                <Link
                  {...getLinkProps(
                    "#",
                    disabled,
                    "flex items-center gap-2  text-sm xl:text-base",
                  )}
                >
                  <FaTwitter />
                </Link>
                <Link
                  {...getLinkProps(
                    "#",
                    disabled,
                    "flex items-center gap-2  text-sm xl:text-base",
                  )}
                >
                  <FaFacebook />
                </Link>
                <Link
                  {...getLinkProps(
                    "#",
                    disabled,
                    "flex items-center gap-2  text-sm xl:text-base",
                  )}
                >
                  <FaLinkedin />
                </Link>
                <Link
                  {...getLinkProps(
                    "#",
                    disabled,
                    "flex items-center gap-2  text-sm xl:text-base",
                  )}
                >
                  <FaSignal />
                </Link>
              </div>
              <div className="hidden h-7 w-1 bg-white md:block" />
              <Button
                size="sm"
                variant="ghost"
                className={cn(
                  "text-xs text-white xl:text-base",
                  disabled &&
                    "pointer-events-none cursor-not-allowed opacity-50",
                )}
                asChild
              >
                <Link {...getLinkProps("#", disabled)}>
                  <LogIn />
                  Login
                </Link>
              </Button>
              <div className="hidden h-7 w-1 bg-white md:block" />
              <Button
                size="sm"
                variant="ghost"
                className={cn(
                  "text-xs text-white xl:text-base",
                  disabled &&
                    "pointer-events-none cursor-not-allowed opacity-50",
                )}
                asChild
              >
                <Link {...getLinkProps("#", disabled)}>
                  <LogIn />
                  Sign in
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex justify-between p-4">
        <div className="relative ml-6 h-[30px] w-[100px] md:ml-0 xl:h-[50px] xl:w-[100px]">
          <Image
            src="/logo/logo_2.png"
            alt="logo for artstay"
            fill
            sizes="100%"
            priority
          />
        </div>
        <div className="flex items-center px-3 py-4 lg:mx-auto">
          <nav className="hidden lg:flex">
            <menu className="flex items-center gap-1 font-bold">
              {links.map((link, index) => (
                <li key={index}>
                  <Button
                    variant="link"
                    className={cn(
                      "text-lg text-white",
                      isScrolled && "text-white",
                    )}
                    asChild
                  >
                    <Link href={disabled ? '#':link.href}>{link.title}</Link>
                  </Button>
                </li>
              ))}
            </menu>
            {/* <Button
              size="lg"
              type="button"
              variant={isScrolled ? "outline" : "default"}
              asChild
            >
              <Link href="join-us">Join us</Link>
            </Button> */}
          </nav>
        </div>
      </div>
    </header>
  );
};
