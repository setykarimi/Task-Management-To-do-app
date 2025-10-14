import { type FC } from "react";

interface IProps {
  register: any;
  label: string;
  name: string;
  options: { id: string | number; title: string }[];
  rules?: any;
}

const SelectBox: FC<IProps> = ({ register, label, name, options, rules }) => {
  return (
    <div className="bg-white p-3 rounded-xl flex flex-col shadow">
      <label className="text-[#6E6A7C] text-xs mb-1">{label}</label>
      <select
        className="outline-0 text-xs w-full p-2 rounded-md border border-gray-200"
        {...register(name, rules)}
      >
        <option value="">انتخاب کنید</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectBox;
