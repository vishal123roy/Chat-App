import { Link, useLocation, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuth.js";
import { axiosInstance } from "../lib/axios.js";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector.jsx";
import PageLoader from "./PageLoader.jsx";
import {useThemeStore} from "../store/useThemeStore.js"

const Navbar = () => {
  const { authUser,isInitialized } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const {theme} = useThemeStore();

  const exit = async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      if(response.data.success){
            console.log("logout successful");
            window.location.reload()
      }
    } catch (error) {
      console.log(error);
    }
  };


  if(!isInitialized){
    return <div className="h-screen" data-theme={theme}>
          <PageLoader/>
    </div>
  }

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
          {isChatPage && (
            <div className="pl-5">
              <Link to="/" className="flex items-center gap-2.5">
                <ShipWheelIcon className="size-9 text-primary" />
                <span
                  className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r
                  from-primary to-secondary tracking-wider"
                >
                  Chat-App
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>
          </div>

          <ThemeSelector />
          <div className="avatar">
            <div className="w-9 rounded-full">
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

          <button className="btn btn-ghost btn-circle" onClick={exit}>
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70"/>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
