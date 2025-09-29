import { createBrowserRouter } from "react-router";
import { AddGroupTask, AddTask, Calender, Home, MyInfo } from "@/pages";


export default createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, Component: Home },
      { path: "calender", Component: Calender },
      { path: "add-task", Component: AddTask },
      { path: "add-group-task" , Component: AddGroupTask},
      { path: "my-info", Component: MyInfo }
    ],
  },
  {
    path: "login",
  },
]);
