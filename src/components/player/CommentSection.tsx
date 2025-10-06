import { Reply, SendHorizonalIcon, ThumbsUpIcon } from 'lucide-react'
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
                    <SendHorizonalIcon />
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
                        type='button'
                        onClick={() => setIsLiked(!isLiked)}
                        className={`flex items-center space-x-1 hover:text-white transition-colors ${isLiked ? 'text-purple-500' : ''
                            }`}
                        suppressHydrationWarning={true}
                    >
                        <ThumbsUpIcon />
                        <span>{comment.likes + (isLiked ? 1 : 0)}</span>
                    </button>
                    <button type='button' className="flex items-center space-x-1 hover:text-white transition-colors" suppressHydrationWarning={true} >
                        <Reply />
                        <span>Reply</span>
                    </button>
                    {comment.replies > 0 && (
                        <button
                            type='button'
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
