import Input from "@/components/form/input";
import http from "@/lib/axios";
import { useAuth } from "@/providers";
import { AUTH_API } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

type Inputs = {
  id: string
  name: string;
  avatar_url: string;
};


export const Profile = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const { user, profile } = useAuth()

 const onSubmit: SubmitHandler<Inputs> = async (data) => {
  if (!user) return;

  const postData = new FormData();
  postData.append("id", user.sub);
  postData.append("name", data.name);

  // فایل را اضافه می‌کنیم (اولین فایل انتخاب شده)
  if (data.avatar_url && data.avatar_url[0]) {
    postData.append("avatar_url", data.avatar_url[0]);
  }

  if(!profile)
    onProfileCreate(postData);
  else onProfileUpdate(postData);
};

  const { mutateAsync: onProfileCreate, isPending: createProfilePendign } = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await http.post(AUTH_API.PROFILE, data);
      return res.data;
    },
    onSuccess: (result) => {
      console.log("result", result)
      toast.success("User profile updated");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error_code);
    },
  });

  const { mutateAsync: onProfileUpdate, isPending: profileUpdatePending } = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await http.patch(AUTH_API.PROFILE, data);
      return res.data;
    },
    onSuccess: (result) => {
      console.log("result", result)
      toast.success("User profile updated");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error_code);
    },
  });


  return (
    <div>
      <h1 className="text-center font-bold text-xl">My profile</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col justify-center gap-6 mt-6">
          <Input label="Name" name="name" register={register} rules={{ required: true }} type="text" />
          <Input label="Profile picture" name="avatar_url" register={register} rules={{ required: true }} type="file" />
          <button type="submit" className="bg-[#5F33E1] shadow-lg shadow-[#5f33e188] text-white py-3 rounded-2xl font-bold cursor-pointer flex justify-center items-center gap-1 px-2 disabled:bg-gray-500 disabled:shadow disabled:cursor-not-allowed">
            <span className='block m-auto'>Submit</span> 
          </button>
        </div>
      </form>
    </div>
  );
};
