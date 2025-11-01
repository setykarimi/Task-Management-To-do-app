import Input from "@/components/form/input";
import PageTitle from "@/components/title";
import { useAuth } from "@/providers";
import http from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { PROFILES_API } from "@/services/api";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

type Inputs = {
  display_name: string;
  avatar_url: FileList;
};

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<Inputs>();

  // ---------- Upload Avatar Mutation ----------
  const { mutateAsync: uploadAvatar } = useMutation({
    mutationFn: async ({ fileName, file }: { fileName: string; file: any }) => {
      // اضافه کردن upsert=true برای overwrite
      const res = await http.put(
        `${PROFILES_API.AVATAR}/${fileName}?upsert=true`,
        file,
        { headers: { "Content-Type": file.type } }
      );
      return res.data;
    },
    onError: (error: any) => toast.error(error?.response?.data?.error_code || "Error uploading avatar"),
  });

  // ---------- Update User Metadata ----------
  const { mutateAsync: updateUserHandler } = useMutation({
    mutationFn: async (metadata: { display_name: string; avatar_url?: string }) => {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No user token found");

      const res = await http.put(
        `${PROFILES_API.PROFILE}`,
        { data: metadata },
      );
      return res.data;
    },
    onSuccess: () => toast.success("Profile updated successfully"),
    onError: (err: any) => toast.error(err?.response?.data?.error_code || "Error updating profile"),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!user) return;

    let avatarUrl: string | undefined;
    const file = data.avatar_url?.[0];

    if (file) {
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}.${fileExt}`; // override
        await uploadAvatar({ fileName, file });
        avatarUrl = `${SUPABASE_URL}/storage/v1/object/public/avatars/${fileName}`;
      } catch (err: any) {
        console.error("Upload error:", err.response?.data || err.message);
        toast.error("Error while uploading avatar");
        return;
      }
    }

    await updateUserHandler({
      display_name: data.display_name,
      ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
    });

    const newUser = {
      ...user,
      user_metadata: {
        ...user.user_metadata,
        display_name: data.display_name,
        avatar_url: avatarUrl
      }
    };
    updateUser(newUser);

    navigate("/dashboard");
  };

  useEffect(() => {
    if (user) {
      reset({
        display_name: user.user_metadata?.display_name || "",
      });
    }
  }, [user]);

  return (
    <div>
      <PageTitle title="My profile" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col justify-center gap-6 mt-6">
          <Input
            label="Display Name"
            name="display_name"
            register={register}
            rules={{ required: true }}
            type="text"
            errors={errors}
          />
          <Input
            label="Profile Picture"
            name="avatar_url"
            register={register}
            rules={{ required: true }}
            type="file"
            errors={errors}
          />
          <button
            type="submit"
            className="bg-[#5F33E1] shadow-lg shadow-[#5f33e188] text-white py-3 rounded-2xl font-bold cursor-pointer flex justify-center items-center gap-1 px-2 disabled:bg-gray-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
