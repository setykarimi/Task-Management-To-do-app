import { Toaster } from 'react-hot-toast';
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className={`bg-[url(/src/assets/img/background.png)] bg-no-repeat bg-cover`}>
      <Toaster />
      <Outlet />
    </div>
  );
}
