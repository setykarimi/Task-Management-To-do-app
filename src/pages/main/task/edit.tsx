import Input from "@/components/form/input";
import SelectBox from "@/components/form/select";
import Textarea from "@/components/form/text-area";
import type { ITask } from "@/components/types";
import http from "@/lib/axios";
import { TASKS_API } from "@/services/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MinusCirlce } from "iconsax-reactjs";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";

type ITaskT = Omit<ITask, "user_id">

export const EditTask = () => {
    const { register, handleSubmit, formState: {errors}, reset, control } = useForm<ITask>();
    const navigate = useNavigate()
    const {id} = useParams()

    const onSubmit: SubmitHandler<ITask> = async (data) => {

        const postData = {
            title: data.title,
            description: data.description,
            status: data.status,
            group_id: data.group_id.split("-")[0],
            group_name: data.group_id.split("-")[1],
            end_date: data.end_date,
            start_date: data.start_date,
        }

        onTaskUpdate(postData);
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

    const { mutateAsync: onTaskUpdate, isPending } = useMutation({
        mutationFn: async (data: ITaskT) => {
        const res = await http.patch(`${TASKS_API.TASKS}?id=eq.${id}`, data);
        return res.data;
        },
        onSuccess: () => {
        toast.success("Task successfully Updated");
        navigate('/dashboard')
        },
        onError: (error: any) => {
        toast.error(error?.response?.data?.error_code);
        },
    });

    const { mutateAsync: onDelete, isPending: isPendingDelete } = useMutation({
        mutationFn: async () => {
        const res = await http.delete(`${TASKS_API.TASKS}?id=eq.${id}`);
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

    const { data: task } = useQuery({
        queryKey: ["tasks"],
        queryFn: async () => {
        const res = await http.get(`${TASKS_API.TASKS}?id=eq.${id}`);
        return res.data;
        },
    });

    const { data: taskGroups, isPending: peindingTaskGroup } = useQuery({
        queryKey: ["taskGroups"],
        queryFn: async () => {
        const res = await http.get(TASKS_API.TASK_GROUP);
        return res.data.map((group: any) => ({
                    id: `${group.id}-${group.title}`,
                    title: group.title,
                }));
        },
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (id && task?.length && taskGroups) {
            console.log("here")
            const startDate = task[0].start_date?.split("T")[0]; // فقط YYYY-MM-DD
            const endDate = task[0].end_date?.split("T")[0];

            reset({
                title: task[0].title,
                description: task[0].description,
                status: task[0].status,
                group_id: `${task[0].group_id}-${task[0].group_name}`,
                start_date: startDate,
                end_date: endDate,
            });
        }
    }, [id, task, reset, taskGroups]);


    if(peindingTaskGroup)
        return <div>loading</div>

    if(!isPending && !task?.length)
        return <div>There is no task</div>
    return (
        <div>
            <div className="flex justify-center">
                <h1 className="font-bold text-xl">Update Task</h1>
                <button className="ml-auto cursor-pointer" disabled={isPendingDelete} onClick={handleDelete}>
                    <MinusCirlce size="24" color="red" variant="Bulk" />
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col justify-center gap-6 mt-6">
                <Input label="Title" name="title" register={register} rules={{ required: true }} type="text" errors={errors} />
                <SelectBox defaultValue={control._formValues["status"]} label="Status" name="status" options={[{title: "Done", id: "done"}, { title: "To do", id: 'todo'}, {title: "In progress", id: "inprogress"}]} register={register} rules={{ required: true }} errors={errors} />
                <SelectBox defaultValue={control._formValues["group_id"]} label="Group" name="group_id" options={taskGroups || []} register={register} rules={{ required: true }} errors={errors}/>
                <Input label="Start date" name="start_date" register={register} rules={{ required: true }} type="date" errors={errors} />
                <Input label="End date" name="end_date" register={register} rules={{ required: true }} type="date" errors={errors} />
                <Textarea label="Description" name="description" register={register} />
                <button disabled={isPending} type="submit" className="bg-[#5F33E1] shadow-lg shadow-[#5f33e188] text-white py-3 rounded-2xl font-bold cursor-pointer flex justify-center items-center gap-1 px-2 disabled:bg-gray-500 disabled:shadow disabled:cursor-not-allowed">
                    <span className='block m-auto'>Update Task</span> 
                </button>
                </div>
            </form>
        </div>
    )
}
