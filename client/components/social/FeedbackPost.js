import React, { useContext, useState } from "react";
import { FaReply } from "react-icons/fa";
import { TbLayoutNavbarExpandFilled,TbLayoutBottombarExpandFilled } from "react-icons/tb";
import { FaTrashAlt } from "react-icons/fa";
import { FaShield } from "react-icons/fa6";
import styles from "../../styles/social/feedback.module.scss";
import UserContext from "../../contexts/UserContext";

function FeedbackPost({postInfo, admins}) {

    let {userInfo} = useContext(UserContext);

    let [inputExpanded, setInputExpanded] = useState(false);
    let [repliesExpanded, setRepliesExpanded] = useState(true);

    let [reply, setReply] = useState("");

    const submitReply = async () => {

        if(!reply || reply.length > 5000) {
            return false;
        }

        const response = await fetch('/api/addFeedbackPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: reply, parent: postInfo.id }),
        });
        const data = await response.json();
        if (!data.success) {
            console.error(data.message);
        } else {
            setReply("");
        }

    }

    const deleteReplyAdmin = async () => { 

        const response = await fetch('/api/deleteFeedbackPostAdmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postId: postInfo.id }),
        });
        const data = await response.json();
        if (!data.success) {
            console.error(data.message);
        }
    }

    const getForegroundFromBackground = (color) => {

        const hexColor = color.replace('#', '');
        const r = parseInt(hexColor.substring(0, 2), 16);
        const g = parseInt(hexColor.substring(2, 4), 16);
        const b = parseInt(hexColor.substring(4, 6), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 125 ? '#000000' : '#FFFFFF';

    }

    if(!postInfo) return null;

    const isAdmin = admins.indexOf(userInfo?.username) !== -1;

    return (
        <div className={styles.feedbackPost}>
            <div className={styles.feedbackPostHeader}>
                <div
                    style={{
                        backgroundColor: `${postInfo.color}`,
                        color: `${getForegroundFromBackground(postInfo.color)}`
                    }} 
                    className={styles.user}>{postInfo.username}</div>
                {
                    admins.indexOf(postInfo.username) !== -1 ?
                    <FaShield /> : null
                }
                <div className={styles.timestamp}>{new Date(postInfo.timestamp).toLocaleString()}</div>
            </div>
            <div className={styles.feedbackPostContent}>
                {postInfo.post}
            </div>

            {
                inputExpanded ?
                <div className={styles.replyOuter}>
                    <input 
                        type="text"
                        maxLength="5000" 
                        value={reply}
                        onChange={(e) => setReply(e.target.value)} 
                        placeholder="Reply to User..." />
                    <div
                        onClick={() => submitReply()} 
                        className={styles.submitReply}>Reply</div>
                    <div
                        onClick={() => setInputExpanded(false)} 
                        className={styles.hideReply}>Hide</div>
                </div> : null
            }

            <div className={styles.actionOuter}>
                {
                    !inputExpanded ?
                    <div
                        onClick={() => setInputExpanded(true)} 
                        className={styles.expandInput}>
                        <FaReply/> Reply
                    </div>
                    :
                    null
                }
                {
                    Object.keys(postInfo.replies).length > 1 ?
                    <>
                    {
                        !repliesExpanded ?
                        <div
                            onClick={() => setRepliesExpanded(true)} 
                            className={styles.expandReplies}>
                            <TbLayoutNavbarExpandFilled/> Expand Replies
                        </div>
                        :
                        <div
                            onClick={() => setRepliesExpanded(false)}  
                            className={styles.expandReplies}>
                            <TbLayoutBottombarExpandFilled/> Collapse Replies
                        </div>
                    }
                    </> : null
                }
                {
                    isAdmin && !postInfo.deleted ?
                    <div
                        onClick={() => deleteReplyAdmin()} 
                        className={styles.deleteReply}>
                        <FaTrashAlt/> Delete
                    </div>
                    :
                    null
                }
            </div>
            
            {
                repliesExpanded ?
                postInfo.replies.map((childPost) => 
                    <FeedbackPost 
                        key={childPost.id} 
                        postInfo={childPost} 
                        admins={admins}/>
                ) : null
            }

        </div>
    )

}
export default FeedbackPost;