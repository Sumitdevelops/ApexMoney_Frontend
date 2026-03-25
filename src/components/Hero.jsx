// src/components/Hero.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { TypingAnimation } from "./ui/typing-animation";
import { Particles } from "./ui/particles";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Hero = () => {
  return (
    <>
      <section className="relative flex flex-col-reverse md:flex-row items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 overflow-hidden">
        <Particles className="absolute inset-0 -z-10" />

        {/* Left Content */}
        <div className="w-full md:w-1/2 text-center md:text-left mt-12 md:mt-0 flex flex-col items-center md:items-start justify-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-amber-50 leading-tight">
            <TypingAnimation
              words={["Financial Clarity 💸", "Effortlessly Achieved ✔️"]}
            />
          </h1>

          <p className="mt-6 max-w-md mx-auto md:mx-0 text-lg text-gray-600 dark:text-gray-400">
            Stop wondering where your money goes. ApexMoney is the simple, smart
            app for tracking expenses, managing budgets, and growing your
            savings.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              to="/signup/login"
              className="group inline-flex items-center justify-center rounded-md bg-purple-600 dark:bg-amber-500 px-6 py-3 text-base font-semibold text-white dark:text-gray-900 shadow-md hover:bg-purple-700 dark:hover:bg-amber-600 transition"
            >
              Start for Free
              <ArrowRightIcon className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="#demo"
              className="inline-flex items-center justify-center rounded-md bg-white dark:bg-white/10 px-6 py-3 text-base font-semibold text-purple-600 dark:text-amber-400 ring-1 ring-inset ring-purple-200 dark:ring-amber-500/30 hover:bg-purple-50 dark:hover:bg-white/15 transition"
            >
              See a Demo
            </a>
          </div>
        </div>

        {/* Right Content: Lottie Animation */}
        <div className="w-full md:w-1/2 flex justify-center items-center mt-10 md:mt-0 overflow-hidden">
          <div className="relative w-full flex justify-center items-center overflow-hidden">
            <DotLottieReact
              src="/animation.lottie"
              loop
              autoplay
              className="
                w-full max-w-[600px] h-auto
                scale-[1.25] sm:scale-[1.15] md:scale-[1.05]
                transition-transform duration-300
              "
              style={{
                transformOrigin: "center",
              }}
            />
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <div className="text-center pb-12 px-4">
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          Trusted by over 500,000+ users and teams worldwide
        </p>
        <div className="mt-6 flex flex-wrap justify-center items-center gap-8 opacity-70 dark:opacity-50">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg"
            alt="Notion"
            className="h-7 dark:invert"
          />
          <img src="./mchip.png" alt="Mailchimp" className="h-7 dark:invert" />
          <img src="./airtable.png" alt="Airtable" className="h-7 dark:invert" />
          <img src="./gumroad.png" alt="Gumroad" className="h-7 dark:invert" />
        </div>
      </div>
    </>
  );
};

export default Hero;
