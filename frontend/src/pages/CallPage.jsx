import { useNavigate, useParams } from "react-router"
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import PageLoader from "../components/PageLoader.jsx"
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks
} from "@stream-io/video-react-sdk";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const callPage = () => {

const {id:callId} = useParams();

const [streamToken,setStreamToken] = useState(null);
const [client,setClient] = useState(null);
const [call,setCall] = useState(null);
const [isConnecting,setIsConnecting] = useState(true);

const { authUser,isLoading } = useAuth();

const getStreamToken = async () => {
  try {
    const response = await axiosInstance.get("/chat/token")
    setStreamToken(response.data)
  } catch (error) {
    console.error("Error getting stream token:",error);
  }
};

useEffect(()=>{
    getStreamToken();
},[]);


useEffect(() => {
    const initCall = async () => {

      if(!streamToken?.token || !authUser || !callId) return;

      try {
        console.log("Initializing Stream video client...");

        const user = {
          id:authUser._id,
          name:authUser.fullName,
        };

        const videoClient = StreamVideoClient.getOrCreateInstance({
          apiKey:STREAM_API_KEY,
          user,
          token:streamToken.token
        })

        const callInstance = videoClient.call("default",callId);
        await callInstance.join({create:true})

        setClient(videoClient);
        setCall(callInstance);

      } catch (error) {
        console.error("Error joining call:",error);
      }finally{
        setIsConnecting(false);
      }
    }
    initCall();
},[streamToken,authUser,callId]);

useEffect(() => {
    return () => {
      if(call){
        call.leave();
      }
    };
},[call]);

  if(isLoading || isConnecting) return <PageLoader/>;

  return (
    <div className="h-screen flex flex-col items-center justify-center">
        <div className="relative">
          {
            client &&  call ?(
              <StreamVideo client={client}>
                <StreamCall call={call}>
                  <CallContent/>
                </StreamCall>
              </StreamVideo>
            ):(
              <div className="flex items-center justify-center h-full">
                <p>Could not intialize call. Please refresh or try again later.</p>
              </div>
            )
          }
        </div>
    </div>
  )
}

const CallContent = () => {

  const {useCallCallingState} = useCallStateHooks()
  const callingState = useCallCallingState()

  if(callingState === CallingState.LEFT) return window.close();

  return(
      <StreamTheme>
        <SpeakerLayout/>
        <CallControls/>
      </StreamTheme>
  )
}

export default callPage;
