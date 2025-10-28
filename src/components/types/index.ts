export interface ITask {
  user_id: string;
  title: string;
  status: string;
  group_id: string;
  end_date: string;
  start_date: string;
  description: string;
  created_at: Date | string;
  id: number;
  task_groups?: ITaskGroup
}

export interface ITaskGroup {
  id: number;
  created_at: string;
  title: string;
  description: string;
  user_id: string;
  task_count: number;
  color:string;
  icon_name:string
}
