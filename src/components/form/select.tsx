import { useState, type FC } from "react";
import { ArrowDown2 } from "iconsax-reactjs";

interface IProps {
  register?: any;
  label: string;
  name: string;
  options: { id: string | number; title: string }[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  rules?: any;
}

const CustomSelect: FC<IProps> = ({ label, name, options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | number | undefined>(value);

  const handleSelect = (val: string | number) => {
    setSelected(val);
    onChange?.(val);
    setOpen(false);
  };

  return (
    <div className="relative bg-white p-3 rounded-xl flex flex-col shadow">
      <label className="text-[#6E6A7C] text-xs mb-1">{label}</label>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-xs bg-transparent outline-0 border-none cursor-pointer"
      >
        <span className={selected ? "text-gray-800" : "text-gray-400"}>
          {selected
            ? options.find((o) => o.id === selected)?.title
            : `Select ${label}`}
        </span>
        <ArrowDown2
          size="16"
          className={`text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          className="absolute z-20 left-0 right-0 mt-10 bg-white shadow-lg rounded-lg border border-gray-100 max-h-40 overflow-y-auto"
        >
          {options.map((opt) => (
            <li
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={`px-3 py-2 text-xs cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition ${
                selected === opt.id ? "bg-indigo-100 text-indigo-600" : ""
              }`}
            >
              {opt.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
