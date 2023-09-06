import './rightbar.css';
import { Users } from "../../dummyData.js";
import Online from "../online/online";
import { useContext, useEffect, useState } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.js";
import { Add, Remove } from "@mui/icons-material";

const Rightbar = ({ user }) => {

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [friends, setFriends] = useState([]);
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const [followed, setFollowed] = useState(currentUser.followings.includes(user?._id));

    useEffect(() => {
        const getFriends = async () => {
            try {
                const friendList = await axios.get(`/users/friends/${user._id}`);
                setFriends(friendList.data);
            } catch (error) {
                console.log(error);
            }
        };
        getFriends();
    }, [user])

    const handleClick = async (req, res) => {
        try {
            if (followed) {
                await axios.put(`/users/${user._id}/unfollow`, { userId: currentUser._id });
                dispatch({ type: "UNFOLLOW", payload: currentUser._id });
            } else {
                await axios.put(`/users/${user._id}/follow`, { userId: currentUser._id });
                dispatch({ type: "FOLLOW", payload: currentUser._id });
            }
        } catch (error) {
            console.log(error);
        };
        setFollowed(!followed);
    }

    const HomeRightbar = () => {
        return (
            <>
                <div className='birthday-container'>
                    <img src='/assets/gift.png' alt='birthday Pic' className='birthday-img' />
                    <span className='birthday-text'>
                        <b>Pola Foster</b> and <b>3 other friends </b> have a birthday today.
                    </span>
                </div>
                <img className='rightbar-ad' src='/assets/ad.png' alt='ad' />
                <h4 className='rightbar-title'>Online Friends</h4>
                <ul className='rightbar-friend-list'>
                    {Users.map((u) => (
                        <Online key={u.id} user={u} />
                    ))}
                </ul>
            </>
        );
    };

    const ProfileRightBar = () => {
        return (
            <>
                {user.username !== currentUser.username && (
                    <button onClick={handleClick} className='profile-rightbar-follow-button'>
                        {followed ? "Unfollow" : "Follow"}
                        {followed ? <Remove /> : <Add />}
                    </button>
                )}
                <h4 className='profile-rightbar-title'>User Information</h4>
                <div className='rightbar-info'>
                    <div className='rightbar-info-item'>
                        <span className='rightbar-info-key'>City:</span>
                        <span className='rightbar-info-value'>{user.city}</span>
                    </div>
                    <div className='rightbar-info-item'>
                        <span className='rightbar-info-key'>From:</span>
                        <span className='rightbar-info-value'>{user.from}</span>
                    </div>
                    <div className='rightbar-info-item'>
                        <span className='rightbar-info-key'>Relationship:</span>
                        <span className='rightbar-info-value'>{user.relationship === 1 ? "Single" : user.relationship === 2 ? "Married" : "-"}</span>
                    </div>
                </div>
                <h4 className='profile-rightbar-title'>User Friends</h4>
                <div className='rightbar-followings'>
                    {friends.map((friend) => {
                        return <Link className='link' to={`/profile/${friend.username}`}>
                            <div className='rightbar-following'>
                                <img className='rightbar-following-img' src={friend.profilePicture ? PF + friend.profilePicture : `${PF}person/noAvatar.png`} alt='rightbarFollowingImg' />
                                <span className='rightbar-following-name'>{friend.username}</span>
                            </div>
                        </Link>
                    })}
                </div>
            </>
        )
    }

    return (
        <div className='rightbar'>
            <div className='rightbar-wrapper'>
                {user ? <ProfileRightBar /> : <HomeRightbar />}
            </div>
        </div>
    )
}

export default Rightbar;
