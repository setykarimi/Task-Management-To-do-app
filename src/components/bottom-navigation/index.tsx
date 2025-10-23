import { Calendar, DocumentText, Home, Profile2User } from "iconsax-reactjs";
import { Link, useLocation } from "react-router";

const navigations = [
  {
    icon: (active?: boolean) => (
      <Home size="24" color="#5F33E1" variant={active ? "Bold" : "Bulk"} />
    ),
    link: "/dashboard",
  },
  {
    icon: (active?: boolean) => (
      <Calendar size="24" color="#5F33E1" variant={active ? "Bold" : "Bulk"} />
    ),
    link: "/calender",
  },
  {
    icon: (active?: boolean) => (
      <Profile2User
        size="24"
        color="#5F33E1"
        variant={active ? "Bold" : "Bulk"}
      />
    ),
    link: "/profile",
  },
  {
    icon: (active?: boolean) => (
      <DocumentText
        size="24"
        color="#5F33E1"
        variant={active ? "Bold" : "Bulk"}
      />
    ),
    link: "/task-group/add",
  },
];

export default function BottomNavigation() {
  const location = useLocation();
  return (
    <div className="fixed bottom-0 bg-[#EEE9FF] left-0 right-0 md:w-[375px] m-auto px-5 py-3 rounded-t-3xl flex justify-between">
      {navigations.map((nav) => {
        const active = location.pathname == nav.link;
        return <Link to={nav.link}>{nav.icon(active)}</Link>;
      })}
    </div>
  );
}
