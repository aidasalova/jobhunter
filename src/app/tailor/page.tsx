"use client";

import { useState, useEffect } from "react";
import { Sparkles, FileSearch, FileText, Link as LinkIcon, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { generateCV, generateCoverLetter } from "@/app/actions/generateApplication";
import { createApplication, updateApplication } from "@/lib/storage";
import { CopyButton } from "@/components/CopyButton";
import { MarkdownEditor } from "@/components/MarkdownEditor";

export default function Tailor() {
  // Input State
  const [companyName, setCompanyName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [jobInputType, setJobInputType] = useState<"text" | "url">("text");
  const [jobText, setJobText] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [baseCvDraft, setBaseCvDraft] = useState("");
  const [customFocus, setCustomFocus] = useState("");

  // Output State
  const [outputTab, setOutputTab] = useState<"cv" | "cover_letter">("cv");
  const [generatedCv, setGeneratedCv] = useState("");
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState("");
  
  // App State
  const [isGeneratingCV, setIsGeneratingCV] = useState(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  
  // Master Profile State (Silently Loaded)
  const [masterProfile, setMasterProfile] = useState<any>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem("jobhunter_master_profile");
    if (savedProfile) {
      try {
        setMasterProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Failed to parse Master Profile", e);
      }
    }
  }, []);

  const validateInputs = () => {
    setError(null);
    setSuccessMsg(null);

    if (!companyName.trim() || !roleTitle.trim()) {
      setError("Company Name and Role Title are required.");
      return false;
    }

    if (!masterProfile || !masterProfile.apiKey) {
      setError("API Key is missing. Please configure your API Settings in the Master Profile.");
      return false;
    }

    if (!jobText && jobInputType === "text") {
      setError("Please paste a job description.");
      return false;
    }

    return true;
  };

  const handleGenerateCV = async () => {
    if (!validateInputs()) return;

    const finalJobContext = jobInputType === "url" ? `Job URL: ${jobUrl}` : jobText;
    setIsGeneratingCV(true);
    setOutputTab("cv");

    try {
      const result = await generateCV(
        masterProfile.aiProvider,
        masterProfile.apiKey,
        JSON.stringify(masterProfile),
        finalJobContext,
        baseCvDraft,
        roleTitle,
        companyName,
        customFocus
      );

      if (result.success && result.data) {
        setGeneratedCv(result.data.cv);
        
        // Auto-save to Tracker
        if (!currentJobId) {
          const saveResult = await createApplication({
            companyName,
            roleTitle,
            jobDescription: jobText,
            jobUrl: jobUrl,
            cvUsed: result.data.cv,
            coverLetterUsed: generatedCoverLetter,
            status: "Draft",
          });
          if (saveResult.success && saveResult.application) {
            setCurrentJobId(saveResult.application.id);
            setSuccessMsg("Saved to Tracker as Draft");
            setTimeout(() => setSuccessMsg(null), 5000);
          }
        } else {
          updateApplication(currentJobId, { cvUsed: result.data.cv });
          setSuccessMsg("Tracker Auto-Updated");
          setTimeout(() => setSuccessMsg(null), 5000);
        }
      } else {
        setError(result.error || "An unknown error occurred.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsGeneratingCV(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!validateInputs()) return;

    const finalJobContext = jobInputType === "url" ? `Job URL: ${jobUrl}` : jobText;
    setIsGeneratingCoverLetter(true);
    setOutputTab("cover_letter");

    try {
      const result = await generateCoverLetter(
        masterProfile.aiProvider,
        masterProfile.apiKey,
        JSON.stringify(masterProfile),
        finalJobContext,
        baseCvDraft,
        roleTitle,
        companyName,
        customFocus
      );

      if (result.success && result.data) {
        setGeneratedCoverLetter(result.data.coverLetter);
        
        // Auto-save to Tracker
        if (!currentJobId) {
          const saveResult = await createApplication({
            companyName,
            roleTitle,
            jobDescription: jobText,
            jobUrl: jobUrl,
            cvUsed: generatedCv,
            coverLetterUsed: result.data.coverLetter,
            status: "Draft",
          });
          if (saveResult.success && saveResult.application) {
            setCurrentJobId(saveResult.application.id);
            setSuccessMsg("Saved to Tracker as Draft");
            setTimeout(() => setSuccessMsg(null), 5000);
          }
        } else {
          updateApplication(currentJobId, { coverLetterUsed: result.data.coverLetter });
          setSuccessMsg("Tracker Auto-Updated");
          setTimeout(() => setSuccessMsg(null), 5000);
        }
      } else {
        setError(result.error || "An unknown error occurred.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  const hasOutput = generatedCv || generatedCoverLetter;

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col p-6 lg:p-8">
      <header className="mb-8 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">CV Tailor</h1>
        <p className="mt-2 text-lg text-slate-600">
          Generate highly tailored applications based on your Master Profile and specific job descriptions.
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-8 lg:flex-row">
        {/* Left Column: Inputs */}
        <div className="flex flex-col gap-6 pb-8 pr-2 lg:w-1/2 lg:overflow-y-auto">
          
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
              <p>{error}</p>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700 shadow-sm">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
              <p>{successMsg}</p>
            </div>
          )}

          {/* Core Details Section */}
          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-800">Job Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="companyName" className="text-sm font-medium text-slate-700">Company Name *</label>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Google"
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="roleTitle" className="text-sm font-medium text-slate-700">Role Title *</label>
                <input
                  id="roleTitle"
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. Frontend Engineer"
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </section>

          {/* Job Description Section */}
          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800">Job Description</h2>
              <div className="flex rounded-lg bg-slate-100 p-1">
                <button
                  onClick={() => setJobInputType("text")}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    jobInputType === "text"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  Paste Text
                </button>
                <button
                  onClick={() => setJobInputType("url")}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    jobInputType === "url"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                  Job URL
                </button>
              </div>
            </div>

            {jobInputType === "text" ? (
              <textarea
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                placeholder="Paste the full job description here. LinkedIn job posts should be copy-pasted here."
                rows={8}
                className="w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            ) : (
              <input
                type="url"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://company.com/careers/job-123"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            )}
          </section>

          {/* Base CV Section */}
          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-base font-semibold text-slate-800">Base CV Draft</h2>
              <p className="mt-1 text-xs text-slate-500">
                Leave blank to generate entirely from your Master Profile.
              </p>
            </div>
            <textarea
              value={baseCvDraft}
              onChange={(e) => setBaseCvDraft(e.target.value)}
              placeholder="Paste a specific CV draft you want to improve, or leave blank..."
              rows={8}
              className="w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </section>

          {/* Custom Focus Section */}
          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-base font-semibold text-slate-800">Custom Instructions / Focus Points</h2>
              <p className="mt-1 text-xs text-slate-500">
                Optional: Add specific instructions for the AI to follow.
              </p>
            </div>
            <textarea
              value={customFocus}
              onChange={(e) => setCustomFocus(e.target.value)}
              placeholder="e.g., Highlight my experience with React and the XYZ project specifically."
              rows={8}
              className="w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </section>

          {/* Generate Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleGenerateCV}
              disabled={isGeneratingCV || isGeneratingCoverLetter}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-blue-50 disabled:text-blue-400"
            >
              {isGeneratingCV ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating CV...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate CV
                </>
              )}
            </button>
            <button
              onClick={handleGenerateCoverLetter}
              disabled={isGeneratingCV || isGeneratingCoverLetter}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-blue-50 disabled:text-blue-400"
            >
              {isGeneratingCoverLetter ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating Cover Letter...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate Cover Letter
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Outputs */}
        <div className="flex min-h-[500px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:min-h-0 lg:w-1/2">
          <div className="flex border-b border-slate-200 bg-slate-50/50 p-2">
            <button
              onClick={() => setOutputTab("cv")}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                outputTab === "cv"
                  ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200"
                  : "text-slate-600 hover:bg-slate-100/50 hover:text-slate-900"
              }`}
            >
              Tailored CV
            </button>
            <button
              onClick={() => setOutputTab("cover_letter")}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                outputTab === "cover_letter"
                  ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200"
                  : "text-slate-600 hover:bg-slate-100/50 hover:text-slate-900"
              }`}
            >
              Cover Letter
            </button>
          </div>
          
          <div className="flex flex-1 flex-col bg-slate-50/30 p-0 sm:p-6">
            {!hasOutput ? (
              /* Empty State */
              <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 shadow-inner">
                  <FileSearch className="h-8 w-8 text-slate-400" />
                </div>
                <div className="max-w-xs space-y-1">
                  <h3 className="text-sm font-semibold text-slate-900">Ready to Generate</h3>
                  <p className="text-sm text-slate-500">
                    Paste a job description and hit generate to see your tailored application. Review properly and use your human judgement.
                  </p>
                </div>
              </div>
            ) : (
              /* Generated Output */
              <div className="relative h-full w-full sm:rounded-xl sm:border sm:border-slate-200 sm:bg-white sm:shadow-sm overflow-hidden">
                <MarkdownEditor
                  value={outputTab === "cv" ? generatedCv : generatedCoverLetter}
                  onChange={(val) => {
                    if (outputTab === "cv") setGeneratedCv(val);
                    else setGeneratedCoverLetter(val);
                  }}
                  placeholder={outputTab === "cv" ? "Your tailored CV will appear here..." : "Your tailored cover letter will appear here..."}
                  exportFileName={
                    outputTab === "cv" 
                    ? `OneMoreCV_CV_${companyName ? companyName.replace(/\s+/g, "_") : "Draft"}` 
                    : `OneMoreCV_CoverLetter_${companyName ? companyName.replace(/\s+/g, "_") : "Draft"}`
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
