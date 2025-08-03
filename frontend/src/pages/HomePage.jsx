import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import { Link } from "react-router";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const [loadingUser, setLoadingUser] = useState(true);
  const [recommendedUser, setRecommendedUser] = useState([]);
  const [friends, setFriends] = useState([]);
  const [outgoingRequest, setOutgoingRequest] = useState([]);

    useEffect(() => {
    getUserFriends();
    getRecommendedUsers();
    getOutgoingFriendReqs();
  }, []);

  const getUserFriends = async () => {
    const response = await axiosInstance.get("/users/friends");
    setFriends(response.data);
  };

  const getRecommendedUsers = async () => {
    const response = await axiosInstance.get("/users");
    if (response.status) {
      setRecommendedUser(response.data);
      setLoadingUser(false);
    }
  };

  const getOutgoingFriendReqs = async () => {
    const response = await axiosInstance.get("/users/outgoing-friend-requests");
    if (response.data) {
      setOutgoingRequest(response.data);
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
        await axiosInstance.post(
        `/users/friend-request/${userId}`
      );
      getOutgoingFriendReqs();
    } catch (error) {
      console.log(error.response.data.message);
    }
  };



  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingRequest && outgoingRequest.length > 0) {
      outgoingRequest.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingRequest]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>
        {friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:texl-3xl font-bold tracking-tight">
                  Meet New friends
                </h2>
                <p className="opacity-70">
                  Discover new friends with your vibe
                </p>
              </div>
            </div>
          </div>
          {loadingUser ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUser.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">
                No recommendations available
              </h3>
              <p className="text-base-content opacity-70">
                Check back later for new friends!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUser.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: user.profilePic,
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="badge badge-outline">
                            {user.bio}
                            </span>  
                        </div>
                      <button
                        className={`btn w-full mt-2 ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        }`}
                        onClick={() => sendFriendRequest(user._id)}
                        disabled={hasRequestBeenSent}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
