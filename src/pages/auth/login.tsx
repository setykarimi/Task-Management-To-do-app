import Input from "@/components/form/input";
import http from "@/lib/axios";
import { AUTH_API } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight3 } from "iconsax-reactjs";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from 'react-router';

type Inputs = {
  email: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit, formState: {errors} } = useForm<Inputs>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    onLogin(data);
  };

  const { mutateAsync: onLogin, isPending } = useMutation({
    mutationFn: async (data: Inputs) => {
      const res = await http.post(AUTH_API.LOIGN, data);
      return res.data;
    },
    onSuccess: (result) => {
      if (result?.access_token) {
        localStorage.setItem("access_token", result.access_token);
        http.defaults.headers.common.Authorization = `Bearer ${result.access_token}`;
      }
      if (result?.refresh_token) {
        localStorage.setItem("refresh_token", result.refresh_token);
      }
      toast.success("Welcome");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error_code);
    },
  });


  return (
    <div className="pb-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col justify-center gap-6 mt-6">
          <Input errors={errors} label="Email" name="email" register={register} rules={{ required: true }} type="email" />
          <Input errors={errors} label="Password" name="password" register={register} rules={{ required: true }} type="password" />
          <button disabled={isPending} type="submit" className="bg-[#5F33E1] shadow-lg shadow-[#5f33e188] text-white py-3 rounded-2xl font-bold cursor-pointer flex justify-center items-center gap-1 px-2 disabled:bg-gray-500 disabled:shadow disabled:cursor-not-allowed">
            <span className='block m-auto'>Login</span> 
            <ArrowRight3 size="20" color="#FFF" variant="Bold"/> 
          </button>
        </div>
      </form>
      <Link to='/signup'>
          <span className='text-center block text-xs mt-2 text-[#5F33E1]'>Don't have an account?</span>
      </Link>
    </div>
  );
}
