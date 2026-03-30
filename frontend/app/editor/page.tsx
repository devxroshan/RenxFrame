"use client";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

// Icons
import { Undo, Redo, Monitor, Tablet, Smartphone } from "lucide-react";
import Button, { ButtonVariant } from "../components/Button";

// Components

// Stores
import { useAppStore } from "../stores/app.store";
import React, { useEffect, useRef, useState } from "react";

enum ScreenSize {
  MOBILE = "375px",
  TABLET = "768px",
  DESKTOP = "1280px",
}

interface EditorProps {
  currentScreenSize: ScreenSize;
}

const Editor = () => {
  // States
  const [currentScreenSize, setCurrentScreenSize] = useState<ScreenSize>(
    ScreenSize.DESKTOP,
  );

  const searchParams = useSearchParams();

  // Stores
  const appStore = useAppStore();

  const pages = [
    { id: "1", name: "Home" },
    { id: "2", name: "About" },
    { id: "3", name: "Contact" },
  ];

  return (
    <>
      <main className="w-screen h-screen flex flex-col items-center justify-start">
        <div className="w-full h-[7%] bg-primary-bg border-b border-primary-border px-4 py-1 flex items-center justify-between">
          <div className="w-full h-full flex items-center gap-4">
            <span className="text-lg font-semibold">RenxFrame</span>

            <Divider />

            <span className="font-medium text-sm">
              {
                appStore.getSiteById(searchParams.get("site_id") as string)
                  ?.name
              }
            </span>

            <select className="bg-tertiary-bg px-2 py-1 w-34 rounded-lg text-sm font-semibold outline-none border border-primary-border focus:ring-2 focus:ring-primary-blue text-primary-text">
              {pages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.name}
                </option>
              ))}
            </select>
          </div>

          <div className=" h-full w-full flex items-center justify-center">
            <div className="bg-tertiary-bg border border-primary-border rounded-lg w-fit h-full flex items-center justify-between px-1 py-1 gap-2">
              <div className="flex items-center gap-2">
                <Undo className="hover:bg-secondary-text/10 text-secondary-text transition-all duration-300 cursor-pointer rounded-lg p-1.5 w-8 h-8" />
                <Redo className="hover:bg-secondary-text/10 text-secondary-text transition-all duration-300 cursor-pointer rounded-lg p-1.5 w-8 h-8" />
              </div>

              <Divider strokeWidth="2px" />

              <div className="flex items-center gap-2">
                <Monitor
                  className="hover:bg-secondary-text/10 text-secondary-text transition-all duration-300 cursor-pointer rounded-lg p-1.5 w-8 h-8"
                  onClick={() => setCurrentScreenSize(ScreenSize.DESKTOP)}
                />
                <Tablet
                  className="hover:bg-secondary-text/10 text-secondary-text transition-all duration-300 cursor-pointer rounded-lg p-1.5 w-8 h-8"
                  onClick={() => setCurrentScreenSize(ScreenSize.TABLET)}
                />
                <Smartphone
                  className="hover:bg-secondary-text/10 text-secondary-text transition-all duration-300 cursor-pointer rounded-lg p-1.5 w-8 h-8"
                  onClick={() => setCurrentScreenSize(ScreenSize.MOBILE)}
                />
              </div>

              <Divider strokeWidth="2px" />

              <div className="flex items-center gap-2">
                <select className="outline-none font-medium text-primary-text border-none px-2 py-1 text-sm">
                  <option value="100">100%</option>
                  <option value="75">75%</option>
                  <option value="50">50%</option>
                  <option value="25">25%</option>
                  <option value="15%">15%</option>
                </select>
              </div>
            </div>
          </div>

          <div className="h-full w-full flex items-center justify-end">
            <div className="w-fit h-full flex items-center justify-center gap-2">
              <Button
                variant={ButtonVariant.SECONDARY}
                text="Preview"
                extendStyle="px-4"
                fontStyle="medium"
              />

              <Button
                variant={ButtonVariant.PRIMARY}
                text="Publish"
                extendStyle="px-4"
                fontStyle="medium"
              />

              <Image
                src="/pic.jpg"
                width={1000}
                height={1000}
                alt="User Pfp"
                className="rounded-full w-10 h-10 border border-primary-border"
              />
            </div>
          </div>
        </div>

        <section className="w-full h-[93%] flex items-center justify-center">
          <Hierarchy />
          <MainEditor currentScreenSize={currentScreenSize} />
          <Inspector />
        </section>
      </main>
    </>
  );
};

const Divider = ({ strokeWidth }: { strokeWidth?: string }) => {
  return (
    <div
      className={`w-px h-full bg-primary-border rounded-full`}
      style={{ width: strokeWidth }}
    ></div>
  );
};

const Hierarchy = () => {
  return (
    <>
      <main className="w-[20%] h-full bg-primary-bg border-r border-primary-border"></main>
    </>
  );
};

const MainEditor = ({ currentScreenSize }: EditorProps) => {
  // States
  const [zoom, setZoom] = useState<number>(0.8); // zoom * 100 = zoom percentage
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Refs
  const mainEditorRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (isDragging) {
      setPan((prevPan) => ({
        x: prevPan.x + e.movementX * (1 / zoom),
        y: prevPan.y + e.movementY * (1 / zoom),
      }));
    }
  };

  const handleMouseWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const zoomChange = e.deltaY > 0 ? -0.05 : 0.05;
      setZoom((prevZoom) => Math.min(Math.max(prevZoom + zoomChange, 0.1), 3));
    }
  };

  useEffect(() => {
    if (mainEditorRef.current) {
      mainEditorRef.current.addEventListener("wheel", handleMouseWheel, {
        passive: false,
      });
    }

    return () => {
      if (mainEditorRef.current) {
        mainEditorRef.current.removeEventListener("wheel", handleMouseWheel);
      }
    };
  }, []);

  return (
    <>
      <main
        ref={mainEditorRef}
        onMouseDown={(e) => {
          if (e.button === 1) {
            setIsDragging(true);
          }
        }}
        onMouseUp={(e) => {
          if (e.button === 1) {
            setIsDragging(false);
          }
        }}
        onMouseMove={(e) => {
          mainEditorRef.current?.style.setProperty(
            "cursor",
            isDragging ? "grabbing" : "default",
          );
          handleMouseMove(e);
        }}
        onMouseLeave={() => setIsDragging(false)}
        className={`w-[60%] h-full bg-secondary-bg overflow-hidden flex items-center justify-center`}
      >
        <div
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: "center",
          }}
          className={`h-full w-full flex items-center justify-center transition-transform duration-75 ease-in-out`}
        >
          <div style={{
            width: currentScreenSize
          }} className="flex flex-col items-start justify-center gap-1 h-142">
            <span className="font-medium text-primary-text">
              {currentScreenSize}
            </span>

            <iframe
              srcDoc="<span>Hello, World!</span>"
              className={`bg-white w-full h-full`}
            ></iframe>
          </div>
        </div>
      </main>
    </>
  );
};

const Inspector = () => {
  return (
    <main className="w-[20%] h-full bg-primary-bg border-l border-primary-border"></main>
  );
};

export default Editor;
