'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Profile() {
    const [user] = useState({
        name: 'Mikael Johnson',
        username: 'mikael_gamer',
        email: 'mikael@example.com',
        bio: 'Professional gamer and streamer. Love FPS and RPG games. Streaming daily at 7 PM EST.',
        joinDate: 'January 2024',
        subscribers: '15.2K',
        totalViews: '1.2M',
        streams: 47
    })

    const stats = [
        { label: 'Subscribers', value: user.subscribers },
        { label: 'Total Views', value: user.totalViews },
        { label: 'Streams', value: user.streams }
    ]

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-gray-800 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <Image unoptimized
                                width={320}
                                height={180}
                                src="https://placehold.co/120x120/7c3aed/ffffff?text=MJ"
                                alt="Profile"
                                className="w-32 h-32 rounded-full border-4 border-purple-500"
                            />
                            <div>
                                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                                <p className="text-gray-400 text-lg">@{user.username}</p>
                                <p className="text-gray-400 mt-2">Joined {user.joinDate}</p>
                            </div>
                        </div>
                        <Link
                            href="/profile/edit"
                            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-full text-white font-semibold transition-colors"
                        >
                            Edit Profile
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Bio */}
                        <div className="bg-gray-800 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-4">About</h2>
                            <p className="text-gray-300 leading-relaxed">{user.bio}</p>
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
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                                        <Image unoptimized
                                            width={320}
                                            height={180}
                                            src={`https://placehold.co/120x68/3b82f6/ffffff?text=Stream+${i}`}
                                            alt={`Stream ${i}`}
                                            className="w-20 h-12 rounded object-cover"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold">Awesome Gameplay Session #{i}</h3>
                                            <p className="text-sm text-gray-400">2 days ago • 1.2K views</p>
                                        </div>
                                        <span className="bg-red-600 text-xs font-semibold px-2 py-1 rounded">LIVE</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Stats */}
                        <div className="bg-gray-800 rounded-2xl p-6">
                            <h3 className="text-lg font-bold mb-4">Channel Stats</h3>
                            <div className="space-y-4">
                                {stats.map((stat, index) => (
                                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                                        <span className="text-gray-400">{stat.label}</span>
                                        <span className="font-semibold">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gray-800 rounded-2xl p-6">
                            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link
                                    href="/upload"
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <UploadIcon className="w-5 h-5 mr-2" />
                                    Upload Video
                                </Link>
                                <Link
                                    href="/channel/manage"
                                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <SettingsIcon className="w-5 h-5 mr-2" />
                                    Manage Channel
                                </Link>
                                <Link
                                    href="/channel/create"
                                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <PlusIcon className="w-5 h-5 mr-2" />
                                    Create Channel
                                </Link>
                            </div>
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

function PlusIcon({ className }: { className: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
    )
}