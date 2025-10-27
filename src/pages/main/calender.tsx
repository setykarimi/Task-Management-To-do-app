import { taskType } from "@/assets/statics";
import http from "@/lib/axios";
import { TASKS_API } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const Calender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedType, setSelectedType] = useState("");

  const today = new Date();
  const start = new Date();
  start.setDate(today.getDate() - 3);

  const end = new Date();
  end.setDate(today.getDate() + 3);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const taskTypes = [{ title: "All", id: "" }, ...taskType];

  const days: { label: string; value: string; date: Date }[] = [];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const copy = new Date(d);
    const dayName = weekDays[copy.getDay()];
    const day = copy.getDate();
    const month = months[copy.getMonth()];
    const formatted = `${dayName} / ${day} / ${month}`;
    const value = copy.toISOString().split("T")[0];
    days.push({ label: formatted, value, date: copy });
  }

  // ✅ فچ تسک‌ها بر اساس تاریخ و نوع
  const { data: tasks, isPending } = useQuery({
    queryKey: ["tasks", selectedDate.toISOString().split("T")[0], selectedType],
    queryFn: async () => {
      const date = selectedDate.toISOString().split("T")[0];
      let url = `${TASKS_API.TASKS}?start_date=lte.${date}`;

      if (selectedType) {
        url += `&status=eq.${selectedType}`; // اضافه کردن فیلتر استتوس
      }

      const res = await http.get(url);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  console.log("Tasks:", tasks);

  return (
    <div>
      {/* 🔹 تاریخ‌ها */}
      <section className="flex pt-2 gap-4 flex-nowrap overflow-x-auto overflow-y-hidden mt-2 pb-2 scroll-hide touch-pan-x">
        {days.map((dayObj) => {
          const formatted = dayObj.label.split("/");
          const isSelected = selectedDate.toDateString() === dayObj.date.toDateString();

          return (
            <div
              key={dayObj.value}
              onClick={() => setSelectedDate(dayObj.date)}
              className={`cursor-pointer py-2.5 px-5 rounded-xl shadow text-center text-xs transition-all ${
                isSelected
                  ? "bg-[#5F33E1] text-white scale-105"
                  : "bg-white text-black"
              }`}
            >
              <span className="block">{formatted[2]}</span>
              <span className="block text-lg font-bold">{formatted[1]}</span>
              <span className="block">{formatted[0]}</span>
            </div>
          );
        })}
      </section>

      {/* 🔹 فیلتر استتوس */}
      <section className="flex pt-2 gap-2 flex-nowrap overflow-x-auto overflow-y-hidden mt-2 pb-2 scroll-hide touch-pan-x">
        {taskTypes.map((type) => {
          const isSelected = selectedType === type.id;

          return (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-5 py-1 rounded-lg text-sm text-nowrap border transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#5F33E1] text-white border-[#5F33E1]"
                  : "bg-[#EDE8FF] text-[#5F33E1] border-transparent"
              }`}
            >
              {type.title}
            </button>
          );
        })}
      </section>

      {/* 🔹 لیست تسک‌ها */}
      <div className="mt-4">
        {isPending ? (
          <p className="text-gray-500 text-sm text-center">Loading...</p>
        ) : tasks?.length ? (
          <ul className="space-y-2">
            {tasks.map((task: any) => (
              <li
                key={task.id}
                className="bg-white shadow p-3 rounded-lg text-sm flex justify-between"
              >
                <span>{task.title}</span>
                <span className="text-gray-400">{task.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm text-center">No tasks found</p>
        )}
      </div>
    </div>
  );
};
