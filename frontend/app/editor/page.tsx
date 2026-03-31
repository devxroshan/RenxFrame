"use client";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

// Icons
import {
  Undo,
  Redo,
  Monitor,
  Tablet,
  Smartphone,
  ChevronDown,
  Box,
  Type,
  Image as ImageIcon,
  Square,
} from "lucide-react";
import Button, { ButtonVariant } from "../components/Button";

// Components

// Stores
import { useAppStore } from "../stores/app.store";
import React, { useEffect, useRef, useState } from "react";
import Input, { InputVariant } from "../components/Input";

enum ScreenSize {
  MOBILE = "375px",
  TABLET = "768px",
  DESKTOP = "1280px",
}

interface EditorProps {
  currentScreenSize: ScreenSize;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
}

const ZOOM_LEVELS = [10, 25, 50, 75, 80, 100, 125, 150, 175, 200, 250, 300];
const DEFAULT_ZOOM = 0.8;

const ElementsIcon = {
  box: <Box className="w-4 h-4" />,
  type: <Type className="w-4 h-4" />,
  image: <ImageIcon className="w-4 h-4" />,
  square: <Square className="w-4 h-4" />,
};

const Elements = [
  { name: "Container", icon: "box" },
  { name: "Text", icon: "type" },
  { name: "Image", icon: "image" },
  { name: "Button", icon: "square" },
];

