import { createBrowserRouter } from "react-router";
import { AddGroupTask, AddTask, Calender, Home, MyInfo } from "@/pages";
import NotFound from "./pages/main/not-found";
import Login from "./pages/auth/login";
import Layout from "@/components/layout";


export default createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "calender", Component: Calender },
      { path: "add-task", Component: AddTask },
      { path: "add-group-task" , Component: AddGroupTask},
      { path: "my-info", Component: MyInfo },
      { path: "login", Component: Login },
      { path: "*", Component: NotFound }
    ],
  },
 
]);

