import './post.css';
import { MoreVert } from "@mui/icons-material";
import { useContext, useEffect, useState } from 'react';
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom"
import { AuthContext } from '../../context/AuthContext';

const Post = ({ post }) => {

    const [like, setLike] = useState(post.likes.length);
    const [isLiked, setIsLiked] = useState(false);
    const [user, setUser] = useState({});
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user: currentUser } = useContext(AuthContext);

    useEffect(() => {
        setIsLiked(post.likes.includes(currentUser._id));
    }, [currentUser._id, post.likes]);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await axios.get(`/users?userId=${post.userId}`);
            setUser(res.data);
        };
        fetchUsers();
    }, [post.userId]);

    const likeHandler = async () => {

        try {
            await axios.put(`/posts/${post._id}/like`, { userId: currentUser._id });
        } catch (error) {
            console.log(error)
        }

        setLike(isLiked ? like - 1 : like + 1);
        setIsLiked(!isLiked);
    };

    return (
        <div className='post'>
            <div className='post-wrapper'>
                <div className='post-top'>
                    <div className='post-top-left'>
                        <Link to={`/profile/${user.username}`}>
                            <img src={user.profilePicture ? PF + user.profilePicture : `${PF}person/noAvatar.png`} className='post-profile-img' alt='PostProfile' />
                        </Link>
                        <span className='post-username'>{user.username}</span>
                        <span className='post-date'>{format(post.createdAt)}</span>
                    </div>
                    <div className='post-top-right'>
                        <MoreVert />
                    </div>
                </div>
                <div className='post-centre'>
                    <span className='post-text'>{post?.desc}</span>
                    <img src={PF + post.img} className='post-img' alt='post' />
                </div>
                <div className='post-bottom'>
                    <div className='post-bottom-left'>
                        <img className='like-icon' src={`${PF}like.png`} alt='like' onClick={likeHandler} />
                        <img className='like-icon' src={`${PF}heart.png`} alt='heart' onClick={likeHandler} />
                        <span className='post-like-counter'>{like} people like it</span>
                    </div>
                    <div className='post-bottom-right'>
                        <span className='post-comment-text'>{post.comment} comments</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post;
