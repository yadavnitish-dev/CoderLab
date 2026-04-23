import { 
  ArrowRight,  
  Activity, 
  Target, 
  Zap, 
  BarChart3, 
  ChevronRight, 
  Terminal,
  Lock,
  Cpu,
  Trophy,
  History
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import BrutalistButton from "../components/BrutalistButton";
import { useRef } from "react";

const stats = [
  { value: "12,000+", label: "Engineers training daily" },
  { value: "2.1M+", label: "Submissions executed" },
  { value: "Top 3%", label: "Average consistency score" },
];

const advantages = [
  {
    title: "Eliminate decision fatigue",
    desc: "A rigid progression path from Arrays to Graphs. No guessing what to solve next.",
    icon: Target,
  },
  {
    title: "Instant feedback loops",
    desc: "Run code, validate logic, and identify mistakes immediately with high-signal execution feedback.",
    icon: Zap,
  },
  {
    title: "Track what actually matters",
    desc: "Consistency, weak areas, runtime patterns, and problem-solving depth—measured, not guessed.",
    icon: BarChart3,
  },
];

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#070707] text-zinc-300 overflow-x-hidden selection:bg-emerald-500/30">
      {/* Dynamic Background */}
      <motion.div 
        style={{ y: gridY }}
        className="fixed inset-0 pointer-events-none opacity-[0.03] animate-grid-drift"
      >
        <div className="absolute inset-0 blueprint-grid" />
      </motion.div>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-20 pb-32 border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-32 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "circOut" }}
            >
              <div className="inline-flex items-center gap-3 border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 mb-10 group cursor-default">
                <span className="h-2 w-2 bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-500 group-hover:text-zinc-300 transition-colors">
                  SYSTEM ONLINE / EXECUTION READY
                </span>
              </div>

              <h1 className="text-[clamp(3.5rem,10vw,7rem)] font-bold uppercase tracking-tighter leading-[0.85] text-white mb-10">
                Master DSA.<br />
                <span className="text-zinc-700 italic">No excuses.</span>
              </h1>

              <p className="text-lg md:text-xl text-zinc-500 max-w-xl leading-relaxed mb-12">
                Built for FAANG interview prep and engineers switching jobs.
                Structured repetition. Measurable progress. Zero distractions.
              </p>

              <div className="flex flex-col sm:flex-row gap-6">
                <BrutalistButton
                  to="/signup"
                  variant="primary"
                  size="xl"
                  className="px-12 group h-16"
                >
                  <span className="flex items-center gap-3 text-lg">
                    Start Solving
                    <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </BrutalistButton>
              </div>

              <div className="mt-16 flex flex-wrap gap-8 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                <span className="flex items-center gap-2.5 hover:text-zinc-400 transition-colors">
                  <Lock className="size-3.5" /> Secure Environment
                </span>
                <span className="flex items-center gap-2.5 hover:text-zinc-400 transition-colors">
                  <Cpu className="size-3.5" /> Judge0 Runtime
                </span>
                <span className="flex items-center gap-2.5 hover:text-zinc-400 transition-colors">
                  <History className="size-3.5" /> Vercel Optimized
                </span>
              </div>
            </motion.div>

            {/* RIGHT SIDE: SYSTEM INTERFACE PANEL */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "circOut", delay: 0.2 }}
              className="relative"
            >
              <div className="terminal-window p-px bg-gradient-to-br from-zinc-800 to-transparent">
                <div className="bg-[#0b0b0b] p-8 md:p-12 relative">
                  {/* Scan line effect */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
                    <div className="w-full h-20 bg-white animate-scanline shadow-[0_0_100px_white]" />
                  </div>

                  <div className="flex items-center justify-between border-b border-zinc-900 pb-6 mb-10">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500 mb-1">
                        System Status
                      </p>
                      <div className="h-0.5 w-32 bg-emerald-500/50" />
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Authorization</p>
                      <p className="font-mono text-xs font-bold text-emerald-500">LEVEL: ALPHA</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-12 mb-12">
                    {[
                      { label: "Candidate Status", value: "ACTIVE", color: "text-white" },
                      { label: "Focus Mode", value: "ENABLED", color: "text-emerald-500" },
                      { label: "Problems Solved", value: "347", color: "text-white" },
                      { label: "Runtime Rank", value: "TOP 3%", color: "text-white" },
                      { label: "Discipline Score", value: "98/100", color: "text-white" },
                      { label: "Execution Delta", value: "+12.4ms", color: "text-zinc-500" },
                    ].map((item) => (
                      <div key={item.label} className="group cursor-default">
                        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-600 group-hover:text-zinc-400 transition-colors mb-2">{item.label}</p>
                        <p className={`font-mono text-2xl font-bold tracking-tight ${item.color}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border border-zinc-800 bg-zinc-900/30 p-6 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-emerald-500/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-3 relative z-10">
                      &gt; Next Target
                    </p>
                    <div className="flex items-center justify-between relative z-10">
                      <p className="font-mono text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                        Advanced Graphs
                      </p>
                      <div className="flex gap-1">
                        <span className="h-1 w-1 bg-emerald-500 rounded-full animate-ping" />
                        <span className="h-1 w-1 bg-emerald-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative terminal cursor in corner */}
              <div className="absolute -bottom-6 -right-6 font-mono text-[10px] text-zinc-800 pointer-events-none select-none hidden xl:block">
                0x42_ESTABLISHED_CONNECTION
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF STRIP */}
      <section className="border-b border-zinc-900 py-16 bg-[#090909]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24">
            {stats.map((item, idx) => (
              <motion.div 
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col gap-2 border-l border-zinc-800 pl-8"
              >
                <p className="text-4xl font-bold font-mono text-white tracking-tighter">{item.value}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PHILOSOPHY SECTION */}
      <section className="py-40 relative border-b border-zinc-900 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-bold text-white/[0.01] pointer-events-none select-none uppercase tracking-tighter whitespace-nowrap">
          Discipline Over Motivation
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-emerald-500 mb-10 font-bold">
              [ Core Philosophy ]
            </p>
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-12 uppercase leading-[0.9]">
              We don’t believe in motivation.
            </h2>
            <div className="space-y-8 text-xl md:text-2xl text-zinc-500 leading-relaxed font-medium">
              <p>Motivation fades. <span className="text-white px-2 bg-zinc-900 border border-zinc-800">Systems don’t.</span></p>
              <p>
                AlgoPrep is built around deliberate repetition, 
                measurable progress, and brutal honesty.
              </p>
              <p className="text-zinc-600 italic">
                "You either improve, or the data shows you didn’t."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CORE ADVANTAGES (OUTCOMES) */}
      <section className="py-32 border-b border-zinc-900 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-24">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-600 mb-6 font-bold">
              Architectural Advantages
            </p>
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter uppercase">
              Built for outcomes.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-zinc-900 border border-zinc-900">
            {advantages.map((item, idx) => (
              <motion.div 
                key={item.title} 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#0a0a0a] p-12 hover:bg-[#0d0d0d] transition-colors group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                  <item.icon className="size-32" />
                </div>
                <item.icon className="size-8 text-emerald-500 mb-8" />
                <h3 className="text-white text-2xl font-bold uppercase tracking-tighter mb-6">
                  {item.title}
                </h3>
                <p className="text-zinc-500 leading-relaxed font-medium">
                  {item.desc}
                </p>
                <div className="mt-10 flex items-center gap-2 text-[10px] font-mono text-zinc-700 uppercase tracking-widest group-hover:text-emerald-500 transition-colors">
                  Learn more <ChevronRight className="size-3" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERFACE SHOWCASE (PRODUCT MOCKS) */}
      <section className="py-40 bg-[#070707]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-600 mb-6 font-bold">
                The Interface
              </p>
              <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter uppercase leading-[0.9]">
                Engineered for focus.
              </h2>
            </div>
            <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest pb-2">
              [ 0x01_VISUAL_AUDIT ]
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 h-full">
            {/* Main Showcase: Dashboard Mock */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-8 group relative"
            >
              <div className="terminal-window h-[500px] bg-[#0b0b0b] flex flex-col border-zinc-800/50 group-hover:border-zinc-700 transition-colors">
                <div className="terminal-header">
                  <div className="flex gap-1.5">
                    <div className="size-2 rounded-full bg-zinc-800" />
                    <div className="size-2 rounded-full bg-zinc-800" />
                    <div className="size-2 rounded-full bg-zinc-800" />
                  </div>
                  <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.3em]">
                    dashboard_v2.sys
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col overflow-hidden">
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-20 bg-zinc-900/50 border border-zinc-800 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                  <div className="flex-1 bg-zinc-900/30 border border-zinc-800 p-6 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-zinc-800" />
                        <div className="h-2 w-20 bg-zinc-900" />
                      </div>
                      <div className="size-16 rounded-full border border-emerald-500/20 flex items-center justify-center">
                        <Trophy className="size-6 text-emerald-500" />
                      </div>
                    </div>
                    {/* Simulated Heatmap */}
                    <div className="grid grid-cols-[repeat(24,1fr)] gap-1">
                      {Array.from({ length: 120 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`aspect-square ${Math.random() > 0.7 ? "bg-emerald-500/40" : "bg-zinc-900"} border border-zinc-800/50`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Side Showcase: Radar/Stats */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex-1 terminal-window bg-[#0b0b0b] p-8 border-zinc-800/50"
              >
                <div className="flex items-center gap-3 mb-8">
                  <Activity className="size-4 text-emerald-500" />
                  <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Execution Console</p>
                </div>
                <div className="space-y-4 font-mono text-[11px]">
                  <p className="text-zinc-600 line-clamp-1">&gt; Compiling solution.cpp...</p>
                  <p className="text-emerald-500/80">&gt; Test Case 01: PASSED [1.2ms]</p>
                  <p className="text-emerald-500/80">&gt; Test Case 02: PASSED [0.8ms]</p>
                  <p className="text-rose-500/80">&gt; Test Case 03: FAILED [LOGIC_ERR]</p>
                  <p className="text-zinc-400 animate-blink">&gt; _</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex-1 terminal-window bg-[#0b0b0b] p-8 border-zinc-800/50"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Terminal className="size-4 text-zinc-500" />
                  <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">System Metrics</p>
                </div>
                <div className="space-y-6">
                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "65%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className="h-full bg-emerald-500" 
                    />
                  </div>
                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "42%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                      className="h-full bg-zinc-600" 
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-48 relative overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
          <div className="absolute inset-0 blueprint-grid scale-[2] rotate-12" />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter uppercase mb-12 leading-[0.9]">
              Six months from now,<br />
              you’ll wish you started today.
            </h2>
            <div className="flex flex-col items-center gap-8">
              <BrutalistButton
                to="/signup"
                variant="primary"
                size="xl"
                className="px-16 h-20 group"
              >
                <span className="flex items-center gap-4 text-xl">
                  Enter the System
                  <ArrowRight className="size-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </BrutalistButton>
              <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-[0.4em] animate-pulse">
                &gt; Awaiting connection...
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
