'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CreateChannel() {
    const [formData, setFormData] = useState({
        name: '',
        handle: '',
        description: '',
        category: '',
        isPublic: true,
        allowComments: true
    })

    const categories = [
        'Gaming',
        'Music',
        'Education',
        'Entertainment',
        'Sports',
        'Technology',
        'Art',
        'Just Chatting'
    ]

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('Channel creation:', formData)
        // Handle channel creation logic here
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Create Your Channel</h1>
                    <p className="text-gray-400 mt-2">Start your streaming journey with Xplay</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Channel Information */}
                    <div className="bg-gray-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-6">Channel Information</h2>

                        <div className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                    Channel Name *
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your channel name"
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label htmlFor="handle" className="block text-sm font-medium text-gray-300 mb-2">
                                    Channel Handle *
                                </label>
                                <div className="flex items-center">
                                    <span className="px-4 py-3 bg-gray-600 border border-r-0 border-gray-600 rounded-l-lg text-gray-300">
                                        xplay.tv/
                                    </span>
                                    <input
                                        id="handle"
                                        name="handle"
                                        type="text"
                                        required
                                        value={formData.handle}
                                        onChange={handleChange}
                                        placeholder="your-handle"
                                        className="flex-1 px-4 py-3 bg-gray-700 border border-l-0 border-gray-600 rounded-r-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                                    Channel Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    value={formData.description}
                                    // onChange={handleChange}
                                    placeholder="Tell viewers about your channel..."
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    // onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Channel Settings */}
                    <div className="bg-gray-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-6">Channel Settings</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label htmlFor="isPublic" className="text-sm font-medium text-gray-300">
                                        Public Channel
                                    </label>
                                    <p className="text-sm text-gray-400">Anyone can find and view your channel</p>
                                </div>
                                <input
                                    id="isPublic"
                                    name="isPublic"
                                    type="checkbox"
                                    checked={formData.isPublic}
                                    onChange={handleChange}
                                    className="h-6 w-6 text-purple-600 focus:ring-purple-500 border-gray-600 rounded bg-gray-700"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <label htmlFor="allowComments" className="text-sm font-medium text-gray-300">
                                        Allow Comments
                                    </label>
                                    <p className="text-sm text-gray-400">Viewers can comment on your streams</p>
                                </div>
                                <input
                                    id="allowComments"
                                    name="allowComments"
                                    type="checkbox"
                                    checked={formData.allowComments}
                                    onChange={handleChange}
                                    className="h-6 w-6 text-purple-600 focus:ring-purple-500 border-gray-600 rounded bg-gray-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center">
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
                            Create Channel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}