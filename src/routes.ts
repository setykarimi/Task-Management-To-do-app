import Layout from "@/components/layout";
import { AddGroupTask, AddTask, Calender, Home, MyInfo } from "@/pages";
import { createBrowserRouter } from "react-router";
import Login from "./pages/auth/login";
import Dashboard from "./pages/main/dashboard";
import NotFound from "./pages/main/not-found";

export default createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Login },

      { index: false, Component: Home },
      { path: "dashboard", Component: Dashboard },
      { path: "calender", Component: Calender },
      { path: "add-task", Component: AddTask },
      { path: "add-group-task", Component: AddGroupTask },
      { path: "my-info", Component: MyInfo },
      { path: "*", Component: NotFound },
    ],
  },
]);
