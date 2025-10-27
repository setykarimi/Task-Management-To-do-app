import { ArrowSquareLeft } from "iconsax-reactjs";
import React, { type FC } from "react";
import { useNavigate } from "react-router";

const PageTitle: FC<{ title: string, children?: React.ReactElement }> = ({ title, children }) => {
  const navigate = useNavigate();
  return (
    <div className="relative">
      <button className="absolute cursor-pointer" onClick={() => navigate("/")}>
        <ArrowSquareLeft size="32" variant="Bulk" />
      </button>
      <h1 className="text-center font-bold text-xl">{title}</h1>

      {children}
    </div>
  );
};

export default PageTitle;
