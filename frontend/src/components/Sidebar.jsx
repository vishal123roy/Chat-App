import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuth.js";
import PageLoader from "../components/PageLoader.jsx";
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon,CameraIcon } from "lucide-react";

const Sidebar = () => {
  const { authUser,isInitialized } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  
  
  if (!isInitialized) {
    return <div className='h-screen' data-theme='night'>
      {/* <PageLoader/> */}
    </div>;
  }

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-base-300">
        <Link to="/" className="flex items-center gap-2.5">
          <ShipWheelIcon className="size-9 text-primary"/>
          <span
            className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r
                from-primary to-secondary tracking-wider">
            Chat-App
          </span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
          <Link to="/" className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
              currentPath === "/" ? "btn-active" : ""
          }`}>
            <HomeIcon className="size-5 text-base-content opacity-70"/>
            <span>Home</span>
          </Link>

          <Link to="/friends" className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
              currentPath === "/friends" ? "btn-active" : ""
          }`}>
            <UsersIcon className="size-5 text-base-content opacity-70"/>
            <span>Friends</span>
          </Link>

           <Link to="/notifications" className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
              currentPath === "/notifications" ? "btn-active" : ""
          }`}>
            <BellIcon className="size-5 text-base-content opacity-70"/>
            <span>Notifications</span>
          </Link>
      </nav>
      <div className="p-4 border-t border-base-300 mt-auto">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
                   {authUser.profilePic ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: authUser.profilePic }}
    
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
            </div>
          </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{authUser?.fullName}</p>
              <p className="text-xs text-success flex items-center gap-1">
                <span className="size-2 rounded-full bg-success inline-block"/>
                Online
              </p>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
