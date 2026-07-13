"use client";

import { useRef } from "react";

export default function BackupRestore() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // === EXPORT LOGIC ===
  const handleExport = () => {
    // 1. Gather the data using your exact local storage keys
    const profileData = localStorage.getItem("jobhunter_master_profile");
    const trackerData = localStorage.getItem("jobhunter_applications");

    let parsedProfile = profileData ? JSON.parse(profileData) : null;

    // 2. Scrub the API key before we create the file
    if (parsedProfile && parsedProfile.apiKey) {
      delete parsedProfile.apiKey; 
    }

    // 3. Package it into a single JSON object
    const backup = {
      jobhunter_master_profile: parsedProfile,
      jobhunter_applications: trackerData ? JSON.parse(trackerData) : [],
    };

    // 4. Create a downloadable Blob
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    
    // 5. Trigger the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    
    const date = new Date().toISOString().split('T')[0];
    link.download = `OneMoreCV_Backup_${date}.json`;
    
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // === IMPORT LOGIC ===
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content);

        // 1. Check if it's a valid backup file using your exact keys
        if (parsedData.jobhunter_master_profile !== undefined || parsedData.jobhunter_applications !== undefined) {
          
          // 2. Restore Master Profile (and protect existing API key!)
          if (parsedData.jobhunter_master_profile) {
            
            // Check if they currently have an API key saved in the browser
            const currentProfileData = localStorage.getItem("jobhunter_master_profile");
            let existingApiKey = null;
            
            if (currentProfileData) {
              const currentProfile = JSON.parse(currentProfileData);
              existingApiKey = currentProfile.apiKey; // Save it temporarily
            }

            const importedProfile = parsedData.jobhunter_master_profile;

            // Re-attach the existing API key to the imported profile so it doesn't get wiped out
            if (existingApiKey) {
              importedProfile.apiKey = existingApiKey;
            }

            localStorage.setItem("jobhunter_master_profile", JSON.stringify(importedProfile));
          }

          // 3. Restore Job Tracker
          if (parsedData.jobhunter_applications) {
            localStorage.setItem("jobhunter_applications", JSON.stringify(parsedData.jobhunter_applications));
          }

          alert("Data successfully restored! The page will now reload.");
          
          // 4. Reload the page so the app instantly shows the restored data
          window.location.reload();
        } else {
          alert("Invalid backup file format.");
        }
      } catch (error) {
        console.error("Failed to parse file:", error);
        alert("There was an error reading your backup file.");
      }
    };
    
    // Read the text inside the JSON file
    reader.readAsText(file);
    
    // Reset the file input so they can upload the same file again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-6 bg-slate-700 rounded-xl border border-slate-700 text-slate-200 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white mb-1">Data Backup & Restore</h3>
        <p className="text-sm text-slate-400">
          Your data lives locally in this browser. Export a backup to save your profile and tracker, or to move it to another device.
        </p>
      </div>

      <div className="flex gap-4">
        {/* EXPORT BUTTON */}
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Export Backup (.json)
        </button>

        {/* IMPORT BUTTON (Uses a hidden file input) */}
        <div>
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
          >
            Import Backup
          </button>
        </div>
      </div>
    </div>
  );
}