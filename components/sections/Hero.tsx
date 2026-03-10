"use client";

import Link from "next/link";
import { Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden py-24">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px] -z-10 mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[128px] -z-10 mix-blend-screen" />

      <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-1 text-sm font-medium mb-8 text-violet-300"
        >
          <Sparkles className="mr-2 h-4 w-4 text-fuchsia-400" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
            StickerAI 2.0 is now live
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl"
        >
          Unleash Your Creativity with{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 animate-pulse-glow">
            AI Stickers
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
        >
          Experience the future of design. Generate premium, high-quality, and unique stickers in seconds with our state-of-art AI. No design skills required.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/client/generation">
            <Button size="lg" className="h-12 px-8 text-base bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)] border-0 rounded-full transition-all hover:scale-105">
              <Wand2 className="mr-2 h-5 w-5" />
              Generate Now
            </Button>
          </Link>
          <Link href="/client/gallery">
            <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-full border-white/10 bg-white/5 hover:bg-white/10 glass">
              Browse Gallery
            </Button>
          </Link>
        </motion.div>

        {/* Floating sticker previews */}
        <div className="absolute inset-0 pointer-events-none -z-10 hidden md:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: -100, y: -50 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute top-[20%] left-[15%] w-32 h-32 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm animate-float [animation-delay:0s] rotate-[-12deg] flex items-center justify-center p-2 shadow-xl"
          >
            {/* Provide a dummy visual placeholder */}
            <div className="w-full h-full bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-xl opacity-80" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: 100, y: -50 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="absolute top-[15%] right-[15%] w-40 h-40 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm animate-float [animation-delay:2s] rotate-[15deg] flex items-center justify-center p-2 shadow-xl"
          >
            <div className="w-full h-full bg-gradient-to-tr from-pink-500 to-rose-400 rounded-xl opacity-80" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: -50, y: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="absolute bottom-[20%] left-[20%] w-28 h-28 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm animate-float [animation-delay:4s] rotate-[8deg] flex items-center justify-center p-2 shadow-xl"
          >
            <div className="w-full h-full bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-xl opacity-80" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
