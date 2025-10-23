import { AuthProvider } from '@/providers';
import { Toaster } from 'react-hot-toast';
import { Outlet } from "react-router";
import BottomNavigation from '../bottom-navigation';

export default function Layout() {
  return (
    <AuthProvider>
      <div className={`bg-[url(/src/assets/img/background.png)] bg-no-repeat bg-cover`}>
        <Toaster />
        <div className='p-4 min-h-[100vh] flex flex-col justify-between'>
          <Outlet />
          <BottomNavigation />
        </div>
      </div>
    </AuthProvider>
  );
}
