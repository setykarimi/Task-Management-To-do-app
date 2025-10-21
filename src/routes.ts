import Layout from "@/components/layout";
import { AddTask, AddTaskGroup, Calender, EditTask, EditTaskGroup, Profile } from "@/pages";
import { createBrowserRouter } from "react-router";
import AuthLayout from "./pages/auth/layout";
import Signup from "./pages/auth/signup";
import Dashboard from "./pages/main/dashboard";
import NotFound from "./pages/main/not-found";
import Login from "./pages/auth/login";

export default createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        path: '',
        Component: AuthLayout,
        children: [
          { index: true, Component: Login },
          { path: "signup", Component: Signup },
        ]
      },
     

      { path: "dashboard", Component: Dashboard },
      { path: "calender", Component: Calender },
      { path: "task", 
        children:[
          {path: 'add' , Component: AddTask},
          {path: 'edit/:id' , Component: EditTask}
        ] },
      { path: "task-group",
        children: [
          { path: 'add', Component: AddTaskGroup },
          { path: 'edit/:id', Component: EditTaskGroup },
        ]
      },
      { path: "profile", Component: Profile },
      { path: "*", Component: NotFound },
    ],
  },
]);
