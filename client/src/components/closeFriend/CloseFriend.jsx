import "./closeFriend.css";

const CloseFriend = ({ user }) => {

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    return (
        <li className='sidebar-friend'>
            <img className='sidebar-friend-img' src={PF + user.profilePicture} alt='FriendPic' />
            <span className='sidebar-friend-name'>{user.username}</span>
        </li>
    );
};

export default CloseFriend;
