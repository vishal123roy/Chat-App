import { useState } from "react";
import { Link,useNavigate } from "react-router";
import {ShipWheelIcon} from "lucide-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


const signupPage = ({onSignupSuccess}) => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

const [isPending,setIsPending] = useState(false);
const [error,setError] = useState(null);
const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

  try {
    const response = await axiosInstance.post('/auth/signup',signupData);
    
    if(response.status){
      toast.success("Account created successfully");
    }
    
    if(onSignupSuccess){
      await onSignupSuccess();
    }
    navigate('/');

  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
    setError(error);
  }finally{
    setIsPending(false);
  }
};
  
  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div
        className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100
      rounded-xl shadow-lg overflow-hidden"
      >
       
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
         {/*LOGO*/}
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span
              className="text-3xl font-bold font-mono bg-clip-text text-transparent
            bg-gradient-to-r from-primary to-secondary tracking-wider"
            >
              Chat-App
            </span>
          </div>

          {error && (<div className="alert alert-error mb-4">
            <span>{error.response.data.message}</span>
          </div>)

          }

        <div className="w-full">
          <form onSubmit={handleSignup}>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Create an Account</h2>
                <p>
                  Join Streamify and start your language learning adventure!
                </p>
              </div>
            
            <div className="space-y-3">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="john doe"
                  className="input input-bordered w-full"
                  value={signupData.fullName}
                  onChange={(e) =>
                    setSignupData({ ...signupData, fullName: e.target.value })
                  }
                  required/>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="johndoe@gmail.com"
                  className="input input-bordered w-full"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({ ...signupData, email: e.target.value })
                  }
                  required/>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="**********"
                  className="input input-bordered w-full"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({ ...signupData, password: e.target.value })
                  }
                  required/>
                  <p className="text-xs opacity-70 mt-1">
                    Password must be at least 6 characters long
                  </p>
              </div>
                
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-2">
                  <input type="checkbox" className="checkbox checkbox-sm" requried/>
                  <span className="text leading-tight">
                    I agree to the{" "}
                    <span className="text-primary hover:underline">terms of service</span> and{" "}
                    <span className="text-primary hover:underline">privacy policy</span>
                  </span>
                </label>
              </div>
              </div>

              <button className="btn btn-primary w-full" type="submit">
                {isPending? (
                  <>
                  <span className="loading loading-spinner loading-xs"></span>
                  loading...
                  </>
                ) : ("Create Account")}
              </button>

              <div className="text-center mt-4">
                <p className="text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                  Sign in
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
        </div>

        <div className="hidden lg:flex w-full lg:w-1/2 bg-pri/10 items-center justify-center">
        <div className="max-w-md p-8">
          <div className="relative aspect-square max-w-sm mx-auto">
            <img src="/VIDEO.png" alt="Language connection illusration" className="w-full h-full"/>
          </div>

          <div className="text-center space-y-3 mt-6">
            <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
            <p className="opacity-70">
              Practice conversations, make friends, and improve your language skills together
            </p>
          </div>
        </div>
        </div>

      </div>
    </div>
  );
};

export default signupPage;
