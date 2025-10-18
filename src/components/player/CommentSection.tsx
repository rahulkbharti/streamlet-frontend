import api from '@/apis/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Reply, SendHorizonalIcon, ThumbsUpIcon } from 'lucide-react'
import Image from 'next/image'
import { memo, useState } from 'react'
import { useSelector } from 'react-redux'

type CommentType = {
    _id: string
    userId: string
    videoId: string
    commentText: string
    createdAt: string
    updatedAt: string
    parentCommentId: string | null
    __v: number
    // UI-only fields
    user?: string
    avatar?: string
    time?: string
    likes?: number
    replies?: number
}


const CommentsSectionComponent = ({ videoId }: { videoId: string }) => {
    const queryClient = useQueryClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { isAuthenticated } = useSelector((state: any) => state.auth);
    // console.log('isAuthenticated:', isAuthenticated);
    // Geting the comments 
    const { data: comments = [], isLoading } = useQuery({
        queryKey: ['comments', videoId],
        queryFn: async () => {
            if (!videoId) return [];
            const responce = await api.get(`/videos/comments/${videoId}`);
            return responce.data.comments;
        },
        enabled: Boolean(videoId),
    })
    // Adding Comments
    const { mutate: postComment } = useMutation({
        mutationFn: async (commentText: string) => {

            const _data = await api.post(`/videos/engag/${videoId}`, { action: "comment", commentText });
            return _data.data;
        }, onSuccess: (data) => {
            console.log(data);
            queryClient.invalidateQueries({ queryKey: ["comments", videoId] })
        }, onError: (e) => {
            console.error(e);
        }
    })

    const [newComment, setNewComment] = useState('')
    const handleAddComment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (newComment.trim() && isAuthenticated) {
            postComment(newComment);
            setNewComment('')
        } else {
            alert('You must be logged in to post a comment.');
        }
    }

    if (!videoId) return <div>Loading</div>;

    if (isLoading) {
        return (
            <div className="mt-8">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-6 w-36 bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-28 bg-gray-700 rounded animate-pulse" />
                </div>

                {/* Add Comment Skeleton */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="rounded-full w-10 h-10 bg-gray-700 animate-pulse" />
                    <div className="flex-1 h-8 bg-gray-700 rounded animate-pulse" />
                    <div className="w-8 h-8 bg-gray-700 rounded animate-pulse" />
                </div>

                {/* Comments Skeleton */}
                <div className="space-y-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <div className="rounded-full w-10 h-10 bg-gray-700 animate-pulse" />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
                                    <div className="h-3 w-20 bg-gray-700 rounded animate-pulse" />
                                </div>
                                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2 animate-pulse" />
                                <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // console.log(comments);
    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">{comments.length.toLocaleString()} comments</h3>
                <button type="button" className="text-sm font-semibold text-gray-400 hover:text-white flex items-center transition-colors" suppressHydrationWarning={true} onClick={() => { alert('Implementing Soon') }}>
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
                {comments.map((comment: CommentType) => (
                    <Comment key={comment._id} comment={comment} />
                ))}
            </div>
        </div>
    )
};

const CommentsSection = memo(CommentsSectionComponent);
CommentsSection.displayName = 'CommentsSection';
export default CommentsSection;

function Comment({ comment }: { comment: CommentType }) {
    return (
        <div className="flex items-start gap-4">
            <Image unoptimized
                width={40}
                height={40}
                src={`https://placehold.co/100x100/6366f1/ffffff?text=R`} // Placeholder for user avatar
                alt={`$avatar`}
                className="rounded-full w-10 h-10"
            />
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">{comment.userId ? comment.userId : "Anonymous User"}</p>
                    <p className="text-gray-400 text-sm">{comment.createdAt
                        ? (() => {
                            const diff = Date.now() - new Date(comment.createdAt).getTime();
                            const mins = Math.floor(diff / (1000 * 60));
                            const hours = Math.floor(diff / (1000 * 60 * 60));
                            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                            const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
                            const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
                            if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
                            if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
                            if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
                            if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
                            if (mins > 0) return `${mins} minute${mins > 1 ? 's' : ''} ago`;
                            return 'just now';
                        })()
                        : '2 days ago'}</p>
                </div>
                <p className="text-gray-100 mb-2">{comment.commentText}</p>
                {/* TODO: I will Add later */}
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <button
                        type='button'
                        onClick={() => { alert('Implementing Soon') }}
                        className={`flex items-center space-x-1 hover:text-white transition-colors ${false ? 'text-purple-500' : ''
                            }`}
                        suppressHydrationWarning={true}
                    >
                        <ThumbsUpIcon />
                        <span>{(false ? 1 : 0)}</span>
                    </button>
                    <button type='button' className="flex items-center space-x-1 hover:text-white transition-colors" suppressHydrationWarning={true} onClick={() => { alert('Implementing Soon') }} >
                        <Reply />
                        <span>Reply</span>
                    </button>
                    {/* {comment.replies > 0 && (
                        <button
                            type='button'
                            onClick={() => setShowReplies(!showReplies)}
                            className="hover:text-white transition-colors"
                            suppressHydrationWarning={true}
                        >
                            {showReplies ? 'Hide' : 'Show'} {comment.replies} replies
                        </button>
                    )} */}
                </div>
            </div>
        </div>
    )
}
