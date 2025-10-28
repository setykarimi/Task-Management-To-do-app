import { colors, icons } from "@/assets/statics";
import Input from "@/components/form/input";
import SelectBox from "@/components/form/select";
import PageTitle from "@/components/title";
import http from "@/lib/axios";
import { TASKS_API } from "@/services/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowRight3, MinusCirlce } from "iconsax-reactjs";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";

type Inputs = {
  title: string;
  description: string;
};

export const EditTaskGroup = () => {
    const { register, handleSubmit, formState: {errors}, reset } = useForm<Inputs>();
    const navigate = useNavigate();
    const {id} = useParams()

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        onEditTaskGroup(data);
    };

    const handleDelete = () =>{
        toast((t) => (
            <span className="text-sm">
                Are you sure?
                <button className="cursor-pointer p-2 rounded-lg ml-2" onClick={() => toast.dismiss(t.id)}>
                    Dismiss
                </button>
                <button className="cursor-pointer bg-red-600 text-white p-2 rounded-lg" onClick={() => onDelete()}>
                    Delete
                </button>
            </span>
        ));
    }

    {/* @@@______________ Edit task group ______________@@@ */}
    const { mutateAsync: onEditTaskGroup, isPending } = useMutation({
        mutationFn: async (data: Inputs) => {
        const res = await http.patch(`${TASKS_API.TASK_GROUP}?id=eq.${id}`, data);
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

    {/* @@@______________ Delete task group ______________@@@ */}
    const { mutateAsync: onDelete, isPending:isPendingDelete } = useMutation({
        mutationFn: async () => {
        const res = await http.delete(`${TASKS_API.TASK_GROUP}?id=eq.${id}`);
        return res.data;
        },
        onSuccess: () => {
            toast.success("Task group successfuly deleted");
            navigate('/dashboard')
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error_code);
        },
    });

    {/* @@@______________ Task group ______________@@@ */}
    const { data: taskGroup } = useQuery({
        queryKey: ["taskGroup"],
        queryFn: async () => {
        const res = await http.get(`${TASKS_API.TASK_GROUP}?id=eq.${id}`);
        return res.data;
        },
    });

    useEffect(() => {
    if (id && taskGroup && taskGroup.length > 0) {
        reset({
        title: taskGroup[0].title,
        description: taskGroup[0].description,
        });
    }
    }, [id, taskGroup, reset]);


    return (
        <div>
           <PageTitle title="Update Project">
                <button className="absolute right-0 cursor-pointer -mt-6" disabled={isPendingDelete} onClick={handleDelete}>
                    <MinusCirlce size="24" color="red" variant="Bulk" />
                </button>
            </PageTitle>
           
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col justify-center gap-6 mt-6">
                    <Input label="Title" name="title" register={register} rules={{ required: true }} type="text" errors={errors}/>
                    <Input label="Description" name="description" register={register} rules={{ required: true }} type="text" errors={errors}/>
                    <SelectBox label="Color" name="color" options={colors} register={register} rules={{ required: true }} errors={errors}/>
                    <SelectBox label="Icon" name="icon_name" options={icons} register={register} showIcon={true} rules={{ required: true }} errors={errors}/>
                    <button disabled={isPending} type="submit" className="bg-[#5F33E1] shadow-lg shadow-[#5f33e188] text-white py-3 rounded-2xl font-bold cursor-pointer flex justify-center items-center gap-1 px-2 disabled:bg-gray-500 disabled:shadow disabled:cursor-not-allowed">
                    <span className='block m-auto'>Update Project</span> 
                    <ArrowRight3 size="20" color="#FFF" variant="Bold"/> 
                    </button>
                </div>
            </form>
        </div> 
    )
}