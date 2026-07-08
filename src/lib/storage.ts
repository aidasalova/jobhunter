export interface JobApplication {
  id: string;
  companyName: string;
  roleTitle: string;
  jobUrl: string;
  jobDescription: string;
  status: string;
  salaryExpectation: string;
  cvUsed: string;
  coverLetterUsed: string;
  appliedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "jobhunter_applications";

export function getApplications(): JobApplication[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    // Sort by createdAt descending
    return parsed.sort((a: JobApplication, b: JobApplication) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  } catch (e) {
    console.error("Failed to parse applications from localStorage", e);
    return [];
  }
}

export function getApplicationById(id: string): JobApplication | null {
  const applications = getApplications();
  return applications.find((app) => app.id === id) || null;
}

export function createApplication(data: Partial<JobApplication>): { success: boolean; application?: JobApplication; error?: string } {
  if (typeof window === "undefined") return { success: false, error: "Window is undefined" };
  
  try {
    const applications = getApplications();
    const newApp: JobApplication = {
      id: crypto.randomUUID(),
      companyName: data.companyName || "",
      roleTitle: data.roleTitle || "",
      jobUrl: data.jobUrl || "",
      jobDescription: data.jobDescription || "",
      status: data.status || "Draft",
      salaryExpectation: data.salaryExpectation || "",
      cvUsed: data.cvUsed || "",
      coverLetterUsed: data.coverLetterUsed || "",
      appliedAt: data.status === "Applied" ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    applications.push(newApp);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    
    return { success: true, application: newApp };
  } catch (e: any) {
    console.error("Failed to create application", e);
    return { success: false, error: e.message };
  }
}

export function updateApplication(id: string, data: Partial<JobApplication>): { success: boolean; application?: JobApplication; error?: string } {
  if (typeof window === "undefined") return { success: false, error: "Window is undefined" };
  
  try {
    const applications = getApplications();
    const index = applications.findIndex((app) => app.id === id);
    
    if (index === -1) {
      return { success: false, error: "Application not found" };
    }
    
    const existing = applications[index];
    
    // Auto-update appliedAt if status changes to Applied
    let newAppliedAt = existing.appliedAt;
    if (data.status === "Applied" && existing.status !== "Applied") {
      newAppliedAt = new Date().toISOString();
    }
    
    const updatedApp: JobApplication = {
      ...existing,
      ...data,
      appliedAt: newAppliedAt,
      updatedAt: new Date().toISOString(),
    };
    
    applications[index] = updatedApp;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    
    return { success: true, application: updatedApp };
  } catch (e: any) {
    console.error("Failed to update application", e);
    return { success: false, error: e.message };
  }
}

export function deleteApplication(id: string): { success: boolean; error?: string } {
  if (typeof window === "undefined") return { success: false, error: "Window is undefined" };
  
  try {
    const applications = getApplications();
    const updatedApplications = applications.filter((app) => app.id !== id);
    
    if (applications.length === updatedApplications.length) {
      return { success: false, error: "Application not found" };
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedApplications));
    
    return { success: true };
  } catch (e: any) {
    console.error("Failed to delete application", e);
    return { success: false, error: e.message };
  }
}
