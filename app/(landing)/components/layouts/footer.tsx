import Image from "next/image";
import Link from "next/link";
import Container from "../ui/container";

const Footer = () => {
  return (
    <footer className="mt-24 bg-dark-alternate text-white sm:mt-36 lg:mt-52">
      <Container className="flex flex-col gap-10 pb-16 pt-12 sm:pt-14 lg:flex-row lg:justify-between lg:gap-0 lg:pb-24">
        <div className="w-full lg:w-105">
          <Image
            src="/images/logo-footer.svg"
            alt="logo sporton footer"
            width={188}
            height={44}
          />
          <p className="mt-6 leading-relaxed sm:mt-8">
            Engineered for endurance and designed for speed. Experience gear
            that moves as fast as you do.
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-8 sm:w-auto sm:gap-16 lg:w-105 lg:gap-0">
          <nav aria-label="Quick links">
            <h2 className="sr-only">Quick Links</h2>
            <div className="flex flex-col gap-5 sm:gap-7">
              <Link href="#">Home</Link>
              <Link href="#">Categories</Link>
              <Link href="#">Products</Link>
              <Link href="#">About Us</Link>
            </div>
          </nav>

          <nav aria-label="Social media">
            <h2 className="sr-only">Follow Us</h2>
            <div className="flex flex-col gap-5 sm:gap-7">
              <Link href="#">Instagram</Link>
              <Link href="#">Facebook</Link>
              <Link href="#">TikTok</Link>
              <Link href="#">YouTube</Link>
            </div>
          </nav>
        </div>
      </Container>

      <div className="border-t border-t-white/15">
        <Container className="flex flex-col items-center gap-4 py-6 text-center text-sm sm:flex-row sm:justify-between sm:py-6.5 sm:text-left sm:text-base">
          <p>SportsOn © 2025 All Rights Reserved.</p>

          <nav aria-label="Legal links">
            <div className="grid grid-cols-2 gap-6 sm:w-105 sm:gap-0">
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Terms Conditions</Link>
            </div>
          </nav>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
