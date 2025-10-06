'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function ManageChannel() {
    const [channel] = useState({
        name: 'Mikael Gaming',
        handle: 'mikael_gaming',
        subscribers: '15.2K',
        totalViews: '1.2M',
        streams: 47,
        category: 'Gaming',
        description: 'Daily gaming streams featuring FPS and RPG games. Join the fun!'
    })

    const recentStreams = [
        { id: 1, title: 'Epic Battle Royale', views: '2.1K', date: '2 hours ago', duration: '3:45:12' },
        { id: 2, title: 'RPG Adventure Part 5', views: '1.8K', date: '1 day ago', duration: '2:30:45' },
        { id: 3, title: 'FPS Tournament', views: '3.4K', date: '3 days ago', duration: '4:15:30' }
    ]

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Manage Channel</h1>
                        <p className="text-gray-400 mt-2">Manage your channel settings and content</p>
                    </div>
                    <Link
                        href="/upload"
                        className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white font-semibold transition-colors flex items-center"
                    >
                        <UploadIcon className="w-5 h-5 mr-2" />
                        New Stream
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Channel Overview */}
                        <div className="bg-gray-800 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-6">Channel Overview</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                                <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-purple-400">{channel.subscribers}</div>
                                    <div className="text-sm text-gray-400">Subscribers</div>
                                </div>
                                <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-green-400">{channel.totalViews}</div>
                                    <div className="text-sm text-gray-400">Total Views</div>
                                </div>
                                <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-400">{channel.streams}</div>
                                    <div className="text-sm text-gray-400">Streams</div>
                                </div>
                                <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-yellow-400">4.8</div>
                                    <div className="text-sm text-gray-400">Rating</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                                    <span className="text-gray-400">Channel Name</span>
                                    <span className="font-semibold">{channel.name}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                                    <span className="text-gray-400">Handle</span>
                                    <span className="font-semibold">xplay.tv/{channel.handle}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                                    <span className="text-gray-400">Category</span>
                                    <span className="font-semibold">{channel.category}</span>
                                </div>
                                <div className="flex justify-between items-start py-2">
                                    <span className="text-gray-400">Description</span>
                                    <span className="font-semibold text-right max-w-md">{channel.description}</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Streams */}
                        <div className="bg-gray-800 rounded-2xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">Recent Streams</h2>
                                <Link href="/videos/manage" className="text-purple-400 hover:text-purple-300">
                                    View all
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {recentStreams.map(stream => (
                                    <div key={stream.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <Image unoptimized
                                                width={320}
                                                height={180}
                                                src={`https://placehold.co/80x45/3b82f6/ffffff?text=Stream+${stream.id}`}
                                                alt={stream.title}
                                                className="w-20 h-12 rounded object-cover"
                                            />
                                            <div>
                                                <h3 className="font-semibold">{stream.title}</h3>
                                                <p className="text-sm text-gray-400">{stream.views} views • {stream.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className="text-sm text-gray-400">{stream.duration}</span>
                                            <div className="flex space-x-2">
                                                <button
                                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                                    title="Edit Stream"
                                                    suppressHydrationWarning={true}
                                                >
                                                    <EditIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                                    title="Delete Stream"
                                                    suppressHydrationWarning={true}
                                                >
                                                    <DeleteIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-gray-800 rounded-2xl p-6">
                            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link
                                    href="/channel/create"
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <SettingsIcon className="w-5 h-5 mr-2" />
                                    Channel Settings
                                </Link>
                                <Link
                                    href="/upload"
                                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <UploadIcon className="w-5 h-5 mr-2" />
                                    Upload Video
                                </Link>
                                <Link
                                    href="/videos/manage"
                                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <VideoIcon className="w-5 h-5 mr-2" />
                                    Manage Videos
                                </Link>
                            </div>
                        </div>

                        {/* Schedule Stream */}
                        <div className="bg-gray-800 rounded-2xl p-6">
                            <h3 className="text-lg font-bold mb-4">Schedule Stream</h3>
                            <p className="text-gray-400 text-sm mb-4">Plan your next stream in advance</p>
                            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors" suppressHydrationWarning={true} >
                                <CalendarIcon className="w-5 h-5 mr-2" />
                                Schedule Stream
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function UploadIcon({ className }: { className: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
    )
}

function SettingsIcon({ className }: { className: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    )
}

function VideoIcon({ className }: { className: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    )
}

function CalendarIcon({ className }: { className: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    )
}

function EditIcon({ className }: { className: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    )
}

function DeleteIcon({ className }: { className: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    )
}