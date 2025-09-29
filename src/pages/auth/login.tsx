import { useForm, type SubmitHandler } from "react-hook-form"

type Inputs = {
  email: string
  password: string
}

export default function Login() {
   const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)

  return (
     <form onSubmit={handleSubmit(onSubmit)}>
      <input defaultValue="test" {...register("email")} />

      <input type="password" {...register("password", { required: true })} />

      <button type="submit">Submit</button>
    </form>
  )
}
