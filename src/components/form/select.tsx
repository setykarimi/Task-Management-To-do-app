import { ArrowDown2 } from "iconsax-reactjs";
import { useEffect, useRef, useState, type FC } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import * as Iconsax from "iconsax-reactjs";

interface IProps {
  register: UseFormRegister<any>;
  label: string;
  name: string;
  options: { id: string | number; title: string }[];
  rules?: any;
  errors: FieldErrors<any>;
  defaultValue?: string | number;
  showIcon?: boolean;
}

const CustomSelect: FC<IProps> = ({
  register,
  label,
  name,
  options,
  rules,
  errors,
  defaultValue,
  showIcon,
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | number | undefined>(defaultValue);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { onChange, onBlur, ref } = register(name, rules);

  useEffect(() => {
    setSelected(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string | number) => {
    setSelected(val);
    onChange({ target: { name, value: val } });
    setOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative bg-white p-3 rounded-xl flex flex-col shadow ${
        errors?.[name] && "border border-red-200 shadow-red-100"
      }`}
    >
      <label className="text-[#6E6A7C] text-xs mb-1">{label}</label>

      <input type="hidden" name={name} value={selected || ""} ref={ref} onBlur={onBlur} readOnly />

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-xs bg-transparent outline-0 border-none cursor-pointer"
      >
        <span className={selected ? "text-gray-800" : "text-gray-400"}>
          {selected ? options.find((o) => o.id === selected)?.title : `Select ${label}`}
        </span>
        <ArrowDown2
          size="16"
          className={`text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul className="absolute z-20 left-0 right-0 mt-10 bg-white shadow-lg rounded-lg border border-gray-100 max-h-40 overflow-y-auto">
          {options.map((opt) => {
            const IconComponent =
              showIcon && Iconsax[opt.title as keyof typeof Iconsax]
                ? (Iconsax[opt.title as keyof typeof Iconsax] as FC<{ size?: string | number }>)
                : null;

            return (
              <li
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={`px-3 py-2 text-xs cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition flex gap-2 items-center ${
                  selected === opt.id ? "bg-indigo-100 text-indigo-600" : ""
                }`}
              >
                {IconComponent && <IconComponent size="14" />}
                {opt.title}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
