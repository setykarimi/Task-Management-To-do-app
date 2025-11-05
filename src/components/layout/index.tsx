import { AuthProvider } from '@/providers';
import { Toaster } from 'react-hot-toast';
import { Outlet, useLocation } from "react-router";
import BottomNavigation from '../bottom-navigation';

export default function Layout() {
  const location = useLocation()
  const showNavbar = location.pathname == "/" || location.pathname == "/signup"
  return (
    <AuthProvider>
      <div className={`bg-[url(/src/assets/img/background.png)] bg-no-repeat bg-cover`}>
        <Toaster />
        <div className='md:p-4 p-6 min-h-[100vh] flex flex-col justify-between'>
          <Outlet />
          {!showNavbar && <BottomNavigation />}
        </div>
      </div>
    </AuthProvider>
  );
}
