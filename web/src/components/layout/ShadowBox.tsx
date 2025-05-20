import { ReactNode } from "react";

export const ShadowBox = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-md">
      {children}
    </div>
  );
};
