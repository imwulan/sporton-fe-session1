import { FiFastForward } from "react-icons/fi";
import Button from "../ui/button";
import Container from "../ui/container";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section id="hero-section" className="lg:relative">
      <Container className="flex min-h-screen items-center py-16 lg:h-screen lg:py-0">
        <div className="flex w-full flex-col-reverse items-center gap-10 lg:relative lg:flex-row lg:items-stretch lg:gap-0">
          <Image
            src="/images/img-basketball.png"
            width={432}
            height={423}
            alt="image sporton"
            className="hidden grayscale lg:absolute lg:-top-20 lg:left-0 lg:block"
          />

          <div className="relative w-full text-center lg:w-auto lg:ml-40 lg:self-center lg:text-left">
            <div className="text-primary italic">Friday Sale, 50%</div>
            <h1 className="mt-2 bg-gradient-to-b from-black to-[#979797] bg-clip-text text-4xl font-extrabold italic leading-tight text-transparent sm:text-5xl md:text-6xl lg:text-[95px]">
              WEAR YOUR <br /> TOP-QUALITY <br /> SPORTSWEAR
            </h1>
            <p className="mx-auto mt-6 leading-loose sm:w-3/4 lg:mx-0 lg:mt-10 lg:w-1/2">
              Engineered for endurance and designed for speed. Experience gear
              that moves as fast as you do. Premium fabrics. Unmatched comfort.
              Limitless motion.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:mt-14 lg:justify-start lg:gap-5">
              <Button>
                Explore More <FiFastForward />
              </Button>
              <Button variant="ghost">
                Watch Video{" "}
                <Image
                  src="/images/icon-play-video.svg"
                  alt="icon playvideo"
                  width={29}
                  height={29}
                />
              </Button>
            </div>
          </div>

          <Image
            src="/images/img-hero.png"
            width={623}
            height={688}
            alt="image sporton hero"
            sizes="(max-width: 639px) 224px, (max-width: 767px) 288px, (max-width: 1023px) 384px, 700px"
            className="w-56 sm:w-72 md:w-96 lg:absolute lg:-right-5 lg:top-1/2 lg:w-auto lg:-translate-y-1/2"
            priority
          />
        </div>
      </Container>

      <Image
        src="/images/img-ornament-hero.svg"
        width={413}
        height={413}
        alt="image sporton"
        className="hidden lg:absolute lg:-right-[200px] lg:top-1/2 lg:block lg:-translate-y-1/2"
      />
    </section>
  );
};

export default HeroSection;
