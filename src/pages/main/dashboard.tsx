import type { ITask, ITaskGroup } from "@/components/types";
import http from "@/lib/axios";
import { useAuth } from "@/providers";
import { TASKS_API } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Add, Notification, Logout } from "iconsax-reactjs";
import { Link, useNavigate } from "react-router";
import * as Iconsax from "iconsax-reactjs";
import { useState, type FC } from "react";
import Loading from "@/components/status/loading";
import ErrorStatus from "@/components/status/error";
import EmptyState from "@/components/status/empty-state";

export default function Dashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  {/* @@@______________ In progress tasks ______________@@@ */}
  const { data: inprogressTasks, isLoading, isError: isErrorInprogress } = useQuery({
    queryKey: ["tasks", "inprogress"], 
    queryFn: async () => {
      const res = await http.get(`${TASKS_API.TASKS}?status=eq.inprogress&select=*,task_groups(title,color,icon_name)`);
      return res.data;
    },
    staleTime: 1000 * 60 * 5, 
  });

  {/* @@@______________ Today tasks ______________@@@ */}
  const { data: todayTasks, isLoading: isPendingTodayTasks, isError: isErrorTodayTasks } = useQuery({
    queryKey: ["tasks", "today"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const url = `${TASKS_API.TASKS}?start_date=lte.${today}&end_date=gte.${today}`;
      const res = await http.get(url);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  {/* @@@______________ Task groups ______________@@@ */}
  const { data: taskGroups, isLoading: pendingTaskGroup, isError: isErrorTaskGroup } = useQuery({
    queryKey: ["taskGroups"],
    queryFn: async () => {
      const res = await http.get(TASKS_API.TASK_GROUP);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // if(!user) navigate("/profile")

  if (isLoading || pendingTaskGroup || isPendingTodayTasks) return <Loading />;

  if (isErrorInprogress || isErrorTaskGroup || isErrorTodayTasks) return <ErrorStatus error="Error while geting data"/>


  const toggleDropdown = () => setShowProfileDropdown(prev => !prev);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <header>
        {/* @@@______________ Profile ______________@@@ */}
        <div className="flex items-center mb-4 relative">
          {user?.user_metadata?.avatar_url && (
            <img 
              src={user?.user_metadata?.avatar_url} 
              alt="avatar" 
              className="w-10 h-10 rounded-full mr-2 shadow cursor-pointer" 
              onClick={toggleDropdown}
            />
          )}
          <div>
            <span className="text-sm">Hello!</span>
            <h3 className="text-lg font-bold">{user?.user_metadata?.display_name}</h3>
          </div>
          <Notification className="ml-auto" size="21" variant="Bold" />

          {/* Dropdown */}
          {showProfileDropdown && (
            <div className="absolute top-12 left-0 bg-white shadow-lg rounded-lg w-40 p-2 z-50">
              <button 
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded-lg text-gray-700"
                onClick={handleLogout}
              >
                <Logout size="18" variant="Bold" /> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {(!taskGroups.length || !todayTasks.length || !inprogressTasks.length) ? <EmptyState status="Add your first task"/>
      :  
      <>
        {/* @@@______________ Today tasks ______________@@@ */}
        {todayTasks && <section>
          <div className="flex gap-2 flex-nowrap overflow-x-auto overflow-y-hidden mt-2 pb-2 scroll-hide touch-pan-x">
            {todayTasks?.map((task: ITask) => (
              <div
                key={task.id}
                className="bg-[#5F33E1] p-5 rounded-xl w-full flex-shrink-0 text-white"
              >
                <span className="block font-medium text-lg">{task.title}</span>
                <span className="font-light text-xs">{task.status == "inprogress" ? "Your task is in Progress" : task.status == 'done' ? "Your task is almost done" : "Your task is not started yet:)"}</span>
                <Link to={`/task/edit/${task.id}`} className="block bg-[#EEE9FF] text-[#5F33E1] w-fit px-2 py-1.5 rounded-md mt-4 text-sm">View Task</Link>            
              </div>
            ))}
          </div>
        </section>}
        
        {/* @@@______________ In progress tasks ______________@@@ */}
        <section>
          <div className="flex items-center mt-4"> 
            <h4 className="font-bold text-lg">In Progress</h4> 
            <span className="text-[#5F33E1] bg-[#EEE9FF] text-sm w-5 h-5 flex justify-center items-center rounded-full ml-2">
              {inprogressTasks?.length}
            </span>
          </div>
          <div className="flex gap-2 flex-nowrap overflow-x-auto overflow-y-hidden mt-2 pb-2 scroll-hide touch-pan-x">
            {inprogressTasks?.map((task: ITask) => {
              const IconComponent = Iconsax[task.task_groups?.icon_name as keyof typeof Iconsax] as FC<{ size?: string | number, color:string, variant: string }>;
              const color = task.task_groups?.color.split("|");             
              return (
                <div
                  key={task.id}
                  onClick={()=> navigate(`/task/edit/${task.id}`)}
                  className="bg-[#E7F3FF] p-4 rounded-xl w-56 flex-shrink-0 cursor-pointer"
                >
                  <div className="flex justify-between">
                    <span className="text-[#6E6A7C] text-xs block">{task.task_groups?.title}</span>
                    <span style={{background: color ? color[1] : "#FFF"}} className="w-6 h-6 rounded-full flex justify-center items-center">
                      <IconComponent variant="Bold" size={16} color={color ? color[0] : ""} />
                    </span>
                  </div>
                  <span className="block font-medium">{task.title}</span>
                  <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white mt-2">
                    <div className="h-full w-1/2 bg-[#0087FF] rounded-full"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* @@@______________ Task groups ______________@@@ */}
        <section>
          <div className="flex justify-between items-center">
            <div className="flex items-center my-4"> 
              <h4 className="font-bold text-lg">Task Groups</h4> 
              <span className="text-[#5F33E1] bg-[#EEE9FF] text-sm w-5 h-5 flex justify-center items-center rounded-full ml-2">
                {taskGroups?.length}
              </span>
            </div> 
            <button className="cursor-pointer" onClick={()=> navigate('/task-group/add')}>
              <Add size="28" color="#5F33E1" />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {taskGroups?.map((group: ITaskGroup) => {
              const IconComponent = Iconsax[group.icon_name as keyof typeof Iconsax] as FC<{ size?: string | number, color:string, variant: string }>;
              const color = group.color.split("|"); 
              return (
                <div className="bg-white p-4 rounded-xl shadow-lg shadow-gray-100 cursor-pointer flex items-center gap-2" onClick={()=> navigate(`/task-group/edit/${group.id}`)}>
                  <span style={{background: color ? color[1] : "#FFF"}} className="w-6 h-6 rounded-full flex justify-center items-center">
                    <IconComponent variant="Bold" size={16} color={color ? color[0] : ""} />
                  </span>
                  <div>
                    <span className="font-medium">{group.title}</span>
                    <br/>
                    <span className="text-[#6E6A7C] text-xs">{group.task_count} Tasks</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </>
      }
    </div>
  );
}
