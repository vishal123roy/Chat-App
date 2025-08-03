import { Link } from 'react-router';

const FriendCard = ({friend}) => {
  return (
    <div className='card bg-base-200 hover:shadow-md transition-shadow'>
        <div className='card-body p-4'>

            <div className='flex items-center gap-3 mb-3'>
                <div className='avatar size-12'>
                    <div
                    dangerouslySetInnerHTML={{ __html: friend.profilePic }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className='font-semibold truncate'>{friend.fullName}</h3>
            </div>
            <Link to={`/chat/${friend._id}`} className='btn btn-outline w-full'>
                Message
            </Link>
        </div>
    </div>
  )
}

export default FriendCard;
