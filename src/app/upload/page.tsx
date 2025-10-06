'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Upload() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        tags: '',
        visibility: 'public',
        allowComments: true,
        scheduleDate: ''
    })

    const [uploadProgress, setUploadProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsUploading(true)

        // Simulate upload progress
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setIsUploading(false)
                    return 100
                }
                return prev + 10
            })
        }, 500)

        console.log('Video upload:', formData)
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
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Upload Video</h1>
                        <p className="text-gray-400 mt-2">Share your content with the world</p>
                    </div>
                    <Link
                        href="/videos/manage"
                        className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-full text-white font-semibold transition-colors"
                    >
                        Manage Videos
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Video Upload */}
                    <div className="bg-gray-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-6">Video File</h2>

                        <div className="border-2 border-dashed border-gray-600 rounded-2xl p-12 text-center hover:border-purple-500 transition-colors">
                            <UploadIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-lg font-semibold text-white mb-2">Drag and drop your video file</p>
                            <p className="text-gray-400 mb-6">or click to browse files</p>
                            <button
                                type="button"
                                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white font-semibold transition-colors"
                                suppressHydrationWarning={true}
                            >
                                Select File
                            </button>
                            <p className="text-sm text-gray-400 mt-4">MP4, MOV, AVI up to 10GB</p>
                        </div>

                        {isUploading && (
                            <div className="mt-6">
                                <div className="flex justify-between text-sm text-gray-400 mb-2">
                                    <span>Uploading...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                                    // style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Video Details */}
                    <div className="bg-gray-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-6">Video Details</h2>

                        <div className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                                    Title *
                                </label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter video title"
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    value={formData.description}
                                    // onChange={handleChange}
                                    placeholder="Describe your video..."
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                                <div>
                                    <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
                                        Tags
                                    </label>
                                    <input
                                        id="tags"
                                        name="tags"
                                        type="text"
                                        value={formData.tags}
                                        onChange={handleChange}
                                        placeholder="gaming, live, stream..."
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visibility & Settings */}
                    <div className="bg-gray-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-6">Visibility & Settings</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-4">Visibility</label>
                                <div className="space-y-3">
                                    {[
                                        { value: 'public', label: 'Public', description: 'Anyone can view this video' },
                                        { value: 'unlisted', label: 'Unlisted', description: 'Only people with the link can view' },
                                        { value: 'private', label: 'Private', description: 'Only you can view this video' }
                                    ].map(option => (
                                        <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="visibility"
                                                value={option.value}
                                                checked={formData.visibility === option.value}
                                                onChange={handleChange}
                                                className="mt-1 text-purple-600 focus:ring-purple-500"
                                            />
                                            <div>
                                                <div className="font-medium text-white">{option.label}</div>
                                                <div className="text-sm text-gray-400">{option.description}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <label htmlFor="allowComments" className="text-sm font-medium text-gray-300">
                                        Allow Comments
                                    </label>
                                    <p className="text-sm text-gray-400">Viewers can comment on this video</p>
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

                            <div>
                                <label htmlFor="scheduleDate" className="block text-sm font-medium text-gray-300 mb-2">
                                    Schedule (Optional)
                                </label>
                                <input
                                    id="scheduleDate"
                                    name="scheduleDate"
                                    type="datetime-local"
                                    value={formData.scheduleDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
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
                            disabled={isUploading}
                            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 px-8 py-3 rounded-lg text-white font-semibold transition-colors"
                            suppressHydrationWarning={true}
                        >
                            {isUploading ? 'Uploading...' : 'Upload Video'}
                        </button>
                    </div>
                </form>
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