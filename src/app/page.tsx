"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getApplications, JobApplication } from "@/lib/storage";
import { Briefcase, Send, Users, Trophy, CheckCircle2, Circle, ArrowRight, Loader2, XCircle } from "lucide-react";

export default function Dashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setJobs(getApplications());
    
    const savedProfile = localStorage.getItem("jobhunter_master_profile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.apiKey) {
          setHasApiKey(true);
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const totalCount = jobs.length;
  const appliedCount = jobs.filter(j => j.status === "Applied").length;
  const interviewCount = jobs.filter(j => j.status === "Interviewing").length;
  const offerCount = jobs.filter(j => j.status === "Offer").length;
  const rejectedCount = jobs.filter(j => j.status.startsWith("Rejected")).length;

  const hasFirstApp = jobs.length > 0;
  const hasTrackedProgress = jobs.some(j => j.status !== "Draft");

  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-2 text-lg text-slate-600">Welcome to One More CV. Generate and track your job applications and prepare for interviews with AI Coach. All your data always stays private.</p>
      </div>

      {/* Funnel Stats */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Total Applications" value={totalCount} icon={Briefcase} color="blue" />
        <StatCard title="Applied" value={appliedCount} icon={Send} color="indigo" />
        <StatCard title="Interviewing" value={interviewCount} icon={Users} color="purple" />
        <StatCard title="Offers" value={offerCount} icon={Trophy} color="green" />
        <StatCard title="Rejected" value={rejectedCount} icon={XCircle} color="red" />
      </div>

      {/* Onboarding Checklist */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">Onboarding Checklist</h2>
          <p className="mt-1 text-sm text-slate-500">Complete these steps to get the most out of One More CV.</p>
        </div>
        <div className="divide-y divide-slate-100 p-2">
          <ChecklistItem 
            title="Set up your Master Profile & API Key" 
            isComplete={hasApiKey} 
            href="/profile"
          />
          <ChecklistItem 
            title="Tailor your first application" 
            isComplete={hasFirstApp} 
            href="/tailor"
          />
          <ChecklistItem 
            title="Track your progress" 
            isComplete={hasTrackedProgress} 
            href="/tracker"
          />
          <ChecklistItem 
            title="Prepare for the interview with AI Coach" 
            isComplete={hasTrackedProgress} 
            href="/tracker"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: number, icon: any, color: string }) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorMap[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function ChecklistItem({ title, isComplete, href }: { title: string, isComplete: boolean, href: string }) {
  return (
    <Link href={href} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors rounded-lg group">
      <div className="flex items-center gap-3">
        {isComplete ? (
          <CheckCircle2 className="h-6 w-6 text-green-500" />
        ) : (
          <Circle className="h-6 w-6 text-slate-300" />
        )}
        <span className={`font-medium ${isComplete ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
          {title}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
        Go to step <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
