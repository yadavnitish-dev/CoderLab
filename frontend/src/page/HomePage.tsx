import { ArrowRight, BarChart3, Code2, Zap, BookOpen, Cpu } from "lucide-react";
import BrutalistButton from "../components/BrutalistButton";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 border-b border-zinc-900">
        <div className="workspace-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Copy */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-zinc-900 border border-zinc-800 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-sm bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-sm h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400">
                  v1.0.0 / System Online
                </span>
              </div>

              <h1 className="text-6xl md:text-7xl font-bold tracking-tighter text-white mb-8 leading-[1.1]">
                The laboratory for <span className="text-zinc-600">algorithmic evolution.</span>
              </h1>

              <p className="text-lg text-zinc-400 max-w-xl mb-12 leading-relaxed">
                A high-performance execution environment designed strictly for serious engineers. No fluff, no distractions. Just logic, execution, and raw metrics.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <BrutalistButton 
                  to="/signup" 
                  variant="primary" 
                  size="lg" 
                  icon={Code2}
                  className="w-full sm:w-auto"
                >
                  Get Started
                </BrutalistButton>
                <BrutalistButton 
                  to="/login" 
                  variant="secondary" 
                  size="lg" 
                  className="w-full sm:w-auto"
                >
                  Sign In
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </BrutalistButton>
              </div>
            </div>

            {/* Right Editor Mock */}
            <div className="relative hidden md:block">
              <div className="relative bg-[#0d0d0d] border border-zinc-800 rounded-sm overflow-hidden shadow-2xl">
                {/* Editor Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-[#111]">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-sm bg-zinc-800"></div>
                    <div className="size-3 rounded-sm bg-zinc-800"></div>
                    <div className="size-3 rounded-sm bg-zinc-800"></div>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-500/80">solve_rain_water.ts</div>
                  <div className="size-3"></div>
                </div>
                {/* Editor Body */}
                <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto text-zinc-300">
                  <div className="flex">
                    <span className="text-zinc-600 select-none pr-4 text-right w-8">1</span>
                    <span className="text-zinc-500">/**&nbsp;</span>
                  </div>
                  <div className="flex">
                    <span className="text-zinc-600 select-none pr-4 text-right w-8">2</span>
                    <span className="text-zinc-500">&nbsp;*&nbsp;ARCHITECTURE:&nbsp;Dual-Pointer&nbsp;Convergence</span>
                  </div>
                  <div className="flex">
                    <span className="text-zinc-600 select-none pr-4 text-right w-8">3</span>
                    <span className="text-zinc-500">&nbsp;*&nbsp;GOAL:&nbsp;O(N)&nbsp;Time&nbsp;|&nbsp;O(1)&nbsp;Space</span>
                  </div>
                  <div className="flex">
                    <span className="text-zinc-600 select-none pr-4 text-right w-8">4</span>
                    <span className="text-zinc-500">&nbsp;*/</span>
                  </div>
                  <div className="flex">
                    <span className="text-zinc-600 select-none pr-4 text-right w-8">5</span>
                    <span className="text-rose-400">function&nbsp;</span> <span className="text-blue-400">trap</span>(height: <span className="text-emerald-400">number</span>[]): <span className="text-emerald-400">number</span> {"{"}
                  </div>
                  <div className="flex">
                    <span className="text-zinc-600 select-none pr-4 text-right w-8">6</span>
                    <span className="ml-4 text-rose-400">let&nbsp;</span> [left,&nbsp;right]&nbsp;=&nbsp;[<span className="text-amber-300">0</span>,&nbsp;height.length&nbsp;-&nbsp;<span className="text-amber-300">1</span>];
                  </div>
                  <div className="flex">
                    <span className="text-zinc-600 select-none pr-4 text-right w-8">7</span>
                    <span className="ml-4 text-rose-400">let&nbsp;</span> [leftMax,&nbsp;rightMax]&nbsp;=&nbsp;[<span className="text-amber-300">0</span>,&nbsp;<span className="text-amber-300">0</span>];
                  </div>
                  <div className="flex mt-1">
                    <span className="text-zinc-600 select-none pr-4 text-right w-8">8</span>
                    <span className="ml-4 text-rose-400">while&nbsp;</span> (left&nbsp;&lt;&nbsp;right)&nbsp;{"{"}
                  </div>
                  <div className="flex">
                    <span className="text-zinc-600 select-none pr-4 text-right w-8">9</span>
                    <span className="ml-8 text-zinc-500">//&nbsp;AlgoPrep&nbsp;Tip:&nbsp;Pivot&nbsp;on&nbsp;the&nbsp;narrowest&nbsp;boundary</span>
                  </div>
                  <div className="flex bg-emerald-500/10 border-l-2 border-emerald-500 items-center px-2 py-0.5">
                    <span className="text-zinc-600 select-none pr-4 text-right w-8">10</span>
                    <span className="ml-8 text-rose-400">if&nbsp;</span> (height[left]&nbsp;&lt;&nbsp;height[right])&nbsp;{"{"}
                  </div>
                  <div className="flex">
                    <span className="text-zinc-600 select-none pr-4 text-right w-8">11</span>
                    <span className="ml-12 text-zinc-500">/*&nbsp;Logic&nbsp;for&nbsp;left&nbsp;side&nbsp;*/</span>
                  </div>
                  <div className="flex">
                    <span className="text-zinc-600 select-none pr-4 text-right w-8">12</span>
                    <span className="ml-8">{"}"}&nbsp;</span><span className="text-rose-400">else</span>&nbsp;{"{"}
                  </div>
                  <div className="flex">
                    <span className="text-zinc-600 select-none pr-4 text-right w-8">13</span>
                    <span className="ml-12 text-zinc-500">/*&nbsp;Logic&nbsp;for&nbsp;right&nbsp;side&nbsp;*/</span>
                  </div>
                  <div className="flex">
                    <span className="text-zinc-600 select-none pr-4 text-right w-8">14</span>
                    <span className="ml-8">{"}"}</span>
                  </div>
                  <div className="flex">
                    <span className="text-zinc-600 select-none pr-4 text-right w-8">15</span>
                    <span className="ml-4">{"}"}</span>
                  </div>
                  <div className="flex">
                    <span className="text-zinc-600 select-none pr-4 text-right w-8">16</span>
                    <span className="ml-4 text-rose-400">return&nbsp;</span> <span className="text-zinc-400 animate-pulse">computed_water;</span>
                  </div>
                  <div className="flex">
                    <span className="text-zinc-600 select-none pr-4 text-right w-8">17</span>
                    <span>{"}"}</span>
                  </div>
                </div>
                {/* Console Output Mock */}
                <div className="border-t border-zinc-800 bg-[#0a0a0a] p-4 font-mono text-xs">
                  <div className="text-emerald-500 flex items-center gap-2">
                    <Zap className="size-3" />
                    [Pass] All 150 test cases executed in 42ms.
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Action Banner */}
      <section className="py-32 relative overflow-hidden bg-[#0a0a0a] border-y border-zinc-900">
        {/* Subtle Decorative Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        <div className="workspace-container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-zinc-900/50 border border-zinc-800 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-sm bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-sm h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
                Awaiting Connection...
              </span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tighter mb-8 leading-tight">
              Push your logic to the <span className="text-zinc-700">absolute limit.</span>
            </h2>
            
            <p className="text-lg text-zinc-500 mb-12 max-w-2xl mx-auto leading-relaxed">
              Step into a high-performance environment built for serious engineers. 
              Join a network of algorithm masters today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <BrutalistButton
                to="/signup"
                variant="primary"
                size="xl"
                icon={Code2}
                className="shadow-2xl"
              >
                Start Solving
              </BrutalistButton>
            </div>
          </div>
        </div>
      </section>
       {/* Feature Grid */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="workspace-container">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-4 flex items-center gap-3">
              <Code2 className="size-8 text-zinc-500" />
              Core Architecture
            </h2>
            <div className="w-24 h-1 bg-zinc-800"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Curated Mastery Tracks",
                desc: "Hand-picked algorithm challenges spanning core Data Structures to advanced Dynamic Programming. Engineered for maximum depth.",
                icon: BookOpen,
              },
              {
                title: "Batched Runtime Engine",
                desc: "Execute entire test suites in a single high-performance run. Precision tracking for latency and memory allocation at the kernel level.",
                icon: Cpu,
              },
              {
                title: "Quantitative Progression",
                desc: "Visualize your growth with Skill Radar charts and GitHub-style heatmaps. Data-driven insights to identify and bridges gaps.",
                icon: BarChart3,
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 bg-[#0d0d0d] border border-zinc-800 hover:border-zinc-600 transition-colors duration-300 rounded-sm"
              >
                <feature.icon className="size-8 text-zinc-400 mb-6 group-hover:text-white transition-colors" />
                <h3 className="text-lg font-bold text-white mb-3 tracking-tight font-mono">
                  {feature.title}
                </h3>
                <p className="text-zinc-500 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
