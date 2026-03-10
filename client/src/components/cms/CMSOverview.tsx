  "use client";

  import React from "react";
  import { MousePointer2, BarChart3, Megaphone, Clock, ArrowUpRight,} from "lucide-react";
  import { Button, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
  import { useAnnouncementStore } from "@/store";
  import { CMSOverviewSkeleton } from "./skeleton/CMSOverviewSkeleton";
  import { useRouter } from "next/navigation";

  const CMSOverview = ({isLoading = false}) => {
    const { announcements } = useAnnouncementStore();
    const router = useRouter();
    
    // skeleton rendering
    if (isLoading) return <CMSOverviewSkeleton />;
    // data rendering
    const activeAnnouncements = announcements.filter((ann) => {
      const now = new Date();
      return now >= new Date(ann.startDate) && now <= new Date(ann.endDate);
    }).length;
    //mock stats
    const activeAdsCount = "67";

    const stats = [
      {
        title: "Active Ads",
        value: activeAdsCount,
        icon: <MousePointer2 className="text-blue-500" size={18} />,
      },
      {
        title: "Total Impressions",
        value: "67.0k",
        icon: <BarChart3 className="text-purple-500" size={18} />,
      },
      {
        title: "Active Announcements",
        value: activeAnnouncements,
        icon: <Megaphone className="text-(--byreix-green)" size={18} />,
      },
      {
        title: "Pending Items",
        value: "67",
        icon: <Clock className="text-amber-500" size={18} />,
      },
    ];

    return (
      <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
        {/* quick action buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => router.push("/cms/bannerAdsManagement")}
            className="bg-(--byreix-green) text-black font-bold h-9 px-4 text-xs gap-2 cursor-pointer whitespace-nowrap"
          >
            New Advertisement
          </Button>
          <Button
            variant="outline"
            className="border-white/5 text-white h-9 px-4 text-xs cursor-pointer whitespace-nowrap"
          >
            System Logs
          </Button>
        </div>

        {/* grid container */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="bg-white/2 border-white/5 min-w-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-x-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-white/40 truncate">
                  {stat.title}
                </CardTitle>
                <div className="shrink-0">{stat.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold text-white truncate">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* recent activity list container */}
        <Card className="bg-white/2 border-white/5 flex flex-col max-h-90 mb-4">
          {/* header */}
          <CardHeader className="border-b border-white/5 shrink-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-bold text-white">
                Recent Activity
              </CardTitle>
            </div>
          </CardHeader>
          {/* body */}
          <CardContent className="pt-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <div className="space-y-4 pb-4">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between text-xs group cursor-pointer"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <ArrowUpRight
                      size={14}
                      className="text-zinc-500 mt-0.5 shrink-0 group-hover:text-(--byreix-green) transition-colors"
                    />
                    <span className="text-white/70 line-clamp-1">
                      Cogito ergo sum, I think therefore i am.
                    </span>
                  </div>
                  <span className="text-zinc-600 text-[10px] whitespace-nowrap ml-4">
                    67 days ago
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  export default CMSOverview;
