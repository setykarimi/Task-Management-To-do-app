import person from "@/assets/img/person.svg";
import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <>
      <div>
        <img src={person} alt="person" className="mx-auto" />
      </div>
      <div>
        <h2 className="font-bold text-xl text-center leading-6">
          Task Management & <br /> To-Do List
        </h2>

        <p className="text-[#6E6A7C] text-center text-sm leading-4 mt-3">
          This productive tool is designed to help
          <br />
          you better manage your task
          <br />
          project-wise conveniently!
        </p>

        <Outlet />
      </div>
    </>
  );
}
