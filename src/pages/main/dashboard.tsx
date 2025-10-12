import http from "@/lib/axios";
import { TASKS_API } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";

interface ITask {
  created_at: string
  description: null | string;
  end_date: string
  group_id: number
  id: number
  start_date: string
  status: string
  title: string
  user_id: string
}

export default function Dashboard() {
  const {
    mutateAsync: fetchTasks,
    isPending,
    data,
  } = useMutation({
    mutationFn: async () => {
      const res = await http.get(TASKS_API.TASKS);
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
  }, []);

  if (isPending) return <div>loading</div>;


  return <div>
    {data?.map((task:ITask)=> <div>{task.title}</div>)}
    </div>;
}
