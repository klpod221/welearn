"use client";

export default function DataPage({ title, subTitle, actions, children }) {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-2 flex justify-between items-center">
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold">{title}</h2>
          {subTitle && <p className="text-sm text-gray-500">{subTitle}</p>}
        </div>

        <div className="flex items-center">{actions}</div>
      </div>

      <div className="h-full overflow-x-auto">{children}</div>
    </div>
  );
}
