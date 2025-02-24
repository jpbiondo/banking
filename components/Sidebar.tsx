"use client";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Footer from "./Footer";

export const Sidebar = ({ user }: { user: User }) => {
  const pathName = usePathname();
  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        <Link href="/" className="flex mb-12 cursor-pointer items-center gap-2">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Horizon Logo"
            className="size-[24px] max-xl:size-14"
          />
          <h1 className="sidebar-logo">Horizon</h1>
        </Link>
        {sidebarLinks.map((sidebarLink) => {
          const isActive =
            pathName === sidebarLink.route ||
            pathName.startsWith(`${sidebarLink.route}`);
          return (
            <Link
              href={sidebarLink.route}
              key={sidebarLink.label}
              className={cn("sidebar-link", {
                "bg-bank-gradient": isActive,
              })}
            >
              <div className="relative size-6">
                <Image
                  src={sidebarLink.imgURL}
                  alt={sidebarLink.label}
                  fill
                  className={cn({
                    "brightness-[3] invert-0": isActive,
                  })}
                />
              </div>
              <p className={cn("sidebar-label", { "!text-white": isActive })}>
                {sidebarLink.label}
              </p>
            </Link>
          );
        })}
        USER
      </nav>
      <Footer user={user} type="desktop" />
    </section>
  );
};
