import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "../../styles/social/feedback.module.scss";
import UserContext from "../../contexts/UserContext";
import { io } from 'socket.io-client';
import SocketPath from "../../utilities/socketPath";
import FeedbackPost from "./FeedbackPost";

function Feedback({admins}) {

    const socketRef = useRef(null);

    let {userInfo} = useContext(UserContext);

    let [newPost, setNewPost] = useState("");
    let [postIndex, setPostIndex] = useState({});
    let [error, setError] = useState("");

    const submitNewPost = async () => {
        
        if(!newPost || newPost.length > 5000) {
            return false;
        }

        const response = await fetch('/api/addFeedbackPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: newPost, parent: null }),
        });
        const data = await response.json();
        if (!data.success) {
            console.error(data.message);
        } else {
            setNewPost("");
        }
    }

    const fetchPosts = async () => {

        try {
            const response = await fetch(`/api/getFeedback`);
            const data = await response.json();
            if(!data.success) {
                setError(data.message);    
            } else {
                setPostIndex(JSON.parse(data.posts));
            }
        } catch(err) {
            console.log(err);
            setError("error");    
        }

    }

    const traversePosts = (postsObject, newPost) => {

        for(const postId in postsObject) {
            if(parseInt(postId) === newPost.parent) {
                if(postsObject[postId].replies[newPost.id]) {
                    newPost.replies = postsObject[postId].replies[newPost.id].replies;
                }
                postsObject[postId].replies[newPost.id] = newPost;
                return postsObject;
            }
            const result = traversePosts(postsObject[postId].replies, newPost);
            if (result) {
                for(const resultId in result) {
                    postsObject[postId].replies[resultId] = result[resultId];
                }
                return postsObject;
            }
        }
    }

    const updatePost = (posts, newPost) => {

        if(!newPost.parent) {
            if(posts[newPost.id]) {
                newPost.replies = posts[newPost.id].replies;
            }
            posts[newPost.id] = newPost;
            return posts;
        }

        let newPosts = traversePosts(posts, newPost);
        return newPosts;

    } 

    const collapsePosts = (index) => {

        if(!index) return [];
        let copyIndex = JSON.parse(JSON.stringify(index));
        let posts = [];
        for(let p in copyIndex) {
            let postItem = copyIndex[p];
            postItem.replies = collapsePosts(postItem.replies);
            posts.push(postItem);
        }
        posts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        return posts;

    }
    
    const reconnectSocket = () => {

        if(socketRef.current) return;

        const socketUrl = SocketPath.URL;
        const socketPath = SocketPath.Path;
        let newSocket = io(socketUrl, {
            path: socketPath,
        });

        socketRef.current = newSocket;

        newSocket.on('newFeedback', (data) => {
            setPostIndex(oldPostIndex => {
                if(!oldPostIndex) return {};
                let index = JSON.parse(JSON.stringify(oldPostIndex));
                let newIndex = updatePost(index, JSON.parse(data.newPost));
                return newIndex;
            })
        });

        newSocket.on('feedbackDeleted', (data) => {
            setPostIndex(oldPostIndex => {
                if(!oldPostIndex) return {};
                let index = JSON.parse(JSON.stringify(oldPostIndex));
                let newIndex = updatePost(index, data.post);
                return newIndex;
            });
        });

    }

    useEffect(() => {

        reconnectSocket();
        fetchPosts();

        return () => {
            if(socketRef.current) {
                socketRef.current.disconnect();
            }
        }

    }, []);

    const posts = collapsePosts(postIndex);
    const isAdmin = userInfo ? admins.indexOf(userInfo.username) !== -1 : false;

    return(
        <div className={styles.feedbackOuter}>
            <div className={styles.feedbackHeader}>feedback</div>

            {
                userInfo ? 
                <div className={styles.newPost}>
                    <textarea
                        maxLength={1000}
                        placeholder="Enter comment..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}></textarea>
                    <div
                        onClick={() => submitNewPost()} 
                        className={styles.submitPost}>
                        Submit
                    </div>
                </div> : null
            }

            <div className={styles.postContainer}>

                {
                    error ? 
                    <div className={styles.errorMessage}>
                        an error occurred
                    </div> : null
                }

                {
                    posts.length === 0 && !error ?
                    <div className={styles.noPosts}>
                        no posts yet
                    </div> : null
                }

                {
                    posts.map((post) =>
                        <FeedbackPost 
                            key={post.id} 
                            postInfo={post}
                            isAdmin={isAdmin}/>
                    )
                }

            </div>
        </div>
    )
}
export default Feedback;