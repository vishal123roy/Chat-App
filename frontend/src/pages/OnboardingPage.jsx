import { useEffect, useState } from "react";
import useAuthUser from "../hooks/useAuth.js";
import { CameraIcon, ShuffleIcon,MapPinIcon } from "lucide-react";
import { axiosInstance } from "../lib/axios.js";
import multiavatar from '@multiavatar/multiavatar/esm';
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const OnboardingPage = ({checkAuthUser}) => {
  const { authUser } = useAuthUser();
   const navigate = useNavigate();
  const [formState, setFormState] = useState({
    fullName: "",
    bio: "",
    location: "",
    profilePic: "",
  });

  useEffect(() => {
    if (authUser) {
      setFormState({
        fullName: authUser?.fullName || "",
        bio: authUser?.bio || "",
        location: authUser?.location || "",
        profilePic: authUser?.profilePic || "",
      });
    }
  }, [authUser]);

  const handleRandomAvatar = () => {
    try {
      const randomSeed = Math.random().toString(36).substring(2, 10);
      const randomAvatar = multiavatar(randomSeed);
       setFormState({...formState,profilePic:randomAvatar})

    } catch (error) {}
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/onboarding",formState);

      if(response.data){

        await checkAuthUser();
       
        toast.success("Profile onboarded successfully");
        navigate('/');
      }

    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete Your Profile
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/*profile  pic*/}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: formState.profilePic }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>
  
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="btn btn-accent"
                >
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) =>
                  setFormState({ ...formState, fullName: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) => {
                  setFormState({ ...formState, bio: e.target.value });
                }}
                className="textarea textarea-bordered h-24"
                placeholder="Tell others about yourself"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5
                text-base-content opacity-70"/>
                <input type="text"
                name="location"
                value={formState.location}
                onChange={(e)=> setFormState({...formState,location:e.target.value})}
                className="input input-bordered w-full pl-10"
                placeholder="City, Country"/>
              </div>
            </div>

              <button className="btn btn-primary w-full" type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
