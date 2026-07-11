"use client";

import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { updateApplication, createApplication } from "@/lib/storage";

export function StatusDropdown({ id, currentStatus, onChange }: { id: string, currentStatus: string, onChange?: () => void }) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const statuses = [
    "Draft",
    "Applied",
    "Interviewing",
    "Offer",
    "Rejected Automatically",
    "Rejected after Screening",
    "Rejected after Interview"
  ];

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setIsUpdating(true);
    
    // Simulate slight delay for UX
    await new Promise(res => setTimeout(res, 300));
    updateApplication(id, { status: newStatus });
    
    if (onChange) onChange();
    setIsUpdating(false);
  };

  const isRejected = status.startsWith("Rejected");

  return (
    <div className="relative inline-block w-48">
      <select
        value={status}
        onChange={handleChange}
        disabled={isUpdating}
        className={`w-full appearance-none rounded-full px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 ${
          status === "Draft" ? "bg-slate-100 text-slate-700" :
          status === "Applied" ? "bg-blue-50 text-blue-700" :
          status === "Interviewing" ? "bg-purple-50 text-purple-700" :
          status === "Offer" ? "bg-green-50 text-green-700" :
          isRejected ? "bg-red-50 text-red-700" :
          "bg-slate-100 text-slate-700"
        }`}
      >
        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      {isUpdating && <Loader2 className="absolute right-2 top-2 h-3 w-3 animate-spin text-slate-400" />}
    </div>
  );
}

export function ManualAddModal({ onAdd, initialData, isEditMode = false }: { onAdd?: () => void, initialData?: any, isEditMode?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [companyName, setCompanyName] = useState(initialData?.companyName || "");
  const [roleTitle, setRoleTitle] = useState(initialData?.roleTitle || "");
  const [jobUrl, setJobUrl] = useState(initialData?.jobUrl || "");
  const [jobDescription, setJobDescription] = useState(initialData?.jobDescription || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if initialData changes or modal opens
  const openModal = () => {
    if (isEditMode && initialData) {
      setCompanyName(initialData.companyName || "");
      setRoleTitle(initialData.roleTitle || "");
      setJobUrl(initialData.jobUrl || "");
      setJobDescription(initialData.jobDescription || "");
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !roleTitle.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate slight delay for UX
    await new Promise(res => setTimeout(res, 300));
    
    if (isEditMode && initialData?.id) {
      updateApplication(initialData.id, {
        companyName,
        roleTitle,
        jobUrl,
        jobDescription,
      });
    } else {
      createApplication({
        companyName,
        roleTitle,
        jobUrl,
        jobDescription,
        status: "Applied"
      });
    }
    
    if (onAdd) onAdd();
    
    setIsSubmitting(false);
    setIsOpen(false);
    if (!isEditMode) {
      setCompanyName("");
      setRoleTitle("");
      setJobUrl("");
      setJobDescription("");
    }
  };

  return (
    <>
      {!isEditMode ? (
        <button 
          onClick={openModal}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          New Application
        </button>
      ) : (
        <button 
          onClick={openModal}
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          title="Edit Application"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-900">{isEditMode ? "Edit Application" : "Add Application"}</h3>
              <button onClick={() => setIsOpen(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                    placeholder="e.g. Google"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Role Title *</label>
                  <input
                    type="text"
                    required
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                    placeholder="e.g. Frontend Engineer"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Job URL</label>
                  <input
                    type="url"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Job Description (Optional)</label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={8}
                    className="w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                    placeholder="Paste the job description here to get highly tailored Interview Coach questions later."
                  />
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (isEditMode ? "Save Changes" : "Save Application")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
