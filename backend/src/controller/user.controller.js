import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";


export const getRecommendedUsers = async (req,res) => {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;
        
        const recommendedUsers = await User.find({
            $and:[
                {_id:{$ne:currentUserId}},
                {_id:{$nin:currentUser.friends}},
                {isOnboarded:true}
            ]
        })
        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.error("Error in getRecommendedUsers controller",error.message);
        res.status(500).json({message:"internal server error"})
    }
}

export const getMyFriends = async (req,res) => {
        try {
            const user = await User.findById(req.user.id)
            .select("friends")
            .populate("friends","fullName bio profilePic");

            res.status(200).json(user.friends);
        } catch (error) {
            console.error("Error in getMyFriends controller",error.message);
            res.status(500).json("internal server error")
        }
}

export const sendFriendRequest = async (req,res) => {
    try {
        const myId = req.user.id;
        const { id:recipientId} = req.params;

        if(myId === recipientId){
            return res.status(400).json({message: "You cannot send a friend request to yourself."})
        }

        const recipient = await User.findById(recipientId);

        if(!recipient){
            return res.status(400).json({message:"Recipient not found"});
        }

        if(recipient.friends.includes(myId)){
            return res.status(400).json({message:"You are already friends with this user"})
        }

        const exisitingRequest = await FriendRequest.findOne({
            $or:[
                {sender:myId,recipient:recipientId},
                {sender:recipientId,recipient:myId}
            ]
        });
        if(exisitingRequest){
            return res.status(400).json({message:"A friend request already exist between you and this user"})
        }

        const friendRequest = await FriendRequest.create({
            sender:myId,
            recipient:recipientId
        })

       res.status(201).json(friendRequest);

    } catch (error) {
        console.error("Error in sendFriendRequest controller",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export const acceptFriendRequest = async (req,res) => {
    try {
        const {id:requestId} = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if(!friendRequest){
            return res.status(404).json({message:"Friend request not found"});
        }

        //verify the current user is the recipient
        if(friendRequest.recipient.toString() !== req.user.id){
            return res.status(403).json({message:"You are not authorized to accept this request"});
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        //$addToSet :add an element to array only if they do not already exist.
        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet:{friends:friendRequest.recipient}
        })

        await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet:{friends:friendRequest.sender}
        })

        res.status(200).json({message:"Friend request accepted"});

    } catch (error) {
        console.log("Error in acceptFriendRequest controller",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export const getFriendRequests = async (req,res) => {
    try {
        const incomingReqs = await FriendRequest.find({
            recipient:req.user.id,
            status:"pending"
        }).populate("sender","fullName bio profilePic");

        const acceptedReqs = await FriendRequest.find({
            sender:req.user.id,
            status:"accepted"
        }).populate("recipient","fullName bio profilePic")

        res.status(200).json({incomingReqs,acceptedReqs});
    } catch (error) {
        console.log("Error in getFriendRequests controller",error.message);
        res.status(500).json({message:"internal servor errror"});
    }
}

export const getOutgoingFriendReqs = async(req,res) => {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender:req.user.id,
            status:"pending"
        }).populate("recipient","fullName bio profilePic");

        res.status(200).json(outgoingRequests);

    } catch (error) {
        console.log("Error in getOutgoingFriendReqs controller",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}