const Editor = () => {
  // States
  const [currentScreenSize, setCurrentScreenSize] = useState<ScreenSize>(
    ScreenSize.DESKTOP,
  );
  const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM);
  const [selectZoom, setSelectZoom] = useState<boolean>(false);

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

            <span className="font-medium text-sm truncate">
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
                  className={`${currentScreenSize === ScreenSize.DESKTOP ? "bg-primary-blue text-white" : "hover:bg-secondary-text/10 text-secondary-text"} transition-all duration-300 cursor-pointer rounded-lg p-1.5 w-8 h-8`}
                  onClick={() => setCurrentScreenSize(ScreenSize.DESKTOP)}
                />
                <Tablet
                  className={`${currentScreenSize === ScreenSize.TABLET ? "bg-primary-blue text-white" : "hover:bg-secondary-text/10 text-secondary-text"} transition-all duration-300 cursor-pointer rounded-lg p-1.5 w-8 h-8`}
                  onClick={() => setCurrentScreenSize(ScreenSize.TABLET)}
                />
                <Smartphone
                  className={`${currentScreenSize === ScreenSize.MOBILE ? "bg-primary-blue text-white" : "hover:bg-secondary-text/10 text-secondary-text"} transition-all duration-300 cursor-pointer rounded-lg p-1.5 w-8 h-8`}
                  onClick={() => setCurrentScreenSize(ScreenSize.MOBILE)}
                />
              </div>

              <Divider strokeWidth="2px" />

              <div className="flex flex-col items-center gap-2">
                <div
                  className="flex items-center justify-between gap-1 cursor-pointer"
                  onClick={() => setSelectZoom(!selectZoom)}
                >
                  <span className="text-primary-text font-medium text-sm px-2 py-1">{`${Math.round(zoom * 100)}%`}</span>
                  <ChevronDown
                    className="text-primary-text w-4 h-4 cursor-pointer"
                    strokeWidth={2.5}
                  />
                </div>

                {selectZoom && (
                  <div className="absolute top-12 bg-primary-bg border border-primary-border rounded-lg w-24 py-1 flex flex-col items-start justify-center z-20 px-1">
                    {ZOOM_LEVELS.map((level) => (
                      <span
                        key={level}
                        onClick={() => {
                          setZoom(level / 100);
                          setSelectZoom(false);
                        }}
                        className="bg-primary-bg text-primary-text font-medium text-sm px-2 py-1 hover:bg-primary-blue hover:text-white rounded-md w-full text-left cursor-pointer transition-all duration-300"
                      >
                        {level}%
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="h-full w-full flex items-center justify-end">
            <div className="w-fit h-full flex items-center justify-center gap-2">
              <Button
                variant={ButtonVariant.SECONDARY}
                text="Preview"
                extendStyle="px-4 text-sm"
                fontStyle="medium"
              />

              <Button
                variant={ButtonVariant.PRIMARY}
                text="Publish"
                extendStyle="px-4 text-sm"
                fontStyle="medium"
              />

              <Image
                src="/pic.jpg"
                width={1000}
                height={1000}
                alt="User Pfp"
                className="rounded-full w-8 h-8 border border-primary-border"
              />
            </div>
          </div>
        </div>

        <section className="w-full h-[93%] flex items-center justify-center overflow-hidden">
          <Hierarchy />
          <MainEditor
            currentScreenSize={currentScreenSize}
            zoom={zoom}
            setZoom={setZoom}
          />
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
  const [currentResource, setCurrentResource] = useState<
    "components" | "assets"
  >("components");
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <>
      <main className="w-[20%] flex flex-col gap-4 px-2 py-2 h-full bg-primary-bg border-r border-primary-border items-center justify-start">
        <div className="w-full h-fit flex gap-2 items-center justify-between">
          <button
            className={`text-sm font-medium px-3 py-1 rounded-md cursor-pointer w-full transition-all duration-300 ${currentResource === "components" ? "bg-white text-black" : "bg-tertiary-bg text-primary-text hover:bg-gray-100/10 hover:text-white"}`}
            onClick={() => setCurrentResource("components")}
          >
            Components
          </button>

          <button
            className={`text-sm font-medium px-3 py-1 rounded-md cursor-pointer w-full transition-all duration-300 ${currentResource === "assets" ? "bg-white text-black" : "bg-tertiary-bg text-primary-text hover:bg-gray-100/10 hover:text-white"}`}
            onClick={() => setCurrentResource("assets")}
          >
            Assets
          </button>
        </div>

        <Input
          variant={InputVariant.PRIMARY}
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="w-full h-full flex flex-col items-start justify-start gap-2">
          <span className="text-sm text-primary-text font-semibold">
            Basic Elements
          </span>

          <div className="w-full h-full flex flex-col items-center justify-start gap-2">
            {Elements.filter((element) =>
              element.name.toLowerCase().includes(searchTerm.toLowerCase()),
            ).map((element) => (
              <div
                key={element.name}
                className="w-full px-3 py-2 bg-tertiary-bg border border-primary-border rounded-xl flex items-center justify-start gap-2 cursor-pointer hover:bg-secondary-bg transition-all duration-300 hover:text-white text-primary-text"
              >
                {ElementsIcon[element.icon as keyof typeof ElementsIcon]}
                <span className="text-sm font-medium transition-all duration-300 w-full text-left">
                  {element.name}
                </span>
              </div>
            ))}

            {searchTerm &&
              !Elements.some((e) =>
                e.name.toLowerCase().includes(searchTerm.toLowerCase()),
              ) && (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-primary-text font-semibold">
                    No elements found
                  </span>
                </div>
              )}
          </div>
        </div>
      </main>
    </>
  );
};

const MainEditor = ({ currentScreenSize, zoom, setZoom }: EditorProps) => {
  // States
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
      mainEditorRef.current?.addEventListener("wheel", handleMouseWheel, {
        passive: false,
      });
    }

    return () => {
      if (mainEditorRef.current) {
        mainEditorRef.current?.removeEventListener("wheel", handleMouseWheel);
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
        <div className="w-[60%] h-[93%] absolute z-10"></div>
        <div
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: "center",
          }}
          className={`h-full w-full flex items-center justify-center transition-transform duration-75 ease-in-out`}
        >
          <div
            style={{
              width: currentScreenSize,
            }}
            className="flex flex-col items-start justify-center gap-1 h-142"
          >
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
