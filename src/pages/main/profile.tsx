import Input from "@/components/form/input";
import http from "@/lib/axios";
import { useAuth } from "@/providers";
import { PROFILES_API } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

type Inputs = {
  name: string;
  avatar_url: FileList;
};

export const Profile = () => {
  const { user, profile } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Inputs>();
  const navigate = useNavigate()

  const { mutateAsync: onProfileCreate } = useMutation({
    mutationFn: async (data: any) => {
      const res = await http.post(PROFILES_API.PROFILE, data);
      return res.data;
    },
    onSuccess: () => toast.success("Profile created successfully"),
    onError: (error: any) => toast.error(error?.response?.data?.error_code),
  });

  const { mutateAsync: onProfileUpdate } = useMutation({
    mutationFn: async (data: any) => {
      const res = await http.patch(`${PROFILES_API.PROFILE}?id=eq.${user?.sub}`, data);
      return res.data;
    },
    onSuccess: () => toast.success("Profile updated successfully"),
    onError: (error: any) => toast.error(error?.response?.data?.error_code),
  });

  const { mutateAsync: onAddAvatar } = useMutation({
    mutationFn: async ({fileName,file}: {fileName:string, file: any}) => {
      const res = await http.put(`${PROFILES_API.AVATAR}/${fileName}`, file, {
        headers: {
            "Content-Type": file.type
        }
      });
      return res.data;
    },
    onSuccess: () => toast.success("Profile updated successfully"),
    onError: (error: any) => toast.error(error?.response?.data?.error_code),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!user) return;

    let publicUrl = profile?.avatar_url || "";

    const file = data.avatar_url?.[0];

    // @@@______________ Update profile avatar ______________@@@
    if (file) {
      try {
        
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.sub}_${Date.now()}.${fileExt}`;
        onAddAvatar({fileName, file})
        publicUrl = `${SUPABASE_URL}/storage/v1/object/public/avatars/${fileName}`;

      } catch (err: any) {

        console.error("Upload error:", err.response?.data || err.message);
        toast.error("Error while uploading avatar");
        return;

      }
    }

    // @@@______________ Create or Update Profile ______________@@@
    const postData = { id: user.sub, name: data.name, avatar_url: publicUrl };

    if (!profile?.length) {
      await onProfileCreate(postData);
    } else {
      await onProfileUpdate(postData);
    }

    navigate('/dashboard')
  };

  useEffect(()=>{
    if(profile) { reset({ name: profile[0].name })
  }},[profile])

  return (
    <div>
      <h1 className="text-center font-bold text-xl">My profile</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col justify-center gap-6 mt-6">
          <Input label="Name" name="name" register={register} rules={{ required: true }} type="text" errors={errors} />
          <Input label="Profile picture" name="avatar_url" register={register} rules={{ required: false }} type="file" errors={errors} />
          <button
            disabled={false}
            type="submit"
            className="bg-[#5F33E1] shadow-lg shadow-[#5f33e188] text-white py-3 rounded-2xl font-bold cursor-pointer flex justify-center items-center gap-1 px-2 disabled:bg-gray-500"
          >
            <span className='block m-auto'>Submit</span>
          </button>
        </div>
      </form>
    </div>
  );
};
