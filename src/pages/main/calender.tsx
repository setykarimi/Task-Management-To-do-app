import { taskType } from "@/assets/statics";
import PageTitle from "@/components/title";
import type { ITask } from "@/components/types";
import http from "@/lib/axios";
import { TASKS_API } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Clock } from "iconsax-reactjs";
import { useState } from "react";
import { useNavigate } from "react-router";

export const Calender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedType, setSelectedType] = useState("");
  const navigate = useNavigate()

  const today = new Date();
  const start = new Date();
  start.setDate(today.getDate() - 3);

  const end = new Date();
  end.setDate(today.getDate() + 3);

  const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
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

  return (
    <div>
      <PageTitle title="Today’s Tasks"/>
      <section className="flex pt-2 gap-4 flex-nowrap overflow-x-auto overflow-y-hidden mt-4 pb-2 scroll-hide touch-pan-x">
        {days.map((dayObj) => {
          const formatted = dayObj.label.split("/");
          const isSelected =
            selectedDate.toDateString() === dayObj.date.toDateString();

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

      {/* @@@______________ Status Filter ______________@@@ */}
      <section className="flex pt-2 gap-2 flex-nowrap overflow-x-auto overflow-y-hidden mt-4 pb-2 scroll-hide touch-pan-x">
        {taskTypes.map((type) => {
          const isSelected = selectedType === type.id;

          return (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-5 py-1 rounded-lg text-sm text-nowrap border transition-all cursor-pointer shadow ${
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

      {/* @@@______________ Tasks  ______________@@@ */}
      <div className="mt-4">
        {isPending ? (
          <p className="text-gray-500 text-sm text-center">Loading...</p>
        ) : tasks?.length ? (
          <ul className="space-y-4">
            {tasks.map((task: ITask) => {

              const endDate = new Date(task.end_date);
              const diff = endDate.getTime() - selectedDate.getTime(); // 👈 مقایسه با selectedDate
              const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
              const type = taskType.find((t) => t.id === task.status);


              return (
                <li key={task.id} className="bg-white shadow p-3 rounded-lg text-sm flex justify-between cursor-pointer" onClick={()=>navigate(`/task/edit/${task.id}`)}>
                  <div>
                    <span className="block text-[#6E6A7C] text-xs"> {task.group_name} </span>
                    <span className="block mt-1 font-regular"> {task.title} </span>
                    <div className="flex gap-1 items-center mt-1">
                      <Clock size={14} color="#AB94FF"/>
                      <span className={`text-xs font-light ${ days > 0 ? "text-[#AB94FF]" : "text-red-500"}`}>
                      {days > 0 ? `${days} days left` : days === 0 ? "Today" : "Expired"}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs h-fit px-2 py-.5 rounded-full" style={{color: type?.color , background: type?.bg}}>{type?.title}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm text-center">No tasks found</p>
        )}
      </div>
    </div>
  );
};
