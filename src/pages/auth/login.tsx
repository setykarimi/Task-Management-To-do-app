import http from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <input defaultValue="test" {...register("email")} />

      <input type="password" {...register("password", { required: true })} />

      <button type="submit">Submit</button>
    </form>
  );
}
