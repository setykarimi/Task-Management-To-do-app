import http from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";
import person from '@/assets/img/person.svg'
import Input from "@/components/form/input";

type Inputs = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const result = await mutation.mutateAsync(data);
    console.log(result)
  };

  const mutation = useMutation({
    mutationFn: async (data: Inputs) => {
      const res = await http.post("/auth/v1/signup", data);
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Signup success:", data);
    },
    onError: (error:any) => {
      console.error("Signup error:", error?.error_code);
    },
  });

  return (
    <div>
      <img src={person} alt="person" className="mx-auto py-20"/>

      <h2 className="font-bold text-xl text-center leading-6"> Task Management & <br/> To-Do List </h2>
      <p className="text-[#6E6A7C] text-center text-sm leading-4 mt-3">
        This productive tool is designed to help
        <br/>
        you better manage your task 
        <br />
        project-wise conveniently!
      </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-8 flex flex-col justify-center gap-6 mt-6">
            <Input label="Email" name="email" register={register} rules={{ required: true }} type="email" />
            <Input label="Password" name="password" register={register} rules={{ required: true }} type="password" />
            <button type="submit" className="bg-[#5F33E1] shadow-lg shadow-[#5f33e188] text-white py-3 rounded-2xl font-bold">Let’s Start</button>
          </div>
        </form>
    </div>
  );
}
