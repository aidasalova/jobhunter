"use client";

import BackupRestore from "@/components/BackupRestore";
import { useState, useEffect } from "react";
import {
  Briefcase,
  GraduationCap,
  Wrench,
  Users,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  FileText,
  Check,
  Save,
  Key,
  Cpu,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { ApiKeyModal } from "@/components/ApiKeyModal";

interface ProfileData {
  aiProvider: string;
  apiKey: string;
  experience: string;
  education: string;
  coreHardSkills: string;
  coreSoftSkills: string;
  strongPoints: string;
  weaknesses: string;
  toneOfVoice: string;
  otherDetails: string;
}

const defaultProfile: ProfileData = {
  aiProvider: "gemini",
  apiKey: "",
  experience: "",
  education: "",
  coreHardSkills: "",
  coreSoftSkills: "",
  strongPoints: "",
  weaknesses: "",
  toneOfVoice: "",
  otherDetails: "",
};

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveKey = (key: string) => {
    const updatedProfile = { ...profile, apiKey: key, aiProvider: "gemini" };
    setProfile(updatedProfile);
    localStorage.setItem("jobhunter_master_profile", JSON.stringify(updatedProfile));
    setIsModalOpen(false);
  };

  useEffect(() => {
    const savedProfile = localStorage.getItem("jobhunter_master_profile");
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        // Ensure new fields exist if migrating from old saved data
        setProfile({ ...defaultProfile, ...parsedProfile });
      } catch (e) {
        console.error("Failed to parse profile data from localStorage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("jobhunter_master_profile", JSON.stringify(profile));
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

  const sections = [
    {
      title: "Background & Foundation",
      fields: [
        {
          id: "experience" as const,
          label: "Experience",
          icon: Briefcase,
          placeholder: "Paste your career history, roles, and major accomplishments...",
        },
        {
          id: "education" as const,
          label: "Education",
          icon: GraduationCap,
          placeholder: "Degrees, certifications, bootcamps...",
        },
      ],
    },
    {
      title: "Skills & Attributes",
      fields: [
        {
          id: "coreHardSkills" as const,
          label: "Core Hard Skills",
          icon: Wrench,
          placeholder: "Programming languages, frameworks, tools...",
        },
        {
          id: "coreSoftSkills" as const,
          label: "Core Soft Skills",
          icon: Users,
          placeholder: "Leadership, communication, agile methodologies...",
        },
      ],
    },
    {
      title: "Personal Insights",
      fields: [
        {
          id: "strongPoints" as const,
          label: "Strong Points",
          icon: TrendingUp,
          placeholder: "What makes you stand out? Key achievements...",
        },
        {
          id: "weaknesses" as const,
          label: "Weaknesses",
          icon: TrendingDown,
          placeholder: "Areas for growth or things you prefer to avoid...",
        },
      ],
    },
    {
      title: "Preferences",
      fields: [
        {
          id: "toneOfVoice" as const,
          label: "Tone of Voice",
          icon: MessageSquare,
          placeholder: "Professional, confident, but approachable...",
        },
        {
          id: "otherDetails" as const,
          label: "Any Other Details",
          icon: FileText,
          placeholder: "Target salary, preferred work environments, etc.",
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Master Profile</h1>
        <p className="mt-2 text-lg text-slate-600">
          Your central repository of professional data. Fill this out thoroughly; the AI will use this context to tailor your CVs.
        </p>
      </header>

      <div className="space-y-8">
        {/* API Settings Section */}
        <section className="overflow-hidden rounded-xl border border-blue-200 bg-blue-50/30 shadow-sm">
          <div className="border-b border-blue-100 bg-blue-100/50 px-6 py-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-blue-900">
              <Key className="h-5 w-5" />
              API Settings
            </h2>
          </div>
          <div className="p-6">
            {!profile.apiKey ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-inner">
                  <Sparkles className="h-8 w-8" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-slate-900">Power your Resume with AI</h3>
                  <p className="mt-2 max-w-md text-sm text-slate-600">
                    Connect a free Google Gemini key to generate highly tailored applications securely in your browser.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-2 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
                >
                  <Sparkles className="h-5 w-5" />
                  Connect Free Google AI
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Google AI Connected</h3>
                    <p className="text-sm text-slate-600">Your key is stored securely on your device.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-blue-600"
                >
                  Change Key
                </button>
              </div>
            )}
          </div>
        </section>

        {isModalOpen && (
          <ApiKeyModal
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveKey}
          />
        )}

        {sections.map((section) => (
          <section key={section.title} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-800">{section.title}</h2>
            </div>
            <div className="space-y-6 p-6">
              {section.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label htmlFor={field.id} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <field.icon className="h-4 w-4 text-blue-600" />
                    {field.label}
                  </label>
                  <textarea
                    id={field.id}
                    value={profile[field.id]}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    rows={8}
                    className="w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-shadow placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* 1. Normal, flowing Save Button (No longer sticky) */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaved}
          className={`flex items-center gap-2 rounded-lg px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isSaved
              ? "cursor-default bg-green-600 hover:bg-green-600 focus:ring-green-500"
              : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 active:scale-95"
          }`}
        >
          {isSaved ? (
            <>
              <Check className="h-5 w-5" />
              Profile Saved!
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Save Profile
            </>
          )}
        </button>
      </div>

      {/* 2. Visual Divider */}
      <hr className="my-10 border-slate-200" />

      {/* 3. Backup & Restore Component */}
      <div className="mb-12">
        <BackupRestore />
      </div>

    </div> // This is the closing tag of your page container
  );
}