"use client";

import { useState } from "react";
import { User, FolderOpen } from "lucide-react";
import ProfileContent from "./ProfileContent";
import ProfileProjects from "./ProfileProjects";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "projects", label: "Projects", icon: FolderOpen },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function ProfileTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 mt-6">
        <div className="flex gap-1 rounded-lg bg-surface-1 p-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-150 ${
                activeTab === tab.id
                  ? "bg-surface-3 text-text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "profile" && <ProfileContent />}

      {activeTab === "projects" && (
        <div className="mx-auto max-w-7xl px-6">
          <ProfileProjects />
        </div>
      )}
    </>
  );
}
