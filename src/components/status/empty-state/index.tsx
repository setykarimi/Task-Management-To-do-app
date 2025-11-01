import { BoxSearch } from "iconsax-reactjs";
import type { FC } from "react";

const EmptyState :FC<{status?: string}> = ({status}) => {
  return (
    <div className="flex flex-col items-center justify-center mt-100">
        <BoxSearch size="40" color="#5F33E1"/>
        <span className="block text-center mt-4 font-bold text-lg">{status ? status : "No results found"}</span>
    </div>
  )
}


export default EmptyState