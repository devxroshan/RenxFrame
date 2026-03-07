"use client";

// Components

const Editor = () => {
  return (
    <>
      <main className="w-screen h-screen flex items-center justify-center">
        <Hierarchy />
        <div>
          <iframe></iframe>
        </div>
        <Inspector />
      </main>
    </>
  );
};

function Hierarchy() {
  return (
    <>
      <div></div>
    </>
  );
}

function Inspector() {
  return <></>;
}

export default Editor;
