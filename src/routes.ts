import Layout from "@/components/layout";
import { AddGroupTask, AddTask, Calender,  MyInfo } from "@/pages";
import { createBrowserRouter } from "react-router";
import Login from "./pages/auth/login";
import Dashboard from "./pages/main/dashboard";
import NotFound from "./pages/main/not-found";
import Signup from "./pages/auth/signup";
import AuthLayout from "./pages/auth/layout";

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
      { path: "add-group-task", Component: AddGroupTask },
      { path: "my-info", Component: MyInfo },
      { path: "*", Component: NotFound },
    ],
  },
]);
