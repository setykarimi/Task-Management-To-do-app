import type { ITaskGroup } from "@/components/types";
import http from "@/lib/axios";
import { useAuth } from "@/providers";
import { TASKS_API } from "@/services/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Add, AddCircle, AddSquare, Notification } from "iconsax-reactjs";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

interface ITask {
  created_at: string;
  description: null | string;
  end_date: string;
  group_id: number;
  id: number;
  start_date: string;
  status: string;
  title: string;
  user_id: string;
  group_name: string
}

export default function Dashboard() {
  const { profile } = useAuth()
  const navigate = useNavigate()

  const { data: inprogressTasks, isPending } = useQuery({
    queryKey: ["tasks", "inprogress"], 
    queryFn: async () => {
      const res = await http.get(`${TASKS_API.TASKS}?status=eq.inprogress`);
      return res.data;
    },
    staleTime: 1000 * 60 * 5, 
  });

  const { data: todayTasks, isPending: isPendingTodayTasks } = useQuery({
    queryKey: ["tasks", "today"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const url = `${TASKS_API.TASKS}?start_date=lte.${today}&end_date=gte.${today}`;
      const res = await http.get(url);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const { data: taskGroups, isPending: peindingTaskGroup } = useQuery({
    queryKey: ["taskGroups"],
    queryFn: async () => {
      const res = await http.get(TASKS_API.TASK_GROUP);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });


  if (isPending || peindingTaskGroup || !profile || isPendingTodayTasks) return <div>loading</div>;

  return (
    <div>
      <header>
        <div className="flex items-center mb-4">
          {/* <img src="" alt="avatar" /> */}
          <div>
            <span className="text-sm">Hello!</span>
            <h3 className="text-lg font-bold">{profile[0]?.name}</h3>
          </div>
          <Notification className="ml-auto" size="21" variant="Bold" />
        </div>
      </header>
      {todayTasks && <section>
        <div className="flex gap-2 flex-nowrap overflow-x-auto overflow-y-hidden mt-2 pb-2 scroll-hide touch-pan-x">
          {todayTasks?.map((task: ITask) => (
            <div
              key={task.id}
              className="bg-[#5F33E1] p-5 rounded-xl w-full flex-shrink-0 text-white"
            >
              <span className="block font-medium text-lg">{task.title}</span>
              <span className="font-light text-sm">{task.status == "inprogress" ? "Your task is in Progress" : task.status == 'todo' ? "Your task is almost done" : "Your task is not started yet:)"}</span>
            </div>
          ))}
        </div>
      </section>}
      

      <section>
        <div className="flex items-center mt-4"> 
          <h4 className="font-bold text-lg">In Progress</h4> 
          <span className="text-[#5F33E1] bg-[#EEE9FF] text-sm w-5 h-5 flex justify-center items-center rounded-full ml-2">
            {inprogressTasks?.length}
          </span>
        </div>
        <div className="flex gap-2 flex-nowrap overflow-x-auto overflow-y-hidden mt-2 pb-2 scroll-hide touch-pan-x">
          {inprogressTasks?.map((task: ITask) => (
            <div
              key={task.id}
              className="bg-[#E7F3FF] p-4 rounded-xl w-56 flex-shrink-0"
            >
              <span className="text-[#6E6A7C] text-xs block">{task.group_name}</span>
              <span className="block font-medium">{task.title}</span>
              <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white mt-2">
                <div className="h-full w-1/2 bg-[#0087FF] rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center">
          <div className="flex items-center my-4"> 
            <h4 className="font-bold text-lg">Task Groups</h4> 
            <span className="text-[#5F33E1] bg-[#EEE9FF] text-sm w-5 h-5 flex justify-center items-center rounded-full ml-2">
              {taskGroups?.length}
            </span>
          </div> 
          <button className="cursor-pointer" onClick={()=> navigate('/add-task-group')}>
            <Add size="28" color="#5F33E1" />
          </button>
        </div>
      <div className="flex flex-col gap-4">
        {taskGroups?.map((task: ITaskGroup) => (
          <div className="bg-white p-4 rounded-xl shadow">
            <span className="font-medium">{task.title}</span>
            <br></br>
            <span className="text-[#6E6A7C] text-xs">{task.task_count} Tasks</span>
          </div>
        ))}
      </div>
      </section>
    </div>
  );
}
