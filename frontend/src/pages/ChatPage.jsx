import { useEffect, useState } from 'react';
import { axiosInstance } from '../lib/axios';
import { useParams } from 'react-router';
import useAuth from '../hooks/useAuth';
import PageLoader from '../components/PageLoader';
import CallButton from '../components/CallButton';

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window
} from "stream-chat-react";

import { StreamChat } from 'stream-chat';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;


const ChatPage = () => {
  const {id:targetUserId} = useParams();
  const [tokenData,setTokenData] = useState(null);
  const [chatClient,setChatClient] = useState(null);
  const [channel,setChannel] = useState(null);

  const {authUser} = useAuth();
  
  const getStreamToken = async() => {
    const response = await axiosInstance.get("/chat/token");
    setTokenData(response.data);
  }

  useEffect(()=>{
    getStreamToken();
  },[])

  useEffect(()=>{

    const initChat = async () => {
      if(!tokenData?.token||!authUser) return;
     
      try {
        console.log("Initializing stream chat client...")
        const client = StreamChat.getInstance(STREAM_API_KEY);

        
         const getAvatarUrl = (name) => {
        const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2);
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=bcf700&color=000&size=128&font-size=0.5`;
      };

      const avatarUrl = getAvatarUrl(authUser.fullName);

            await client.connectUser({
              id:authUser._id,
              name:authUser.fullName,
              image:authUser.avatarUrl
            },tokenData.token)
            
            const channelId = [authUser._id,targetUserId].sort().join("-");

            const currChannel = client.channel("messaging",channelId,{
              members:[authUser._id,targetUserId],
            })
            await currChannel.watch();

            setChatClient(client);
            setChannel(currChannel);
      } catch (error) {
        
      }
    }

    initChat();
  },[tokenData,authUser,targetUserId]);

    useEffect(() => {
    return () => {
      const cleanup = async () => {
        try {
          if (channel) {
            console.log("Stopping channel watch...");
            await channel.stopWatching();
          }
          
          if (chatClient) {
            console.log("Disconnecting chat client...");
            await chatClient.disconnectUser();
          }
        } catch (error) {
          console.error("Error during cleanup:", error);
        }
      };

      cleanup();
    };
  }, [chatClient, channel]);


  const handleVideoCall = () => {
          if(channel){
            const callUrl = `${window.location.origin}/call/${channel.id}`;

            channel.sendMessage({
              text:`I've started a video call. Join me here:${callUrl}`
            })
          }
  }

  return (
    <div className='h-[93vh]'>
      {chatClient && channel ? (
  <Chat client={chatClient} >
    <Channel channel={channel}>
      <div className='w-full relative'>
        <CallButton handleVideoCall={handleVideoCall} />
      <Window>
        <ChannelHeader />
        <MessageList />
        <MessageInput />
      </Window>
      </div>
    </Channel>
  </Chat>
) : (
  <div>
    <PageLoader/>
  </div>
)}
    </div>
  )
}

export default ChatPage;
