import { useEffect } from "react";
import { ActivityCalendar, ThemeInput } from "react-activity-calendar";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import {
  Mail,
  Calendar,
  ListMusic,
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

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      {/* Subtle Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      {/* Profile Header */}
      <div className="border-b border-zinc-800 bg-[#0d0d0d] py-16 mb-8 relative z-10">
        <div className="workspace-container">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <img
                src={
                  authUser.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    authUser.name || "User",
                  )}&background=09090b&color=fff&rounded=false`
                }
                alt="Profile"
                className="size-32 rounded-sm object-cover border border-zinc-800 shadow-2xl relative z-10"
              />
            </div>

            <div className="text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold tracking-tight text-white">
                  {authUser.name}
                </h1>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-zinc-500">
                <div className="flex items-center gap-2">
                  <Mail className="size-4" />
                  <span>{authUser.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  <span>
                    Joined{" "}
                    {authUser.createdAt
                      ? new Date(authUser.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="workspace-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bento Stats Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Solve Stat */}
            <div className="bg-black border border-zinc-800 p-8 rounded-sm relative overflow-hidden group shadow-lg">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Target className="size-24" />
              </div>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4">
                Total Progress
              </p>
              <div className="flex items-end gap-3 mb-2">
                <span className="text-6xl font-bold text-white leading-none">
                  {solvedProblems?.length || 0}
                </span>
                <span className="text-zinc-600 font-bold mb-1">
                  Problems Solved
                </span>
              </div>
              <div className="w-full bg-zinc-900 border border-zinc-800 h-2 rounded-sm mt-6 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-1000"
                  style={{
                    width: `${Math.min((solvedProblems?.length || 0) * 2, 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Skill Radar Chart */}
            <div className="bg-black border border-zinc-800 p-8 rounded-sm flex flex-col group shadow-lg">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-6">
                <Target className="size-4" /> Skill Radar
              </h3>
              <div className="flex-1 min-h-62.5 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#3f3f46" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, "auto"]} tick={false} axisLine={false} />
                    <Radar
                      name="Skills"
                      dataKey="count"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Github Contribution Heatmap */}
            <div className="md:col-span-2 bg-black border border-zinc-800 p-8 rounded-sm overflow-x-auto shadow-lg">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <TrendingUp className="size-4" /> Activity Heatmap
                </h3>
              </div>
              <div className="min-w-200 flex justify-center text-[10px]">
                <ActivityCalendar
                  data={activityData}
                  theme={explicitTheme}
                  labels={{
                    totalCount: `{{count}} submissions in the last year`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Mini Playlists View */}
          <div className="lg:col-span-1 space-y-6 h-full">
            <div className="bg-black border border-zinc-800 p-6 rounded-sm h-full flex flex-col shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">
                  Playlists
                </h3>
                <Link
                  to="/playlists"
                  className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-3 flex-1">
                {playlists.slice(0, 5).map((playlist) => (
                  <Link
                    key={playlist.id}
                    to={`/playlist/${playlist.id}`}
                    className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-sm hover:border-zinc-700 transition-all group"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="text-sm font-bold text-zinc-200 truncate group-hover:text-white transition-colors">
                        {playlist.name}
                      </p>
                      <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider">
                        {playlist.problems?.length || 0} Challenges
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}

                {playlists.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ListMusic className="size-8 text-zinc-800 mb-2" />
                    <p className="text-xs text-zinc-600 italic">
                      No playlists created yet.
                    </p>
                  </div>
                )}
              </div>

              <Link
                to="/roadmap"
                className="mt-8 flex items-center justify-center gap-2 w-full py-4 bg-white text-black rounded-sm text-xs font-bold hover:bg-zinc-200 transition-all"
              >
                <Zap className="size-3.5" />
                Solve More Problems
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
