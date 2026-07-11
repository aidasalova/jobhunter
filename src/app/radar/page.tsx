"use client";

import { useState, useEffect } from "react";
import { searchJobs } from "@/app/actions/searchJobs";
import { createApplication } from "@/lib/storage";
import { Search, ExternalLink, Plus, MapPin, Briefcase } from "lucide-react";

interface JobResult {
  title: string;
  companyName: string;
  location: string;
  snippet: string;
  link: string;
}

export default function Radar() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<JobResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Try to pre-fill from Master Profile
    try {
      const savedProfile = localStorage.getItem("jobhunter_master_profile");
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        // We'll heuristically use 'targetRole' or default to empty
        if (profile.targetRole) {
          setQuery(`${profile.targetRole} jobs`);
        } else if (profile.experience) {
            // Very naive heuristic to pull first few words of experience or just leave blank
            // Better to just leave blank if targetRole isn't there
        }
      }
    } catch (e) {
      console.error("Failed to parse profile", e);
    }
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setToastMessage(null);

    const res = await searchJobs(query);
    if (res.success && res.data) {
      setResults(res.data);
    } else {
      setResults([]);
      setToastMessage(res.error || "Failed to search jobs.");
      setTimeout(() => setToastMessage(null), 3000);
    }

    setLoading(false);
  };

  const handleSaveToTracker = (job: JobResult) => {
    try {
      createApplication({
        companyName: job.companyName,
        roleTitle: job.title,
        jobUrl: job.link,
        status: "Draft",
        jobDescription: job.snippet,
      });
      setToastMessage(`Saved ${job.companyName} to tracker!`);
      setTimeout(() => setToastMessage(null), 3000);
      // Dispatch event so other components update if necessary
      window.dispatchEvent(new Event("jobhunter_update"));
    } catch (err) {
      console.error(err);
      setToastMessage("Failed to save to tracker.");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 rounded-lg bg-slate-800 px-4 py-3 text-sm font-medium text-white shadow-lg animate-in fade-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Search className="h-8 w-8 text-blue-600" />
          Job Radar
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          Live job search powered by Serper. Discover roles and seamlessly add them to your tracker.
        </p>
      </header>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8 relative flex shadow-sm rounded-xl overflow-hidden border border-slate-200">
        <div className="relative flex-grow flex items-stretch">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full border-0 bg-white py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-lg outline-none"
            placeholder="Search for jobs (e.g. Remote Product Manager)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="relative inline-flex items-center gap-x-2 bg-blue-600 px-8 py-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            "Search Jobs"
          )}
        </button>
      </form>

      {/* Results Grid */}
      {hasSearched && !loading && results.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="mt-2 text-sm font-semibold text-slate-900">No jobs found</h3>
          <p className="mt-1 text-sm text-slate-500">Try adjusting your search keywords.</p>
        </div>
      )}

      {loading && results.length === 0 && (
        <div className="flex justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {results.map((job, idx) => (
            <div key={idx} className="flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-5 flex-1">
                <h3 className="text-lg font-semibold text-slate-900 line-clamp-2" title={job.title}>
                  {job.title}
                </h3>
                
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                  <Briefcase className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="font-medium truncate">{job.companyName}</span>
                </div>
                
                <div className="mt-1.5 flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="truncate">{job.location}</span>
                </div>

                <p className="mt-4 text-sm text-slate-500 line-clamp-3 leading-relaxed">
                  {job.snippet}
                </p>
              </div>
              
              <div className="bg-slate-50 px-5 py-4 border-t border-slate-100 flex items-center gap-3">
                <button
                  onClick={() => handleSaveToTracker(job)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Save
                </button>
                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  View
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
