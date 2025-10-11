import Layout from "@/components/layout";
import { AddTask, AddTaskGroup, Calender, Profile } from "@/pages";
import { createBrowserRouter } from "react-router";
import AuthLayout from "./pages/auth/layout";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import Dashboard from "./pages/main/dashboard";
import NotFound from "./pages/main/not-found";

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
      { path: "add-task", Component: AddTask },
      { path: "add-task-group", Component: AddTaskGroup },
      { path: "profile", Component: Profile },
      { path: "*", Component: NotFound },
    ],
  },
]);
