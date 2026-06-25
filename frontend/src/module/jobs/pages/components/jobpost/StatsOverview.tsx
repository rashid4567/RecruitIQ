import { Briefcase, TrendingUp, Eye, FileText } from "lucide-react";
import type { JobCardProps } from "../../../types/jobCard.types";


interface StatsOverviewProps {
  stats: {
    totalJobs: number;
    activeJobs: number;
    totalViews: number;
    totalApplications: number;
  };
  jobs: JobCardProps[];
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const statCards = [
    { 
      label: "Total Jobs", 
      value: stats.totalJobs.toString(), 
      icon: Briefcase, 
      trend: "+3", 
      color: "from-blue-500 to-blue-600" 
    },
    { 
      label: "Active Jobs", 
      value: stats.activeJobs.toString(), 
      icon: TrendingUp, 
      trend: "+2", 
      color: "from-emerald-500 to-emerald-600" 
    },
    { 
      label: "Total Views", 
      value: stats.totalViews.toLocaleString(), 
      icon: Eye, 
      trend: "+18%", 
      color: "from-amber-500 to-orange-500" 
    },
    { 
      label: "Applications", 
      value: stats.totalApplications.toLocaleString(), 
      icon: FileText, 
      trend: "+24%", 
      color: "from-indigo-500 to-violet-500" 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {statCards.map((stat, i) => (
        <div 
          key={i} 
          className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-5">
            <div className={`w-12 h-12 bg-linear-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
              {stat.trend}
            </span>
          </div>
          
          <p className="text-4xl font-bold text-gray-900 tracking-tighter">{stat.value}</p>
          <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}