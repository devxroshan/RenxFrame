import React from "react";
import { UseMutationResult } from "@tanstack/react-query";

import Button, {ButtonVariant} from "../components/Button";
import Input, {InputVariant} from "../components/Input";
import Template from "../components/Template";


import { NewProjectInfo } from "../dashboard/page";
import { APIErrorReseponse, APISuccessResponse } from "../config/api.config";

interface CreateNewProjectProps {
  newProjectInfo: NewProjectInfo;
  setNewProjectInfo: React.Dispatch<React.SetStateAction<NewProjectInfo>>;
  setIsCreateNewProject: React.Dispatch<React.SetStateAction<boolean>>;
  handleCreateNewProject: () => void;
  createNewProjectMutation: UseMutationResult<
    APISuccessResponse,
    APIErrorReseponse,
    NewProjectInfo
  >;
}

const CreateNewProject = ({
  newProjectInfo,
  setNewProjectInfo,
  setIsCreateNewProject,
  handleCreateNewProject,
  createNewProjectMutation,
}: CreateNewProjectProps) => {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-primary-bg lg:rounded-2xl lg:border border-primary-border md:w-screen md:h-screen lg:w-[90vw] lg:h-[75vh] xl:w-[70vw] xl:h-[78vh] flex flex-col items-start justify-start">
          <div className="flex items-center justify-start w-full py-3 px-6">
            <span className="font-bold text-2xl">New Project</span>
          </div>

          <div className="w-full h-full flex items-start justify-center overflow-hidden">
            {/* Templates Section */}
            <section className="w-[60%] h-full flex flex-col px-4 gap-2 xl:gap-3 items-center justify-start xl:items-start overflow-y-auto no-scrollbar py-4 xl:flex-row xl:flex-wrap">
              <Template></Template>
              <Template></Template>
              <Template></Template>
              <Template></Template>
            </section>

            {/* Create Project Section */}
            <section className="w-[40%] h-full flex flex-col items-start justify-start py-4 pr-4 pl-2 overflow-y-auto no-scrollbar gap-4">
              <div className="w-full h-fit gap-1 flex flex-col items-start justify-center">
                <div className="rounded-xl w-full h-56 bg-white"></div>

                <div className="flex flex-co px-2">
                  <span>Name</span>
                </div>
              </div>

              <div className="w-full flex flex-col gap-2">
                <div className="w-full flex rounded-xl border border-primary-border py-1 px-1 gap-1 bg-secondary-bg">
                  <button
                    className={`transition-all duration-300 ease-in-out border rounded-lg py-1 w-[50%] cursor-pointer ${newProjectInfo.type === "website" ? "text-white bg-primary-bg border-primary-border" : "text-primary-text hover:bg-tertiary-bg border-transparent hover:text-white"}`}
                    onClick={() =>
                      setNewProjectInfo({
                        ...newProjectInfo,
                        type: "website",
                      })
                    }
                  >
                    Website
                  </button>

                  <button
                    className={`transition-all duration-300 ease-in-out border rounded-lg py-1 w-[50%] cursor-pointer ${newProjectInfo.type === "template" ? "text-white bg-primary-bg border-primary-border" : "text-primary-text hover:bg-tertiary-bg border-transparent hover:text-white"}`}
                    onClick={() =>
                      setNewProjectInfo({
                        ...newProjectInfo,
                        type: "template",
                      })
                    }
                  >
                    Template
                  </button>
                </div>

                <Input
                  variant={InputVariant.PRIMARY}
                  value={newProjectInfo.name}
                  placeholder="Name"
                  onChange={(e) =>
                    setNewProjectInfo({
                      ...newProjectInfo,
                      name: e.target.value,
                    })
                  }
                />
                {newProjectInfo.type != "template" && (
                  <Input
                    variant={InputVariant.PRIMARY}
                    value={newProjectInfo.subdomain}
                    placeholder="Subdomain"
                    onChange={(e) =>
                      setNewProjectInfo({
                        ...newProjectInfo,
                        subdomain: e.target.value,
                      })
                    }
                  />
                )}

                <div className="flex flex-col w-full gap-2 mt-2">
                  <Button
                    variant={ButtonVariant.PRIMARY}
                    text="Create"
                    extendStyle="py-2 text-lg"
                    fontStyle="medium"
                    isLoading={createNewProjectMutation.isPending}
                    onLoadingText="Creating..."
                    onClick={() => handleCreateNewProject()}
                  />
                  <Button
                    variant={ButtonVariant.SECONDARY}
                    text="Cancel"
                    extendStyle="py-2 text-lg"
                    fontStyle="medium"
                    onClick={() => setIsCreateNewProject(false)}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNewProject;
