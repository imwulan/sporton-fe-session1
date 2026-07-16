"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiShoppingBag, FiMenu, FiX } from "react-icons/fi";
import Container from "../ui/container";
import { useCart } from "../../context/cart-context";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Category", href: "#" },
  { label: "Explore Products", href: "#" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();

  return (
    <header className="relative">
      <Container className="flex items-center justify-between gap-6 py-5 lg:gap-10 lg:py-7">
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo.svg"
            alt="sporton logo"
            width={127}
            height={30}
            priority
          />
        </Link>

        <nav aria-label="Main navigation" className="hidden gap-24 font-medium lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={
                link.label === "Home"
                  ? "relative after:content-[''] after:block after:bg-primary after:rounded-full after:h-[3px] after:w-1/2 after:absolute after:left-1/2 after:-translate-x-1/2 after:translate-y-1"
                  : undefined
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5 sm:gap-7 lg:gap-10">
          <button type="button" aria-label="Search">
            <FiSearch size={24} className="cursor-pointer" />
          </button>

          <button
            type="button"
            aria-label={`Open cart${totalItems > 0 ? `, ${totalItems} items` : ""}`}
            onClick={openCart}
            className="relative"
          >
            <FiShoppingBag size={24} className="cursor-pointer" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-primary text-center text-[10px] text-white">
                {totalItems}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            className="cursor-pointer lg:hidden"
          >
            {isMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>
      </Container>

      {isMenuOpen && (
        <Container>
          <nav
            id="mobile-nav"
            aria-label="Mobile navigation"
            className="flex flex-col gap-6 pb-6 font-medium lg:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={link.label === "Home" ? "text-primary" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </Container>
      )}
    </header>
  );
};

export default Header;
