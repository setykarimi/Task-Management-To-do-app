import Input from "@/components/form/input";
import http from "@/lib/axios";
import { useAuth } from "@/providers";
import { TASKS_API } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight3 } from "iconsax-reactjs";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

type Inputs = {
  title: string;
  description: string;
};

export const AddTaskGroup = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const { user } = useAuth()
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    onLogin(data);
  };

  const { mutateAsync: onLogin, isPending } = useMutation({
    mutationFn: async (data: Inputs) => {
      const res = await http.post(TASKS_API.TASK_GROUP, {user_id: user?.sub ,...data});
      return res.data;
    },
    onSuccess: () => {
      toast.success("Task group successfuly added");
      navigate('/dashboard')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error_code);
    },
  });

  return (
  <div>
     <h1 className="text-center font-bold text-xl">Add Project</h1>
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col justify-center gap-6 mt-6">
            <Input label="Title" name="title" register={register} rules={{ required: true }} type="text" />
            <Input label="Description" name="description" register={register} rules={{ required: true }} type="text" />
            <button disabled={isPending} type="submit" className="bg-[#5F33E1] shadow-lg shadow-[#5f33e188] text-white py-3 rounded-2xl font-bold cursor-pointer flex justify-center items-center gap-1 px-2 disabled:bg-gray-500 disabled:shadow disabled:cursor-not-allowed">
              <span className='block m-auto'>Add Project</span> 
              <ArrowRight3 size="20" color="#FFF" variant="Bold"/> 
            </button>
          </div>
        </form>
      </>
  </div> )
}
