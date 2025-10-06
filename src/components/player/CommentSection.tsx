import Image from 'next/image'
import { useState } from 'react'

export default function CommentsSection() {
    const [comments, setComments] = useState([
        {
            id: 1,
            user: "moddd",
            avatar: "https://placehold.co/40x40/f87171/ffffff?text=M",
            time: "3 sec ago",
            text: "You're doing the right thing I advise you not to attack the curb so hard",
            likes: 24,
            replies: 2
        }
    ])
    const [newComment, setNewComment] = useState('')

    const handleAddComment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (newComment.trim()) {
            const comment = {
                id: comments.length + 1,
                user: "Mikael",
                avatar: "https://placehold.co/40x40/7c3aed/ffffff?text=M",
                time: "just now",
                text: newComment,
                likes: 0,
                replies: 0
            }
            setComments([comment, ...comments])
            setNewComment('')
        }
    }

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">{comments.length.toLocaleString()} comments</h3>
                <button type="button" className="text-sm font-semibold text-gray-400 hover:text-white flex items-center transition-colors" suppressHydrationWarning={true} >
                    Newest first
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9M3 12h9m-9 4h13m0-4v8m0 0l-4-4m4 4l4-4" />
                    </svg>
                </button>
            </div>

            {/* Add Comment */}
            <form onSubmit={handleAddComment} className="flex items-center gap-4 mb-8">
                <Image unoptimized
                    width={40}
                    height={40}
                    src="https://placehold.co/40x40/7c3aed/ffffff?text=M"
                    alt="Mikael's avatar"
                    className="rounded-full w-10 h-10"
                />
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Enter your comment here"
                    className="bg-transparent border-b border-gray-600 w-full focus:outline-none focus:border-purple-500 py-2 transition-colors"
                    suppressHydrationWarning={true}
                />
                <button
                    type="submit"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Send comment"
                    title="Send comment"
                    suppressHydrationWarning={true}
                >
                    <SendIcon />
                </button>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.map(comment => (
                    <Comment key={comment.id} comment={comment} />
                ))}
            </div>
        </div>
    )
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Comment({ comment }: { comment: any }) {
    const [isLiked, setIsLiked] = useState(false)
    const [showReplies, setShowReplies] = useState(false)

    return (
        <div className="flex items-start gap-4">
            <Image unoptimized
                width={40}
                height={40}
                src={comment.avatar}
                alt={`${comment.user}'s avatar`}
                className="rounded-full w-10 h-10"
            />
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">{comment.user}</p>
                    <p className="text-gray-400 text-sm">{comment.time}</p>
                </div>
                <p className="text-gray-100 mb-2">{comment.text}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <button
                        onClick={() => setIsLiked(!isLiked)}
                        className={`flex items-center space-x-1 hover:text-white transition-colors ${isLiked ? 'text-purple-500' : ''
                            }`}
                        suppressHydrationWarning={true}
                    >
                        <LikeIcon />
                        <span>{comment.likes + (isLiked ? 1 : 0)}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-white transition-colors" suppressHydrationWarning={true} >
                        <ReplyIcon />
                        <span>Reply</span>
                    </button>
                    {comment.replies > 0 && (
                        <button
                            onClick={() => setShowReplies(!showReplies)}
                            className="hover:text-white transition-colors"
                            suppressHydrationWarning={true}
                        >
                            {showReplies ? 'Hide' : 'Show'} {comment.replies} replies
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

function SendIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
    )
}

function LikeIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 18.734V6a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.293a2 2 0 012 2v1z" />
        </svg>
    )
}

function ReplyIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
    )
}