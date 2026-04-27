import { useEffect } from "react";
import { ActivityCalendar, ThemeInput } from "react-activity-calendar";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import {
  Mail,
  Calendar,
  ChevronRight,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { useProblemStore } from "../store/useProblemStore";
import { useSubmissionStore } from "../store/useSubmissionStore";

const DashboardPage = () => {
  const { authUser } = useAuthStore();
  const { getSolvedProblemByUser, solvedProblems } = useProblemStore();
  const { getAllPlaylists, playlists } = usePlaylistStore();
  const { getAllSubmissions, submissions } = useSubmissionStore();

  useEffect(() => {
    getSolvedProblemByUser();
    getAllPlaylists();
    getAllSubmissions();
  }, [getSolvedProblemByUser, getAllPlaylists, getAllSubmissions]);

  const activityData = (() => {
    const data: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setFullYear(start.getFullYear() - 1);

    const submissionMap = new Map();
    submissions.forEach((sub) => {
      if (sub.createdAt) {
        const d = new Date(sub.createdAt);
        const dateStr = d.toISOString().split("T")[0];
        submissionMap.set(dateStr, (submissionMap.get(dateStr) || 0) + 1);
      }
    });

    for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      const count = submissionMap.get(dateStr) || 0;
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count === 1 || count === 2) level = 1;
      else if (count >= 3 && count <= 5) level = 2;
      else if (count > 5 && count <= 10) level = 3;
      else if (count > 10) level = 4;

      data.push({ date: dateStr, count, level });
    }
    return data;
  })();

  const radarData = (() => {
    const tagsMap: Record<string, number> = {};
    solvedProblems.forEach((p) => {
      const tags = p.tags || [];
      if (tags.length === 0) {
        tagsMap["General"] = (tagsMap["General"] || 0) + 1;
      } else {
        tags.forEach((tag) => {
          const shortTag = tag === "Dynamic Programming" ? "DP" : tag;
          tagsMap[shortTag] = (tagsMap[shortTag] || 0) + 1;
        });
      }
    });

    const maxCount = Math.max(...Object.values(tagsMap), 5);
    const sortedTags = Object.entries(tagsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([subject, count]) => ({
        subject,
        count,
        fullMark: maxCount,
      }));

    if (sortedTags.length === 0) {
      return [
        { subject: "Arrays", count: 0, fullMark: 10 },
        { subject: "Strings", count: 0, fullMark: 10 },
        { subject: "Trees", count: 0, fullMark: 10 },
        { subject: "Math", count: 0, fullMark: 10 },
        { subject: "DP", count: 0, fullMark: 10 },
      ];
    }

    while (sortedTags.length < 3) {
      sortedTags.push({ subject: `Other ${sortedTags.length}`, count: 0, fullMark: maxCount });
    }

    return sortedTags;
  })();

  const explicitTheme: ThemeInput = {
    light: ["#09090b", "#064e3b", "#047857", "#059669", "#10b981"],
    dark: ["#09090b", "#064e3b", "#047857", "#059669", "#10b981"],
  };

  if (!authUser) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.01 },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.01 },
    },
  };

  const profileImageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.01 },
    },
    hover: { scale: 1.05, transition: { duration: 0.1 } },
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      {/* Profile Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        className="border-b border-zinc-800 bg-[#0d0d0d] py-16 mb-8 relative z-10"
      >
        <div className="workspace-container">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div
              variants={profileImageVariants}
              whileHover="hover"
              className="relative group"
            >
              <img
                src={
                  authUser.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    authUser.name || "User",
                  )}&background=09090b&color=fff&rounded=false`
                }
                alt="Profile"
                className="size-32 rounded-none object-cover border border-zinc-800 relative z-10"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center md:text-left"
            >
              <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                <h1 className="text-4xl font-mono font-bold tracking-tighter text-white uppercase">
                  {authUser.name}
                </h1>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <Mail className="size-4" />
                  <span className="font-mono tracking-tight">{authUser.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  <span className="font-mono tracking-tight text-xs">
                    JOINED:{" "}
                    {authUser.createdAt
                      ? new Date(authUser.createdAt).toLocaleDateString()
                      : "UNKNOWN"}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="workspace-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-zinc-900 border border-zinc-900"
        >
          {/* Bento Stats Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-900">
            {/* Main Solve Stat */}
            <motion.div
              variants={itemVariants}
              className="bg-[#0a0a0a] p-8 relative overflow-hidden group transition-colors hover:bg-[#0c0c0c]"
            >
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden z-0">
                <div className="w-full h-full bg-gradient-to-b from-transparent via-white to-transparent animate-scanline"></div>
              </div>
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Target className="size-24" />
              </div>
              <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-[0.3em] mb-4">
                Progress
              </p>
              <div className="flex items-end gap-3 mb-2">
                <motion.span
                  className="text-8xl font-mono font-bold text-white leading-none tracking-tighter"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {solvedProblems?.length || 0}
                </motion.span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mb-2">
                  Solved
                </span>
              </div>
              <div className="w-full bg-zinc-900 border border-zinc-800 h-2 mt-6 overflow-hidden">
                <motion.div
                  className="bg-emerald-500 h-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.min((solvedProblems?.length || 0) * 2, 100)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.01, delay: 0.4 }}
                />
              </div>
            </motion.div>

            {/* Skill Radar Chart */}
            <motion.div
              variants={itemVariants}
              className="bg-[#0a0a0a] p-8 relative overflow-hidden flex flex-col group transition-colors hover:bg-[#0c0c0c]"
            >
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden z-0">
                <div className="w-full h-full bg-gradient-to-b from-transparent via-white to-transparent animate-scanline" style={{ animationDelay: '2s' }}></div>
              </div>
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-400 flex items-center gap-2 mb-6">
                <Target className="size-4" />
                Skill Radar
              </h3>
              <motion.div
                className="flex-1 min-h-62.5 w-full mt-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#52525b" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#a1a1aa", fontSize: 10, fontFamily: "monospace", textAnchor: "middle" }} />
                    <PolarRadiusAxis angle={30} domain={[0, "auto"]} tick={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#000", border: "1px solid #27272a", borderRadius: "0", color: "#10b981", fontFamily: "monospace", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em" }}
                      itemStyle={{ color: "#10b981" }}
                      cursor={{ stroke: '#52525b', strokeWidth: 1 }}
                    />
                    <Radar
                      name="Skills"
                      dataKey="count"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="#10b981"
                      fillOpacity={0.15}
                      isAnimationActive={false}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </motion.div>
            </motion.div>

            {/* Github Contribution Heatmap */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-2 bg-[#0a0a0a] p-8 relative overflow-hidden transition-colors hover:bg-[#0c0c0c]"
            >
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden z-0">
                <div className="w-full h-full bg-gradient-to-b from-transparent via-white to-transparent animate-scanline" style={{ animationDelay: '4s' }}></div>
              </div>
              <div className="relative z-10 overflow-x-auto">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-400 flex items-center gap-2">
                    <TrendingUp className="size-4" />
                    Activity
                  </h3>
                </div>
                <motion.div
                  className="min-w-[200px] flex justify-center text-[10px]"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.01 }}
                >
                  <ActivityCalendar
                    data={activityData}
                    theme={explicitTheme}
                    labels={{
                      totalCount: `{{count}} submissions in the last year`,
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Mini Playlists View */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1 space-y-6 h-full"
          >
            <div className="bg-[#0a0a0a] p-6 h-full flex flex-col transition-colors hover:bg-[#0c0c0c]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-400">
                  Playlists
                </h3>
                <Link
                  to="/playlists"
                  className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
                >
                  View All
                </Link>
              </div>

              <motion.div
                className="space-y-3 flex-1"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05,
                    },
                  },
                }}
              >
                {playlists.slice(0, 5).map((playlist) => (
                  <motion.div
                    key={playlist.id}
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                    }}
                  >
                    <Link
                      to={`/playlist/${playlist.id}`}
                      className="flex items-center justify-between p-4 bg-[#080808] border border-zinc-900 rounded-none hover:border-zinc-700 transition-colors group"
                    >
                      <div className="flex-1 min-w-0 mr-4">
                        <p className="text-sm font-bold text-zinc-200 truncate group-hover:text-white transition-colors">
                          {playlist.name}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                          {playlist.problems?.length || 0} Challenges
                        </p>
                      </div>
                      <div className="text-zinc-500 group-hover:text-emerald-500 transition-colors">
                        <ChevronRight className="size-4" />
                      </div>
                    </Link>
                  </motion.div>
                ))}

                {playlists.length === 0 && (
                  <div
                    className="flex flex-col items-center justify-center py-12 text-center border border-zinc-900 bg-[#080808]"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                      No playlists found
                    </p>
                  </div>
                )}
              </motion.div>

              <div className="mt-8">
                <Link
                  to="/roadmap"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors active:bg-zinc-300"
                >
                  <Zap className="size-3.5" />
                  Solve More Problems
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
