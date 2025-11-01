import Input from "@/components/form/input";
import http from "@/lib/axios";
import { AUTH_API } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight3 } from "iconsax-reactjs";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from 'react-router';

type Inputs = {
  email: string;
  password: string;
};

export default function Signup() {
  const { register, handleSubmit, formState: {errors} } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    onSignup(data);
  };

  const { mutateAsync: onSignup, isPending } = useMutation({
    mutationFn: async (data: Inputs) => {
      const res = await http.post(AUTH_API.SIGNUP, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Confirmation Send Check your email please");
      window.location.href = "https://to-do-app-gamma-sepia-49.vercel.app/dashboard";

    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error_code);
    },
  });


  return (
    <div className="pb-20">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col justify-center gap-6 mt-6">
          <Input errors={errors} label="Email" name="email" register={register} rules={{ required: true }} type="email" />
          <Input errors={errors} label="Password" name="password" register={register} rules={{ required: true }} type="password" />
          <button disabled={isPending} type="submit" className="bg-[#5F33E1] shadow-lg shadow-[#5f33e188] text-white py-3 rounded-2xl font-bold cursor-pointer flex justify-center items-center gap-1 px-2 disabled:bg-gray-500 disabled:shadow disabled:cursor-not-allowed">
            <span className='block m-auto'>Signup</span> 
            <ArrowRight3 size="20" color="#FFF" variant="Bold"/> 
          </button>
        </div>
      </form>
      <Link to='/'>
          <span className='text-center block text-xs mt-2 text-[#5F33E1]'>Already have an account?</span>
      </Link>
    </div>
  );
}
