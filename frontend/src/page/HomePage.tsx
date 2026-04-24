import {
  ArrowRight,
  Activity,
  Terminal,
  Cpu,
  Shield,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import BrutalistButton from "../components/BrutalistButton";
import { useRef } from "react";

const stats = [
  { value: "12,000+", label: "Engineers training daily" },
  { value: "2.1M+", label: "Submissions executed" },
  { value: "150+", label: "Curated FAANG-level problems" }
];

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#070707] text-zinc-300 overflow-x-hidden selection:bg-emerald-500/30"
    >
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
              <h1 className="text-[clamp(3.5rem,10vw,7rem)] font-bold uppercase tracking-tighter leading-[0.85] text-white mb-10">
                Master DSA.
                <br />
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
                <span className="flex items-center gap-2">
                  <Shield className="size-4" /> Secure environment
                </span>
                <span className="flex items-center gap-2.5 hover:text-zinc-400 transition-colors">
                  <Cpu className="size-3.5" /> Judge0 Runtime
                </span>
                <span className="flex items-center gap-2">
                  <Activity className="size-4" /> Real-time execution
                </span>
              </div>
            </motion.div>

            {/* RIGHT SIDE: SYSTEM INTERFACE PANEL */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
                <div className="border border-zinc-800 bg-[#080808] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-900 bg-zinc-900/30">
                    <div className="flex gap-2">
                      <div className="size-2 rounded-full bg-zinc-800" />
                      <div className="size-2 rounded-full bg-zinc-800" />
                      <div className="size-2 rounded-full bg-zinc-800" />
                    </div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-500/80">
                      mastery_engine.cpp
                    </p>
                    <p className="font-mono text-[10px] text-zinc-600">UTF-8</p>
                  </div>

                  <div className="p-6 font-mono text-sm leading-8 text-zinc-300">
                    <div className="flex opacity-50">
                      <span className="w-8 text-right pr-4 text-zinc-600">
                        1
                      </span>
                      <span className="text-zinc-500">
                        #include &lt;iostream&gt;
                      </span>
                    </div>

                    <div className="flex opacity-50">
                      <span className="w-8 text-right pr-4 text-zinc-600">
                        2
                      </span>
                      <span className="text-zinc-500">
                        using namespace std;
                      </span>
                    </div>

                    <div className="flex mt-4">
                      <span className="w-8 text-right pr-4 text-zinc-600">
                        3
                      </span>
                      <span>
                        <span className="text-blue-400">string</span> goal ={" "}
                        <span className="text-amber-300">"FAANG"</span>;
                      </span>
                    </div>

                    <div className="flex">
                      <span className="w-8 text-right pr-4 text-zinc-600">
                        4
                      </span>
                      <span>
                        <span className="text-blue-400">string</span> system ={" "}
                        <span className="text-amber-300">"AlgoPrep"</span>;
                      </span>
                    </div>

                    <div className="flex mt-4 bg-emerald-500/5 border-l-2 border-emerald-500 px-2">
                      <span className="w-8 text-right pr-4 text-zinc-600">
                        5
                      </span>
                      <span className="text-emerald-400">
                        // discipline &gt; motivation
                      </span>
                    </div>

                    <div className="flex mt-4">
                      <span className="w-8 text-right pr-4 text-zinc-600">
                        6
                      </span>
                      <span>
                        <span className="text-rose-400">while</span>{" "}
                        (notHired()) {"{"}
                      </span>
                    </div>

                    <div className="flex">
                      <span className="w-8 text-right pr-4 text-zinc-600">
                        7
                      </span>
                      <span className="ml-8">
                        <span className="text-emerald-400">solve</span>(goal,
                        system);
                      </span>
                    </div>

                    <div className="flex">
                      <span className="w-8 text-right pr-4 text-zinc-600">
                        8
                      </span>
                      <span className="ml-8">
                        <span className="text-emerald-400">measure</span>();
                      </span>
                    </div>

                    <div className="flex">
                      <span className="w-8 text-right pr-4 text-zinc-600">
                        9
                      </span>
                      <span>{"}"}</span>
                    </div>
                  </div>
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
                <p className="text-4xl font-bold font-mono text-white tracking-tighter">
                  {item.value}
                </p>
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
              <p>
                Motivation fades.{" "}
                <span className="text-white px-2 bg-zinc-900 border border-zinc-800">
                  Systems don’t.
                </span>
              </p>
              <p>
                AlgoPrep is built around deliberate repetition, measurable
                progress, and brutal honesty.
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

          <div className="grid lg:grid-cols-3 gap-px bg-zinc-900 border border-zinc-900">
            {/* Advantage 1: Decision Fatigue */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#0a0a0a] p-10 group relative overflow-hidden"
            >
              <div className="relative z-10">
                <p className="font-mono text-[9px] text-emerald-500 uppercase tracking-widest mb-6">[ 0x01_ELIMINATE_FATIGUE ]</p>
                <h3 className="text-white text-2xl font-bold uppercase tracking-tighter mb-4">
                  Decision-Free <br />Progression
                </h3>
                <p className="text-zinc-500 leading-relaxed text-sm mb-12">
                  A rigid, non-negotiable path from Arrays to Graphs. No guessing what to solve next—just execution.
                </p>
                
                {/* Visual: Roadmap Schematic */}
                <div className="mt-12 border border-zinc-900 bg-zinc-900/20 p-4 font-mono text-[9px] space-y-3 opacity-60 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-3">
                    <div className="size-1.5 rounded-full bg-emerald-500" />
                    <span className="text-zinc-400">01_ARRAYS_AND_HASHING</span>
                    <span className="text-emerald-500 ml-auto">COMPLETED</span>
                  </div>
                  <div className="flex items-center gap-3 border-l-2 border-zinc-800 ml-[2.5px] pl-3 py-1">
                    <div className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-white font-bold">02_TWO_POINTERS</span>
                    <span className="text-amber-500 ml-auto">ACTIVE</span>
                  </div>
                  <div className="flex items-center gap-3 opacity-40">
                    <div className="size-1.5 rounded-full bg-zinc-800" />
                    <span className="text-zinc-600">03_SLIDING_WINDOW</span>
                    <span className="text-zinc-800 ml-auto">LOCKED</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Advantage 2: Feedback Loops */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#0a0a0a] p-10 group relative overflow-hidden"
            >
              <div className="relative z-10">
                <p className="font-mono text-[9px] text-emerald-500 uppercase tracking-widest mb-6">[ 0x02_REALTIME_VALIDATION ]</p>
                <h3 className="text-white text-2xl font-bold uppercase tracking-tighter mb-4">
                  Instant Feedback <br />Loops
                </h3>
                <p className="text-zinc-500 leading-relaxed text-sm mb-12">
                  Run code, validate logic, and identify mistakes immediately with high-signal execution feedback.
                </p>
                
                {/* Visual: Code Execution Logs */}
                <div className="mt-12 border border-zinc-900 bg-zinc-900/20 p-4 font-mono text-[9px] space-y-2 opacity-60 group-hover:opacity-100 transition-opacity overflow-hidden">
                  <div className="flex justify-between text-zinc-600">
                    <span>BUILD_LOG: v1.02</span>
                    <span>256ms</span>
                  </div>
                  <div className="h-[1px] bg-zinc-900 w-full mb-2" />
                  <p className="text-emerald-500/80">&gt; RUNNING TEST_CASE_01: PASSED</p>
                  <p className="text-emerald-500/80">&gt; RUNNING TEST_CASE_02: PASSED</p>
                  <p className="text-rose-500/80">&gt; RUNNING TEST_CASE_03: LOGIC_ERR</p>
                  <p className="text-zinc-500 animate-blink">&gt; _</p>
                </div>
              </div>
            </motion.div>

            {/* Advantage 3: Tracking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#0a0a0a] p-10 group relative overflow-hidden"
            >
              <div className="relative z-10">
                <p className="font-mono text-[9px] text-emerald-500 uppercase tracking-widest mb-6">[ 0x03_DISCIPLINE_METRICS ]</p>
                <h3 className="text-white text-2xl font-bold uppercase tracking-tighter mb-4">
                  Track what actually matters
                </h3>
                <p className="text-zinc-500 leading-relaxed text-sm mb-12">
                  Consistency, weak areas, and problem-solving depth—measured with architectural precision.
                </p>
                
                {/* Visual: Performance Radar & Metrics */}
                <div className="mt-12 space-y-6 opacity-60 group-hover:opacity-100 transition-opacity">
                  <div className="relative h-32 w-full flex items-center justify-center">
                    {/* Mock Radar Chart SVG */}
                    <svg className="size-32 overflow-visible" viewBox="0 0 100 100">
                      {/* Background Polygons */}
                      <polygon points="50,5 95,35 80,85 20,85 5,35" fill="none" stroke="#18181b" strokeWidth="1" />
                      <polygon points="50,25 75,45 65,70 35,70 25,45" fill="none" stroke="#18181b" strokeWidth="1" />
                      {/* Data Polygon */}
                      <polygon 
                        points="50,15 85,40 70,80 30,75 15,45" 
                        fill="rgba(16, 185, 129, 0.1)" 
                        stroke="#10b981" 
                        strokeWidth="1.5"
                        className="animate-pulse"
                      />
                      {/* Axis Lines */}
                      <line x1="50" y1="50" x2="50" y2="5" stroke="#18181b" strokeWidth="1" />
                      <line x1="50" y1="50" x2="95" y2="35" stroke="#18181b" strokeWidth="1" />
                      <line x1="50" y1="50" x2="80" y2="85" stroke="#18181b" strokeWidth="1" />
                      <line x1="50" y1="50" x2="20" y2="85" stroke="#18181b" strokeWidth="1" />
                      <line x1="50" y1="50" x2="5" y2="35" stroke="#18181b" strokeWidth="1" />
                    </svg>
                    
                    {/* Labels around radar */}
                    <div className="absolute top-0 font-mono text-[7px] text-zinc-600">RUNTIME</div>
                    <div className="absolute right-0 top-1/3 font-mono text-[7px] text-zinc-600">SPACE</div>
                    <div className="absolute right-4 bottom-0 font-mono text-[7px] text-zinc-600">DISCIPLINE</div>
                    <div className="absolute left-4 bottom-0 font-mono text-[7px] text-zinc-600">LOGIC</div>
                    <div className="absolute left-0 top-1/3 font-mono text-[7px] text-zinc-600">SPEED</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-900">
                    <div className="space-y-1">
                      <p className="font-mono text-[8px] text-zinc-600 uppercase">Mastery Delta</p>
                      <p className="font-mono text-xs text-emerald-500 font-bold">+14.2%</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="font-mono text-[8px] text-zinc-600 uppercase">Percentile</p>
                      <p className="font-mono text-xs text-white font-bold">98.4th</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
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
            {/* Main Showcase: Integrated Workspace Mock */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-8 group relative"
            >
              <div className="terminal-window h-[580px] bg-[#0b0b0b] flex flex-col border-zinc-800/50 group-hover:border-zinc-700 transition-colors">
                <div className="terminal-header">
                  <div className="flex gap-1.5">
                    <div className="size-2 rounded-full bg-zinc-800" />
                    <div className="size-2 rounded-full bg-zinc-800" />
                    <div className="size-2 rounded-full bg-zinc-800" />
                  </div>
                  <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.3em]">
                    system_runtime / mastery_roadmap.sys
                  </div>
                </div>
                
                <div className="flex-1 flex overflow-hidden">
                  {/* Sidebar Categories */}
                  <div className="w-64 border-r border-zinc-900 bg-zinc-900/10 p-6 flex flex-col gap-4">
                    <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-zinc-600 mb-2">Category Status</p>
                    {[
                      { name: "Arrays & Hashing", progress: 100, active: false },
                      { name: "Two Pointers", progress: 85, active: true },
                      { name: "Sliding Window", progress: 40, active: false },
                      { name: "Binary Search", progress: 0, active: false },
                      { name: "Trees", progress: 0, active: false },
                    ].map((cat) => (
                      <div key={cat.name} className={`p-3 border ${cat.active ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-900/20'} cursor-default`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`font-mono text-[10px] ${cat.active ? 'text-emerald-400' : 'text-zinc-400'}`}>{cat.name}</span>
                          <span className="text-[8px] font-mono text-zinc-600">{cat.progress}%</span>
                        </div>
                        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <div className={`h-full ${cat.active ? 'bg-emerald-500' : 'bg-zinc-700'}`} style={{ width: `${cat.progress}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Main Content: Problem List */}
                  <div className="flex-1 p-8 flex flex-col">
                    <div className="flex justify-between items-end mb-8">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1 uppercase tracking-tight">Two Pointers</h3>
                        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Active Focus Module</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-mono text-zinc-600 uppercase mb-1">Module Reward</p>
                        <p className="text-sm font-bold text-emerald-500 font-mono">+250 XP</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        { title: "Valid Palindrome", difficulty: "Easy", status: "Done" },
                        { title: "Two Sum II", difficulty: "Medium", status: "Done" },
                        { title: "3Sum", difficulty: "Medium", status: "Processing" },
                        { title: "Container With Most Water", difficulty: "Medium", status: "Locked" },
                        { title: "Trapping Rain Water", difficulty: "Hard", status: "Locked" },
                      ].map((prob, i) => (
                        <div key={prob.title} className="flex items-center justify-between p-4 border border-zinc-800 bg-zinc-900/30 group/item hover:bg-zinc-800/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-mono text-zinc-700">0{i+1}</span>
                            <span className="text-xs font-medium text-zinc-300">{prob.title}</span>
                          </div>
                          <div className="flex items-center gap-6">
                            <span className={`text-[9px] font-mono uppercase tracking-widest ${
                              prob.difficulty === 'Easy' ? 'text-emerald-500' : 
                              prob.difficulty === 'Medium' ? 'text-amber-500' : 'text-rose-500'
                            }`}>{prob.difficulty}</span>
                            <div className={`size-1.5 rounded-full ${
                              prob.status === 'Done' ? 'bg-emerald-500' : 
                              prob.status === 'Processing' ? 'bg-amber-500 animate-pulse' : 'bg-zinc-800'
                            }`} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Simulation Overlay */}
                    <div className="mt-auto pt-8 border-t border-zinc-900">
                       <div className="flex gap-4">
                          <div className="flex-1 h-20 border border-zinc-800 bg-zinc-900/20 p-4">
                            <p className="text-[8px] font-mono text-zinc-600 uppercase mb-2">Complexity Target</p>
                            <p className="text-xs font-mono text-white">O(n) Time / O(1) Space</p>
                          </div>
                          <div className="flex-1 h-20 border border-zinc-800 bg-zinc-900/20 p-4">
                            <p className="text-[8px] font-mono text-zinc-600 uppercase mb-2">Completion Rate</p>
                            <p className="text-xs font-mono text-emerald-500">84.2% Success</p>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Side Showcase: Consoles */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex-1 terminal-window bg-[#0b0b0b] p-8 border-zinc-800/50"
              >
                <div className="flex items-center gap-3 mb-8">
                  <Activity className="size-4 text-emerald-500" />
                  <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                    Execution Console
                  </p>
                </div>
                <div className="space-y-4 font-mono text-[11px]">
                  <div className="flex justify-between text-zinc-600 mb-6">
                    <span>Status: RUNNING</span>
                    <span>v2.4.0</span>
                  </div>
                  <p className="text-zinc-600 line-clamp-1">
                    &gt; Initializing async_pipeline...
                  </p>
                  <p className="text-emerald-500/80">
                    &gt; Submission #8429: SUCCESS
                  </p>
                  <p className="text-emerald-500/80">
                    &gt; Memory: 12.4 MB [PASS]
                  </p>
                  <p className="text-amber-500/80">
                    &gt; CPU Time: 0.04s [STABLE]
                  </p>
                  <p className="text-zinc-400 animate-blink">&gt; awaiting next_input_</p>
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
                  <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                    Mastery Metrics
                  </p>
                </div>
                <div className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex justify-between font-mono text-[9px] uppercase tracking-tighter text-zinc-500">
                      <span>Coverage: NeetCode 150</span>
                      <span>68%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "68%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="h-full bg-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between font-mono text-[9px] uppercase tracking-tighter text-zinc-500">
                      <span>Daily Consistency</span>
                      <span>92%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "92%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                        className="h-full bg-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                     <div className="p-3 border border-zinc-900 bg-zinc-900/20">
                        <p className="text-[8px] font-mono text-zinc-600 uppercase mb-1">Rank</p>
                        <p className="text-sm font-bold text-white font-mono">TOP 3%</p>
                     </div>
                     <div className="p-3 border border-zinc-900 bg-zinc-900/20">
                        <p className="text-[8px] font-mono text-zinc-600 uppercase mb-1">Streak</p>
                        <p className="text-sm font-bold text-emerald-500 font-mono">14 DAYS</p>
                     </div>
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
              Six months from now,
              <br />
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
