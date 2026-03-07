"use client";
import { useState } from "react";
import { useMemo } from "react";

import RecentProject from "../components/Cards/RecentProject";
import Input, { InputVariant } from "../components/Input";

import { X } from "lucide-react";

import { useAppStore } from "../stores/app.store";

const SitesListWindow = () => {
  const [searchProject, setSearchProject] = useState<string>("");

  const appStore = useAppStore();

  const filteredSites = useMemo(() => {
    const query = searchProject.trim().toLowerCase();

    if (!query) return appStore.sites;

    return appStore.sites.filter((site) =>
      site.name.toLowerCase().includes(query),
    );
  }, [searchProject, appStore.sites]);

  return (
    <>
      {appStore.isSiteListActive && (
        <main className="fixed inset-0 bg-black/50 flex items-center justify-center md:w-screen md:h-screen">
          <section className="bg-primary-bg md:w-screen md:h-screen lg:rounded-xl lg:border border-primary-border lg:w-193 lg:h-[80vh] xl:w-286.75 xl:h-[90vh] flex flex-col py-4 px-3 gap-3">
            <div className="w-full flex items-center justify-between">
              <h3 className="text-4xl font-semibold">Sites</h3>

              <div className="flex items-center gap-2 w-sm">
                <Input
                  variant={InputVariant.PRIMARY}
                  placeholder="Search Project..."
                  value={searchProject}
                  onChange={(e) => setSearchProject(e.target.value)}
                />
                <X
                  className="cursor-pointer text-primary-text active:scale-95 transition-all duration-300 hover:text-secondary-text"
                  onClick={() => appStore.setSiteListActive(false)}
                ></X>
              </div>
            </div>

            <div className="w-full flex flex-wrap content-start flex-1 items-start gap-2 overflow-y-auto no-scrollbar">
              {filteredSites.length > 0 &&
                filteredSites.map((stie) => (
                  <RecentProject
                    key={stie.id}
                    projectId={stie.id}
                    projectName={stie.name}
                    description={stie.subdomain}
                    isActive={stie.isOnline}
                    lastUpdated="6"
                  />
                ))}
            </div>
          </section>
        </main>
      )}
    </>
  );
};

export default SitesListWindow;
