"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getApplications, deleteApplication, JobApplication } from "@/lib/storage";
import { Loader2, Sparkles, Trash2, Search } from "lucide-react";
import { StatusDropdown, ManualAddModal } from "./ClientComponents";

export default function Tracker() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const statuses = [
    "All Statuses",
    "Draft",
    "Applied",
    "Interviewing",
    "Offer",
    "Rejected Automatically",
    "Rejected after Screening",
    "Rejected after Interview"
  ];

  const refreshJobs = () => {
    setJobs(getApplications());
  };

  useEffect(() => {
    setIsMounted(true);
    refreshJobs();
    
    const handleStorageChange = () => refreshJobs();
    window.addEventListener("jobhunter_update", handleStorageChange);
    return () => window.removeEventListener("jobhunter_update", handleStorageChange);
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      deleteApplication(id);
      refreshJobs();
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            job.roleTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All Statuses" || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchQuery, statusFilter]);

  if (!isMounted) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Application Tracker</h1>
          <p className="mt-2 text-lg text-slate-600">Track and manage your tailored job applications.</p>
        </div>
        <ManualAddModal onAdd={refreshJobs} />
      </div>

      {/* Filter Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by company or role..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 pl-10 pr-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm"
          />
        </div>
        <div className="sm:w-64">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm"
          >
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Job List */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Company</th>
                <th className="px-6 py-4 font-medium">Role Title</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    {jobs.length === 0 ? "No applications tracked yet. Use the CV Tailor to generate one or add one manually!" : "No applications match your search."}
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="group transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      <Link href={`/tracker/${job.id}`} className="hover:text-blue-600 hover:underline">
                        {job.companyName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <Link href={`/tracker/${job.id}`} className="hover:text-blue-600 hover:underline">
                        {job.roleTitle}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusDropdown id={job.id} currentStatus={job.status} onChange={refreshJobs} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/tracker/${job.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 shadow-sm transition-colors hover:bg-purple-100"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          View & Prep
                        </Link>
                        <ManualAddModal onAdd={refreshJobs} initialData={job} isEditMode={true} />
                        <button 
                          onClick={() => handleDelete(job.id)}
                          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Delete Application"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
