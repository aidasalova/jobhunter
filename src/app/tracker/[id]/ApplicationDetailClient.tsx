"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Save, CheckCircle2, Loader2, MessageSquare, Play, RefreshCw, FileText, Lightbulb } from "lucide-react";
import { getApplicationById, updateApplication, JobApplication } from "@/lib/storage";
import { generateQuestions, generateAnswer } from "@/app/actions/interviewCoach";
import { StatusDropdown } from "../ClientComponents";
import { CopyButton } from "@/components/CopyButton"; 
import { MarkdownEditor } from "@/components/MarkdownEditor";

export default function ApplicationDetailClient({ id }: { id: string }) {
  // Document State
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [cvText, setCvText] = useState("");
  const [clText, setClText] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [salaryExpectation, setSalaryExpectation] = useState("");

  // UI State
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"documents" | "interview">("documents");

  // Interview Coach State
  const [masterProfile, setMasterProfile] = useState<any>(null);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [strategicAdvice, setStrategicAdvice] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loadingAnswers, setLoadingAnswers] = useState<Record<number, boolean>>({});
  const [interviewError, setInterviewError] = useState<string | null>(null);

  useEffect(() => {
    // Load application
    const app = getApplicationById(id);
    if (app) {
      setApplication(app);
      setCvText(app.cvUsed || "");
      setClText(app.coverLetterUsed || "");
      setJobUrl(app.jobUrl || "");
      setSalaryExpectation(app.salaryExpectation || "");
    }

    // Load master profile
    const savedProfile = localStorage.getItem("jobhunter_master_profile");
    if (savedProfile) {
      try {
        setMasterProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Failed to parse Master Profile", e);
      }
    }
  }, [id]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    // Simulate slight delay for UX
    await new Promise(res => setTimeout(res, 300));
    const result = updateApplication(id, {
      cvUsed: cvText,
      coverLetterUsed: clText,
      jobUrl,
      salaryExpectation,
    });

    setIsSaving(false);
    if (result.success && result.application) {
      setApplication(result.application);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      alert(result.error || "Failed to save changes.");
    }
  };

  if (!application) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const handleGenerateQuestions = async () => {
    setInterviewError(null);
    if (!masterProfile || !masterProfile.apiKey) {
      setInterviewError("API Key is missing. Please configure your API Settings in the Master Profile.");
      return;
    }

    setIsGeneratingQuestions(true);
    const result = await generateQuestions(
      masterProfile.aiProvider,
      masterProfile.apiKey,
      application.jobDescription,
      cvText,
      application.roleTitle,
      application.companyName
    );
    setIsGeneratingQuestions(false);

    if (result.success && result.data) {
      setQuestions(result.data.questions);
      setStrategicAdvice(result.data.strategicAdvice);
      setAnswers({}); // Reset answers for new questions
    } else {
      setInterviewError(result.error || "Failed to generate questions.");
    }
  };

  const handleRevealAnswer = async (index: number, question: string) => {
    setInterviewError(null);
    if (!masterProfile || !masterProfile.apiKey) return;

    setLoadingAnswers((prev) => ({ ...prev, [index]: true }));

    const result = await generateAnswer(
      masterProfile.aiProvider,
      masterProfile.apiKey,
      application.jobDescription,
      cvText,
      question,
      application.roleTitle,
      application.companyName
    );

    setLoadingAnswers((prev) => ({ ...prev, [index]: false }));

    if (result.success && result.data) {
      setAnswers((prev) => ({ ...prev, [index]: result.data }));
    } else {
      setInterviewError(result.error || "Failed to generate answer.");
    }
  };

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col p-6 lg:p-8">
      {/* Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/tracker" className="flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Tracker
        </Link>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all disabled:opacity-75 ${
            saveSuccess ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saveSuccess ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saveSuccess ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Header */}
      <header className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{application.companyName}</h1>
            <p className="mt-1 text-xl text-slate-600">{application.roleTitle}</p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Status</span>
            <StatusDropdown id={application.id} currentStatus={application.status} />
          </div>
        </div>

        {/* Metadata Inputs */}
        <div className="mt-8 grid gap-6 border-t border-slate-100 pt-6 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Job URL</label>
            <div className="relative">
              <input
                type="url"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://company.com/careers"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 pr-10 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              {jobUrl && (
                <a href={jobUrl} target="_blank" rel="noreferrer" className="absolute right-3 top-2.5 text-slate-400 transition-colors hover:text-blue-600">
                  <ExternalLink className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Salary Expectation</label>
            <input
              type="text"
              value={salaryExpectation}
              onChange={(e) => setSalaryExpectation(e.target.value)}
              placeholder="e.g. $120,000 - $140,000"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </header>

      {/* Main Tabs */}
      <div className="mb-6 flex space-x-1 rounded-xl bg-slate-100 p-1">
        <button
          onClick={() => setActiveTab("documents")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
            activeTab === "documents"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
          }`}
        >
          <FileText className="h-4 w-4" />
          Documents
        </button>
        <button
          onClick={() => setActiveTab("interview")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
            activeTab === "interview"
              ? "bg-white text-purple-600 shadow-sm"
              : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Interview Coach
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "documents" && (
        <div className="flex min-h-[600px] flex-1 flex-col gap-6 lg:flex-row">
          <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <MarkdownEditor
              label="Tailored CV"
              value={cvText}
              onChange={setCvText}
              placeholder="Your CV will appear here..."
            />
          </div>
          
          <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <MarkdownEditor
              label="Cover Letter"
              value={clText}
              onChange={setClText}
              placeholder="Your Cover Letter will appear here..."
            />
          </div>
        </div>
      )}

      {activeTab === "interview" && (
        <div className="flex flex-1 flex-col rounded-xl border border-slate-200 bg-white shadow-sm p-6 lg:p-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">AI Interview Prep</h2>
              <p className="text-sm text-slate-500 mt-1">Generate likely questions tailored specifically to your CV and this role.</p>
            </div>
            <button
              onClick={handleGenerateQuestions}
              disabled={isGeneratingQuestions}
              className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-purple-700 disabled:opacity-50"
            >
              {isGeneratingQuestions ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing Details...
                </>
              ) : questions.length > 0 ? (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Regenerate
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4" />
                  Generate 10 Questions
                </>
              )}
            </button>
          </div>

          {interviewError && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              {interviewError}
            </div>
          )}

          {questions.length > 0 ? (
            <div className="space-y-6">
              {strategicAdvice && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
                  <div className="flex items-center gap-2 border-b border-blue-200/60 pb-3 mb-3">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                    <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide">Interview Strategy</h3>
                  </div>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {strategicAdvice}
                  </p>
                </div>
              )}

              {questions.map((question, idx) => (
                <div key={idx} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                        {idx + 1}
                      </div>
                      <p className="mt-1 flex-1 text-base font-medium text-slate-900">{question}</p>
                    </div>

                    {!answers[idx] && (
                      <div className="mt-4 ml-12">
                        <button
                          onClick={() => handleRevealAnswer(idx, question)}
                          disabled={loadingAnswers[idx]}
                          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-purple-600 disabled:opacity-50"
                        >
                          {loadingAnswers[idx] ? (
                            <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                          ) : (
                            <Play className="h-4 w-4 text-purple-600" />
                          )}
                          Reveal Suggested STAR Answer
                        </button>
                      </div>
                    )}
                  </div>

                  {answers[idx] && (
                    <div className="border-t border-slate-200 bg-white p-5 pl-17">
                      <div className="prose prose-sm max-w-none text-slate-700 prose-headings:font-bold prose-headings:text-slate-900">
                        {/* Simple markdown parsing for bold text just for display purposes */}
                        {answers[idx].split('\n').map((line, i) => {
                          const boldParsed = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-bold">$1</strong>');
                          return (
                            <p key={i} className="my-1.5" dangerouslySetInnerHTML={{ __html: boldParsed }} />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            !isGeneratingQuestions && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                  <MessageSquare className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Ready for Interview Prep?</h3>
                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  We'll use your tailored CV and the job description to generate the 10 most likely questions they'll ask you.
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
