import http from "@/lib/axios";
import { TASKS_API } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function Dashboard() {

  const { mutateAsync: fetchTasks, isPending } = useMutation({
    mutationFn: async () => {
      const res = await http.get(TASKS_API.TASKS);
      return res.data;
    },
    onSuccess: (result) => { 
      return result
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error_code);
    },
  });


  useEffect(()=> {
    fetchTasks()
  },[])

  return <div>Dashboard</div>;
}
