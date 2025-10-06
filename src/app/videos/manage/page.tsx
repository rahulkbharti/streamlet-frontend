'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function ManageVideos() {
    const [videos, setVideos] = useState([
        {
            id: 1,
            title: 'Epic Battle Royale Session',
            thumbnail: 'https://placehold.co/320x180/3b82f6/ffffff?text=Battle+Royale',
            views: '2.1K',
            likes: 156,
            comments: 23,
            duration: '3:45:12',
            status: 'published',
            uploadDate: '2024-01-15',
            visibility: 'public'
        },
        {
            id: 2,
            title: 'RPG Adventure Part 5 - Final Boss',
            thumbnail: 'https://placehold.co/320x180/10b981/ffffff?text=RPG+Adventure',
            views: '1.8K',
            likes: 89,
            comments: 15,
            duration: '2:30:45',
            status: 'published',
            uploadDate: '2024-01-14',
            visibility: 'public'
        },
        {
            id: 3,
            title: 'FPS Tournament Live',
            thumbnail: 'https://placehold.co/320x180/ef4444/ffffff?text=FPS+Tournament',
            views: '3.4K',
            likes: 234,
            comments: 45,
            duration: '4:15:30',
            status: 'published',
            uploadDate: '2024-01-12',
            visibility: 'public'
        },
        {
            id: 4,
            title: 'Upcoming Stream Teaser',
            thumbnail: 'https://placehold.co/320x180/8b5cf6/ffffff?text=Coming+Soon',
            views: '0',
            likes: 0,
            comments: 0,
            duration: '0:30',
            status: 'draft',
            uploadDate: '2024-01-16',
            visibility: 'private'
        }
    ])

    const [filter, setFilter] = useState('all')

    const filteredVideos = videos.filter(video => {
        if (filter === 'all') return true
        return video.status === filter
    })

    const deleteVideo = (id: number) => {
        setVideos(prev => prev.filter(video => video.id !== id))
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'text-green-400'
            case 'draft': return 'text-yellow-400'
            case 'processing': return 'text-blue-400'
            default: return 'text-gray-400'
        }
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Manage Videos</h1>
                        <p className="text-gray-400 mt-2">Manage and organize your video content</p>
                    </div>
                    <Link
                        href="/upload"
                        className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white font-semibold transition-colors flex items-center"
                    >
                        <UploadIcon className="w-5 h-5 mr-2" />
                        Upload New
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-gray-800 rounded-2xl p-6 mb-8">
                    <div className="flex flex-wrap gap-4">
                        {[
                            { value: 'all', label: 'All Videos', count: videos.length },
                            { value: 'published', label: 'Published', count: videos.filter(v => v.status === 'published').length },
                            { value: 'draft', label: 'Drafts', count: videos.filter(v => v.status === 'draft').length },
                            { value: 'processing', label: 'Processing', count: videos.filter(v => v.status === 'processing').length }
                        ].map(filterOption => (
                            <button
                                type='button'
                                key={filterOption.value}
                                onClick={() => setFilter(filterOption.value)}
                                className={`px-4 py-2 rounded-full font-semibold transition-colors ${filter === filterOption.value
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                suppressHydrationWarning={true}
                            >
                                {filterOption.label} ({filterOption.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Videos Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVideos.map(video => (
                        <div key={video.id} className="bg-gray-800 rounded-2xl overflow-hidden hover:bg-gray-750 transition-colors">
                            {/* Thumbnail */}
                            <div className="relative">
                                <Image unoptimized
                                    width={320}
                                    height={180}
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                    {video.duration}
                                </div>
                                <div className="absolute bottom-2 left-2">
                                    <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(video.status as string)}`}>
                                        {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                                    </span>
                                </div>
                            </div>

                            {/* Video Info */}
                            <div className="p-4">
                                <h3 className="font-semibold text-white mb-2 line-clamp-2">{video.title}</h3>

                                <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                                    <span>{video.views} views</span>
                                    <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
                                </div>

                                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                                    <div className="flex items-center space-x-1">
                                        <LikeIcon className="w-4 h-4" />
                                        <span>{video.likes}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <CommentIcon className="w-4 h-4" />
                                        <span>{video.comments}</span>
                                    </div>
                                    <span className="capitalize">{video.visibility}</span>
                                </div>

                                {/* Actions */}
                                <div className="flex space-x-2">
                                    <Link
                                        href={`/video/${video.id}`}
                                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-colors text-center"
                                    >
                                        View
                                    </Link>
                                    <button
                                        type="button"
                                        title="Edit Video"
                                        className="p-2 text-gray-400 hover:text-white transition-colors"
                                        suppressHydrationWarning={true}
                                    >
                                        <EditIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        title="Delete Video"
                                        onClick={() => deleteVideo(video.id)}
                                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                        suppressHydrationWarning={true}
                                    >
                                        <DeleteIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredVideos.length === 0 && (
                    <div className="text-center py-12">
                        <VideoIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">No videos found</h3>
                        <p className="text-gray-500 mb-6">Get started by uploading your first video</p>
                        <Link
                            href="/upload"
                            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white font-semibold transition-colors inline-flex items-center"
                        >
                            <UploadIcon className="w-5 h-5 mr-2" />
                            Upload Video
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

function UploadIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
    )
}

function LikeIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 18.734V6a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.293a2 2 0 012 2v1z" />
        </svg>
    )
}

function CommentIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    )
}

function VideoIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    )
}

function EditIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    )
}

function DeleteIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    )
}