'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function EditProfile() {
    const [formData, setFormData] = useState({
        name: 'Mikael Johnson',
        username: 'mikael_gamer',
        email: 'mikael@example.com',
        bio: 'Professional gamer and streamer. Love FPS and RPG games. Streaming daily at 7 PM EST.',
        location: 'New York, USA',
        website: 'https://mikaelgamer.com',
        twitter: '@mikael_gamer'
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('Profile update:', formData)
        // Handle profile update logic here
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
                        <p className="text-gray-400 mt-2">Update your personal information and preferences</p>
                    </div>
                    <Link
                        href="/profile"
                        className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-full text-white font-semibold transition-colors"
                    >
                        Cancel
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Profile Picture */}
                    <div className="bg-gray-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-4">Profile Picture</h2>
                        <div className="flex items-center space-x-6">
                            <Image unoptimized
                                width={320}
                                height={180}
                                src="https://placehold.co/120x120/7c3aed/ffffff?text=MJ"
                                alt="Profile"
                                className="w-24 h-24 rounded-full border-4 border-purple-500"
                            />
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white font-semibold transition-colors"
                                    suppressHydrationWarning={true}
                                >
                                    Upload New Photo
                                </button>
                                <button
                                    type="button"
                                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-white font-semibold transition-colors"
                                    suppressHydrationWarning={true}
                                >
                                    Remove Photo
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="bg-gray-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-6">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
                                    Bio
                                </label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    rows={4}
                                    value={formData.bio}
                                    // onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="bg-gray-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-6">Social Links</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-2">
                                    Website
                                </label>
                                <input
                                    id="website"
                                    name="website"
                                    type="url"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label htmlFor="twitter" className="block text-sm font-medium text-gray-300 mb-2">
                                    Twitter
                                </label>
                                <input
                                    id="twitter"
                                    name="twitter"
                                    type="text"
                                    value={formData.twitter}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="bg-gray-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-6">Location</h2>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                                Location
                            </label>
                            <input
                                id="location"
                                name="location"
                                type="text"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-4">
                        <Link
                            href="/profile"
                            className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-lg text-white font-semibold transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg text-white font-semibold transition-colors"
                            suppressHydrationWarning={true}
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}