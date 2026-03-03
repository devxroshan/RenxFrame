"use client";
import { useAppStore } from "../stores/app.store";
import { X } from "lucide-react";

interface WorkspaceSettings {
  name: string;
}

const Workspace = () => {
  const appStore = useAppStore();

  const settings: WorkspaceSettings[] = [
    { name: "General" },
    { name: "People" },
    { name: "Sites" },
  ];

  return (
    <>
      {appStore.isWorkspaceActive && (
        <main className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-full h-full md:w-screen md:h-screen lg:rounded-2xl lg:border border-primary-border lg:w-[80vw] lg:h-[80vh] xl:w-[70vw] bg-primary-bg flex flex-col gap-3 py-3 px-3 items-start justify-center">
            <div className="w-full px-4 py-1 flex items-center justify-between">
                <h3 className="font-bold text-2xl">Workspace Settings</h3>
                <X className="cursor-pointer text-primary-text active:scale-95 transition-all duration-300" onClick={() => appStore.setWorkspaceActive(false)}/>
            </div>

            <section className="w-full h-full flex items-center justify-start">
              <div className="w-[30%] xl:w-[25%] h-full py-2 flex flex-col gap-1 items-start justify-start border-r border-primary-border px-2">
                {settings.map((setting) => (
                  <button key={setting.name} className="transition-all duration-300 hover:text-white text-primary-text hover:bg-tertiary-bg py-1 px-4 cursor-pointer w-full text-left rounded-lg">
                    {setting.name}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </main>
      )}
    </>
  );
};

export default Workspace;
