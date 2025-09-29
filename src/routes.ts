import { createBrowserRouter } from "react-router";
import App from "./App";

export default createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, Component: App },
      { path: "calender" },
      { path: "add-task" },
      { path: "add-group-task" },
      { path: "my-info" }
    ],
  },
  {
    path: "login",
  },
]);
