import { AuthProvider } from '@/providers';
import { Toaster } from 'react-hot-toast';
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <AuthProvider>
      <div className={`bg-[url(/src/assets/img/background.png)] bg-no-repeat bg-cover`}>
        <Toaster />
        <div className='p-4'>
          <Outlet />
        </div>
      </div>
    </AuthProvider>
  );
}
