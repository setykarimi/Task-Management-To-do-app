import { taskType } from "@/assets/statics";
import Input from "@/components/form/input";
import SelectBox from "@/components/form/select";
import Textarea from "@/components/form/text-area";
import Loading from "@/components/loading";
import PageTitle from "@/components/title";
import type { ITask } from "@/components/types";
import http from "@/lib/axios";
import { useAuth } from "@/providers";
import { TASKS_API } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

type ITaskT = Omit<ITask, "user_id" | "id" | "created_at" >


export const AddTask = () => {
  const { register, handleSubmit, formState: {errors} } = useForm<ITask>();
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const onSubmit: SubmitHandler<ITaskT> = async (data) => {
    if(!user) return 

    const postData = {
      user_id: user.sub,
      title: data.title,
      description: data.description,
      status: data.status,
      group_id: data.group_id,
      end_date: data.end_date,
      start_date: data.start_date,
    }

    onTaskCreate(postData);
  };

  {/* @@@______________ Task create ______________@@@ */}
  const { mutateAsync: onTaskCreate, isPending } = useMutation({
    mutationFn: async (data: ITaskT) => {
      const res = await http.post(TASKS_API.TASKS, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Task successfully added");
      navigate('/dashboard')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error_code);
    },
  });

  {/* @@@______________ Fetch ask group ______________@@@ */}
  const { mutateAsync: fetchTaskGroup, isPending: peindingTaskGroup, data: taskGroups } = useMutation({
    mutationFn: async () => {
      const res = await http.get(TASKS_API.TASK_GROUP);
      return res.data
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
    return <Loading />

  return (
    <div>
      <PageTitle title="Create Task"/>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col justify-center gap-6 mt-6">
          <Input label="Title" name="title" register={register} rules={{ required: true }} type="text" errors={errors} />
          <SelectBox label="Status" name="status" options={taskType} register={register} rules={{ required: true }} errors={errors}/>
          <SelectBox label="Group" name="group_id" options={taskGroups || []} register={register} rules={{ required: true }} errors={errors}/>
          <Input label="Start date" name="start_date" register={register} rules={{ required: true }} type="date" errors={errors} />
          <Input label="End date" name="end_date" register={register} rules={{ required: true }} type="date" errors={errors} />
          <Textarea label="Description" name="description" register={register} />
          <button disabled={isPending} type="submit" className="bg-[#5F33E1] shadow-lg shadow-[#5f33e188] text-white py-3 rounded-2xl font-bold cursor-pointer flex justify-center items-center gap-1 px-2 disabled:bg-gray-500 disabled:shadow disabled:cursor-not-allowed">
            <span className='block m-auto'>Submit</span> 
          </button>
        </div>
      </form>
    </div>
  )
}
