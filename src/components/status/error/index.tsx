import { FlashSlash } from "iconsax-reactjs";
import type { FC } from "react";

const ErrorStatus: FC<{ error: string }> = ({ error }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-100">
      <FlashSlash size="40" className="text-red-700" />
      <span className="block text-center mt-4">{error}</span>
    </div>
  );
};

export default ErrorStatus;
