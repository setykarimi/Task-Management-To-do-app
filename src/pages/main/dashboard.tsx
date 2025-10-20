import type { ITaskGroup } from "@/components/types";
import http from "@/lib/axios";
import { useAuth } from "@/providers";
import { TASKS_API } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { Notification } from "iconsax-reactjs";
import { useEffect } from "react";
import toast from "react-hot-toast";

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
  const { mutateAsync: fetchTasks, isPending, data: inprogressTasks } = useMutation({
    mutationFn: async () => {
      const res = await http.get(`${TASKS_API.TASKS}?status=eq.todo`);
      return res.data;
    },
    onSuccess: (result) => {
      return result;
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error_code);
    },
  });

  const { mutateAsync: fetchTodayTasks, isPending: isPendingTodayTasks, data: todayTasks } = useMutation({
    mutationFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const url = `${TASKS_API.TASKS}?start_date=lte.${today}&end_date=gte.${today}`;
      
      const res = await http.get(url);
      return res.data;
    },
    onSuccess: (result) => {
      return result;
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error_code || "خطا در دریافت تسک‌های امروز");
    },
  });

  const { mutateAsync: fetchTaskGroup, isPending: peindingTaskGroup, data: taskGroups } = useMutation({
    mutationFn: async () => {
      const res = await http.get(TASKS_API.TASK_GROUP);
      return res.data;
    },
    onSuccess: (result) => {
      return result;
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error_code);
    },
  });

  useEffect(() => {
    fetchTasks();
    fetchTaskGroup();
    fetchTodayTasks()
  }, []);

  if (isPending || peindingTaskGroup || !profile || peindingTaskGroup) return <div>loading</div>;

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
      <section>
      <div className="flex items-center"> 
        <h4 className="font-bold text-lg">In Progress</h4> 
        <span className="text-[#5F33E1] bg-[#EEE9FF] text-sm w-5 h-5 flex justify-center items-center rounded-full ml-2">
          {inprogressTasks.length}
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
        <div className="flex items-center my-4"> 
          <h4 className="font-bold text-lg">Task Groups</h4> 
          <span className="text-[#5F33E1] bg-[#EEE9FF] text-sm w-5 h-5 flex justify-center items-center rounded-full ml-2">
            {taskGroups.length}
          </span>
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
