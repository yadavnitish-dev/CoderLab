import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center pt-20 px-4 pb-20 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-60 pointer-events-none"></div>
      
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-16 space-y-8 relative z-10 animate-fade-in-up">
        <div className="inline-block mb-4">
            <span className="px-4 py-1.5 rounded-full bg-base-200/50 border border-white/5 text-xs font-bold text-primary uppercase tracking-widest backdrop-blur-md shadow-lg shadow-primary/5">
                Master the Algorithm
            </span>
        </div>
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-tight font-display">
          Level Up Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-300% animate-gradient">Coding Skills</span>
        </h1>
        <p className="text-xl md:text-2xl text-base-content/60 max-w-2xl mx-auto leading-relaxed font-light">
          The ultimate platform to practice, compete, and master coding interviews. 
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Link to="/explore" className="btn btn-primary btn-lg rounded-full shadow-xl shadow-primary/30 hover:scale-105 transition-all w-full sm:w-auto px-10 text-lg">
                Start Solving
            </Link>
            <Link to="/profile" className="btn btn-glass btn-lg rounded-full hover:bg-white/10 w-full sm:w-auto px-10 text-lg group">
                View Playlists
                <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
        </div>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full px-4 relative z-10">
           {[
               { title: "Curated Problems", desc: "Hand-picked collection of high-quality algorithm challenges.", icon: "🎯" },
               { title: "Code Editor", desc: "Powerful, dark-themed editor with multi-language support.", icon: "💻" },
               { title: "Track Progress", desc: "Visualize your journey with detailed stats and playlists.", icon: "📈" }
           ].map((item, idx) => (
               <div key={idx} className="glass-panel p-6 rounded-2xl hover:border-primary/30 transition-colors">
                   <div className="text-4xl mb-4">{item.icon}</div>
                   <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                   <p className="text-base-content/60">{item.desc}</p>
               </div>
           ))}
       </div>
    </div>
  );
};

export default HomePage;