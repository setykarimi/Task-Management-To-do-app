import Input from "@/components/form/input";
import SelectBox from "@/components/form/select";
import http from "@/lib/axios";
import { useAuth } from "@/providers";
import { TASKS_API } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

type Inputs = {
  user_id: string
  title: string;
  status: string;
  group_id: string;
  end_date: string;
};


export const AddTask = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const { user } = useAuth()
  
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if(!user) return 

    const postData = {
      user_id: user.sub,
      title: data.title,
      status: data.status,
      group_id: data.group_id,
      end_date: data.end_date
    }

    onTaskCreate(postData);
  };

  const { mutateAsync: onTaskCreate, isPending } = useMutation({
    mutationFn: async (data: Inputs) => {
      const res = await http.post(TASKS_API.TASKS, data);
      return res.data;
    },
    onSuccess: (result) => {
      console.log("result", result)
      toast.success("Task successfully added");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error_code);
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

  useEffect(()=>{
    fetchTaskGroup()
  },[])

  if(peindingTaskGroup)
    return <div>loading</div>

  return (
    <div>
      <h1 className="text-center font-bold text-xl">Create Task</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col justify-center gap-6 mt-6">
          <Input label="Title" name="title" register={register} rules={{ required: true }} type="text" />
          <Input label="Name" name="name" register={register} rules={{ required: true }} type="text" />
          <SelectBox label="Status" name="status" options={[{title: "Done", id: "done"}]} register={register} rules={{ required: true }} />
          <SelectBox label="Group" name="group_id" options={taskGroups} register={register} rules={{ required: true }} />
          <Input label="End date" name="end_date" register={register} rules={{ required: true }} type="date" />
          <button disabled={isPending} type="submit" className="bg-[#5F33E1] shadow-lg shadow-[#5f33e188] text-white py-3 rounded-2xl font-bold cursor-pointer flex justify-center items-center gap-1 px-2 disabled:bg-gray-500 disabled:shadow disabled:cursor-not-allowed">
            <span className='block m-auto'>Submit</span> 
          </button>
        </div>
      </form>
    </div>
  )
}
