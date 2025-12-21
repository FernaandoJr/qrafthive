"use client";

import { FingerprintIcon, Menu, Moon, Sun } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "motion/react";

export function AcmeHero() {
  return (
      <div className="container max-w-5xl mx-auto">
        <header className="relative pt-4">
          <nav className="flex items-center justify-between rounded-xl bg-background py-2 px-4 shadow-lg border">
            <div className="flex items-center space-x-6">
              <a href="#" className="text-base font-semibold">
                Acme
              </a>
              <div className="hidden md:flex items-center space-x-6">
                <a
                  href="#"
                  className="text-sm text-muted-foreground/60 hover:text-foreground/80 transition-colors"
                >
                  Docs
                </a>
                <a
                  href="#"
                  className="text-sm text-muted-foreground/60 hover:text-foreground/80 transition-colors"
                >
                  Components
                </a>
                <a
                  href="#"
                  className="text-sm text-muted-foreground/60 hover:text-foreground/80 transition-colors"
                >
                  Templates
                </a>
                <a
                  href="#"
                  className="text-sm text-muted-foreground/60 hover:text-foreground/80 transition-colors"
                >
                  Pricing
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Sun className="h-[15px] w-[15px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[15px] w-[15px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant="ghost"
                className="hidden md:inline-flex h-7 px-2 text-sm font-normal text-muted-foreground/60 hover:text-foreground/80"
              >
                Sign in
              </Button>
              <Button className="hidden md:inline-flex h-7 rounded-full bg-foreground px-3 text-sm font-normal text-background hover:bg-foreground/90">
                Get access
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 md:hidden"
                  >
                    <Menu className="h-[15px] w-[15px]" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                  <nav className="flex flex-col space-y-4">
                    <a
                      href="#"
                      className="text-sm text-muted-foreground/60 hover:text-foreground/80 transition-colors"
                    >
                      Docs
                    </a>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground/60 hover:text-foreground/80 transition-colors"
                    >
                      Components
                    </a>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground/60 hover:text-foreground/80 transition-colors"
                    >
                      Templates
                    </a>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground/60 hover:text-foreground/80 transition-colors"
                    >
                      Pricing
                    </a>
                    <Button
                      variant="ghost"
                      className="justify-start h-7 px-2 text-sm font-normal text-muted-foreground/60 hover:text-foreground/80"
                    >
                      Sign in
                    </Button>
                    <Button className="h-7 rounded-full bg-foreground px-3 text-sm font-normal text-background hover:bg-foreground/90">
                      Get access
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </header>

        <main className="relative container px-2 mx-auto">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-36">
            <motion.div
              className="flex flex-col items-center space-y-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h1
                className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Websites, Redefined
              </motion.h1>
              <motion.p
                className="mx-auto max-w-xl text-md sm:text-2xl text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Ship your projects with{" "}
                <span className="font-semibold text-foreground">
                  beautiful components
                </span>{" "}
                and{" "}
                <span className="font-semibold text-foreground">templates</span>
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Button className="rounded-xl bg-foreground text-background hover:bg-foreground/90">
                  Explore Components
                  <div className="ml-2 space-x-1 hidden sm:inline-flex">
                    <FingerprintIcon className="w-5 h-5" />
                  </div>
                </Button>
                <Button variant="outline" className="rounded-xl">
                  <div className="mr-2 space-x-1 hidden sm:inline-flex">
                    <span className="w-5 h-5 text-xs rounded-sm border">⌘</span>
                    <span className="w-5 h-5 text-xs rounded-sm border">B</span>
                  </div>
                  Buy Now
                </Button>
              </motion.div>

              <motion.div
                className="flex flex-col items-center space-y-3 pb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-primary hover:text-primary/80 transition-colors">
                    /w Tailwind CSS
                  </span>
                  <span className="text-muted-foreground/60">
                    Components & Templates
                  </span>
                  <span className="text-primary hover:text-primary/80 transition-colors">
                    /w Motion
                  </span>
                </div>
                <p className="text-sm text-muted-foreground/60">
                  Built with the most popular utility-first CSS framework
                </p>
              </motion.div>
              <motion.div
                className="w-full border p-2 rounded-3xl"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <div className="relative w-full">
                  <div className="relative w-full rounded-3xl overflow-hidden border shadow-2xl">
                    <img
                      src="https://ui.shadcn.com/examples/dashboard-dark.png"
                      alt="Dashboard Preview"
                      className="w-full h-full object-center hidden dark:block rounded-3xl"
                    />
                    <img
                      src="https://ui.shadcn.com/examples/dashboard-light.png"
                      alt="Dashboard Preview"
                      className="w-full h-full object-center dark:hidden block rounded-3xl"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-background to-transparent" />
                </div>
              </motion.div>
            </motion.div>
          </section>
        </main>
      </div>
  );
}