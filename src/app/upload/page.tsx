'use client'
import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import Link from 'next/link'
import api from '@/apis/api'
import { io, Socket } from "socket.io-client";

// Types
interface UploadState {
    title: string
    description: string
    category: string
    tags: string
    visibility: 'public' | 'private' | 'unlisted'
    allowComments: boolean
    scheduleDate: string
}

interface UploadProgress {
    uploadedBytes: number
    totalBytes: number
    percentage: number
    uploadedSegments: number
    totalSegments: number
}

type UploadStep = 'getting url' | 'uploading on b2' | 'downloading on worker' | 'processing on worker' | 'uploading on b2 from worker' | 'complete'

interface UploadResult {
    success: boolean;
    key: string;
    videoId: string;
}

interface VideoProgressData {
    resolution?: string;
    progress?: number;
    status?: string;
    videoId?: string;
}

// Constants
const RESOLUTIONS = ['144p', '240p', '360p', '480p', '720p', '1080p'] as const
const INITIAL_UPLOAD_STATE: UploadState = {
    title: '',
    description: '',
    category: '',
    tags: '',
    visibility: 'public',
    allowComments: true,
    scheduleDate: ''
}

const INITIAL_UPLOAD_PROGRESS: UploadProgress = {
    uploadedBytes: 0,
    totalBytes: 0,
    percentage: 0,
    uploadedSegments: 0,
    totalSegments: 0
}

// Custom Hooks
const useFileUpload = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [isDragOver, setIsDragOver] = useState(false)

    const handleFileSelect = useCallback((file: File, setFormData: React.Dispatch<React.SetStateAction<UploadState>>) => {
        setVideoFile(file)

        if (!file) return

        // Set title from filename if empty
        setFormData(prev => prev.title.trim() ? prev : {
            ...prev,
            title: file.name.replace(/\.[^/.]+$/, "")
        })
    }, [])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent, setFormData: React.Dispatch<React.SetStateAction<UploadState>>) => {
        e.preventDefault()
        setIsDragOver(false)

        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith('video/')) {
            handleFileSelect(file, setFormData)
        }
    }, [handleFileSelect])

    return {
        videoFile,
        isDragOver,
        setVideoFile,
        handleFileSelect,
        handleDragOver,
        handleDragLeave,
        handleDrop
    }
}

const useUploadProgress = () => {
    const [currentStep, setCurrentStep] = useState<UploadStep>('getting url')
    const [uploadProgress, setUploadProgress] = useState<UploadProgress>(INITIAL_UPLOAD_PROGRESS)
    const [processingProgress, setProcessingProgress] = useState<Record<string, number>>({})
    const [completedResolutions, setCompletedResolutions] = useState<string[]>([])

    const updateUploadProgress = useCallback((updates: Partial<UploadProgress>) => {
        setUploadProgress(prev => ({ ...prev, ...updates }))
    }, [])

    const updateProcessingProgress = useCallback((resolution: string, progress: number) => {
        setProcessingProgress(prev => ({ ...prev, [resolution]: progress }))
    }, [])

    const completeResolution = useCallback((resolution: string) => {
        setCompletedResolutions(prev => [...prev, resolution])
    }, [])

    const resetProgress = useCallback(() => {
        setCurrentStep('getting url')
        setUploadProgress(INITIAL_UPLOAD_PROGRESS)
        setProcessingProgress({})
        setCompletedResolutions([])
    }, [])

    return {
        currentStep,
        uploadProgress,
        processingProgress,
        completedResolutions,
        setCurrentStep,
        updateUploadProgress,
        updateProcessingProgress,
        completeResolution,
        resetProgress
    }
}

// Utility Functions
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Main Component
const UploadPage = () => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [formData, setFormData] = useState<UploadState>(INITIAL_UPLOAD_STATE)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [previewUrl, _setPreviewUrl] = useState<string>('')
    const socketRef = useRef<Socket | null>(null)

    const {
        videoFile,
        isDragOver,
        setVideoFile,
        handleFileSelect,
        handleDragOver,
        handleDragLeave,
        handleDrop
    } = useFileUpload()

    const {
        currentStep,
        uploadProgress,
        processingProgress,
        completedResolutions,
        setCurrentStep,
        updateUploadProgress,
        updateProcessingProgress,
        completeResolution,
        resetProgress
    } = useUploadProgress()

    // Socket.io connection
    useEffect(() => {
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL
        if (!socketUrl) {
            console.error('Socket URL not configured')
            return
        }

        socketRef.current = io(socketUrl)

        socketRef.current.on('connect', () => {
            console.log('Connected to server with ID:', socketRef.current?.id)
        })
        socketRef.current.on('welcome', (data: { message: string; socketId: string }) => {
            console.log('Server says:', data.message, 'Your Socket ID:', data.socketId)
        })

        socketRef.current.on('video-progress', (data: VideoProgressData) => {
            console.log('Progress update received:', data)

            if (data.resolution && data.progress !== undefined) {
                updateProcessingProgress(data.resolution, data.progress)

                if (data.progress >= 100) {
                    completeResolution(data.resolution)
                }
            }

            // Update steps based on progress
            if (data.status === 'processing') {
                setCurrentStep('processing on worker')
            } else if (data.status === 'uploading') {
                setCurrentStep('uploading on b2 from worker')
            } else if (data.status === 'completed') {
                setCurrentStep('complete')
                setIsUploading(false)
            }
        })

        socketRef.current.on('error', (error: { message: string }) => {
            setError(error.message)
            setIsUploading(false)
        })

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect()
            }
        }
    }, [updateProcessingProgress, completeResolution, setCurrentStep])

    const uploadingFile = async (file: File): Promise<UploadResult> => {
        try {
            const response = await api.post("/auth/get-upload-url", {
                title: formData.title,
                description: formData.description
            })

            const data = response.data as { key: string; videoId: string; uploadUrl: string }
            console.log("Got the URL", response)

            return await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest()

                // Progress tracking
                xhr.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable) {
                        const percentComplete = (event.loaded / event.total) * 100

                        updateUploadProgress({
                            uploadedBytes: event.loaded,
                            totalBytes: event.total,
                            percentage: percentComplete
                        })

                        console.log(`Uploading: ${(event.loaded / (1024 * 1024)).toFixed(2)}MB / ${(event.total / (1024 * 1024)).toFixed(2)}MB (${Math.round(percentComplete)}%)`)
                    }
                })

                xhr.addEventListener('load', () => {
                    if (xhr.status === 200 || xhr.status === 201) { // Azure status is 201
                        console.log('✅ File uploaded successfully')
                        resolve({
                            success: true,
                            key: data.key,
                            videoId: data.videoId
                        })
                    } else {
                        reject(new Error(`Upload failed: ${xhr.status} - ${xhr.responseText}`))
                    }
                })

                xhr.addEventListener('error', () => {
                    reject(new Error('Upload failed due to network error'))
                })

                xhr.addEventListener('abort', () => {
                    reject(new Error('Upload was cancelled'))
                })

                xhr.open('PUT', data.uploadUrl)
                xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob'); // for Azure
                xhr.setRequestHeader('Content-Type', file.type || 'video/mp4')
                setCurrentStep('uploading on b2')
                xhr.send(file)
            })
        } catch (error) {
            console.error('Upload error:', error)
            throw error
        }
    }

    // Memoized values
    const stepMessage = useMemo(() => {
        switch (currentStep) {
            case 'uploading on b2':
            case 'downloading on worker':
                return `Uploading video... ${Math.round(uploadProgress.percentage)}%`
            case 'processing on worker':
                return `Processing resolutions... (${completedResolutions.length}/${RESOLUTIONS.length} complete)`
            case 'uploading on b2 from worker':
                return `Uploading video segments... ${uploadProgress.uploadedSegments}/${uploadProgress.totalSegments}`
            case 'complete':
                return 'Upload complete! Your video is ready.'
            default:
                return 'Processing...'
        }
    }, [currentStep, uploadProgress, completedResolutions.length])

    const stepIcon = useMemo(() => {
        const iconProps = { className: "w-6 h-6" }
        switch (currentStep) {
            case 'getting url':
                return <DetailsIcon {...iconProps} />
            case 'uploading on b2':
                return <UploadIcon {...iconProps} />
            case 'downloading on worker':
                return <DownloadIcon {...iconProps} />
            case 'processing on worker':
                return <ProcessIcon {...iconProps} />
            case 'uploading on b2 from worker':
                return <SegmentIcon {...iconProps} />
            case 'complete':
                return <CompleteIcon {...iconProps} />
            default:
                return null
        }
    }, [currentStep])

    // Event Handlers
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!videoFile) {
            setError('Please select a video file first.')
            return
        }

        if (!formData.title.trim()) {
            setError('Please enter a title for your video.')
            return
        }

        try {
            setIsUploading(true)
            setError(null)
            resetProgress()
            setCurrentStep('getting url')

            const result = await uploadingFile(videoFile)
            if (result.success) {
                // Retry scheduling job up to 3 times if it fails
                const scheduleJobWithRetry = async (retries = 3): Promise<void> => {
                    try {
                        const response = await api.post("/auth/schedule-job", {
                            key: result.key,
                            videoId: result.videoId,
                            socketId: socketRef.current?.id
                        })

                        if (response.status >= 200 && response.status < 300) {
                            setCurrentStep('downloading on worker')
                        } else {
                            throw new Error('Failed to schedule video processing')
                        }
                    } catch (err) {
                        if (retries > 0) {
                            await scheduleJobWithRetry(retries - 1)
                        } else {
                            throw err
                        }
                    }
                }

                await scheduleJobWithRetry()
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Upload failed'
            setError(errorMessage)
            setIsUploading(false)
            console.error('Upload error:', err)
        }
    }

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && file.type.startsWith('video/')) {
            handleFileSelect(file, setFormData)
            setError(null)
        } else if (file) {
            setError('Please select a valid video file')
        }
    }, [handleFileSelect])

    const handleInputChange = useCallback((
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target
        const checked = (e.target as HTMLInputElement).checked

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))

        if (error) setError(null)
    }, [error])

    const getResolutionStatus = useCallback((resolution: string) => {
        if (completedResolutions.includes(resolution)) return 'complete'
        if (processingProgress[resolution] !== undefined) return 'processing'
        return 'pending'
    }, [completedResolutions, processingProgress])

    const resetForm = useCallback(() => {
        setFormData(INITIAL_UPLOAD_STATE)
        setVideoFile(null)
        setError(null)
        resetProgress()
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }, [setVideoFile, resetProgress])

    // Render Functions
    const renderStepContent = () => {
        const commonInfo = (
            <div className="flex justify-between flex-col text-sm">
                <span className="text-white">{formData.title || 'Untitled Video'}</span>
                <span className="text-gray-400">{formData.description || 'No Description'}</span>
            </div>
        )

        switch (currentStep) {
            case 'uploading on b2':
            case 'downloading on worker':
                return <div className="space-y-4">{commonInfo}</div>

            case 'processing on worker':
                return (
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">
                            Processing Resolutions ({completedResolutions.length}/{RESOLUTIONS.length})
                        </h4>
                        <div className="space-y-3">
                            {RESOLUTIONS.map((resolution) => {
                                const status = getResolutionStatus(resolution)
                                const progress = processingProgress[resolution] || 0
                                const statusConfig = {
                                    complete: { bg: 'bg-green-400', text: 'text-green-400' },
                                    processing: { bg: 'bg-purple-400 animate-pulse', text: 'text-purple-400' },
                                    pending: { bg: 'bg-gray-500', text: 'text-gray-400' }
                                }[status]

                                return (
                                    <div key={resolution} className="flex items-center gap-3 p-3 rounded-lg bg-gray-600/30">
                                        <div className="flex items-center gap-2 flex-1">
                                            <div className={`w-2 h-2 rounded-full ${statusConfig.bg}`} />
                                            <span className={`text-sm font-medium ${statusConfig.text}`}>
                                                {resolution}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {status === 'processing' && (
                                                <span className="text-purple-400 text-sm">{Math.round(progress)}%</span>
                                            )}
                                            {status === 'complete' && <CheckIcon className="w-4 h-4 text-green-400" />}
                                            {status === 'pending' && (
                                                <span className="text-gray-500 text-sm">Pending</span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )

            case 'uploading on b2 from worker':
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-white">Uploading Segments</span>
                            <span className="text-gray-400">
                                {uploadProgress.uploadedSegments}/{uploadProgress.totalSegments}
                            </span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-3">
                            <div
                                className="h-3 rounded-full bg-green-400 transition-all duration-300"
                                style={{ width: `${uploadProgress.percentage}%` }}
                            />
                        </div>
                        <div className="text-sm text-gray-300">
                            Segment {uploadProgress.uploadedSegments} of {uploadProgress.totalSegments} uploaded
                        </div>
                    </div>
                )

            case 'complete':
                return (
                    <div className="space-y-4">
                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-green-400 mb-2">
                                <CompleteIcon className="w-5 h-5" />
                                <span className="font-semibold">Upload Successful!</span>
                            </div>
                            <p className="text-green-300 text-sm">
                                Your video has been uploaded and processed successfully.
                            </p>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="mt-3 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-colors"
                            >
                                Upload Another Video
                            </button>
                        </div>

                        {previewUrl && (
                            <div className="bg-gray-700/30 rounded-xl p-4">
                                <h4 className="text-white font-semibold mb-3">Video Preview</h4>
                                <div className="aspect-video bg-gray-600 rounded-lg flex items-center justify-center">
                                    <div className="text-center">
                                        <VideoIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-400 text-sm">Video Preview</p>
                                        <p className="text-gray-500 text-xs mt-1">Ready for playback</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )

            default:
                return null
        }
    }

    const uploadSteps: UploadStep[] = [
        'getting url', 'uploading on b2', 'downloading on worker',
        'processing on worker', 'uploading on b2 from worker', 'complete'
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-600 rounded-lg">
                                <UploadIcon className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-white">Upload Video</h1>
                        </div>
                        <p className="text-gray-400">Share your content with the world</p>
                    </div>
                    <Link
                        href="/videos/manage"
                        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 hover:scale-105"
                    >
                        <ManageIcon className="w-5 h-5" />
                        Manage Videos
                    </Link>
                </div>
                {/* Restriction Note for New Users */}
                <div className="mb-8">
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-center gap-3">
                        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p className="text-yellow-300 font-semibold">Upload Restricted</p>
                            <p className="text-yellow-200 text-sm">
                                Uploading videos is restricted for newly registered users. Please contact the admin to request upload access for testing.
                            </p>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Video Upload Section */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                        <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                            <VideoIcon className="w-5 h-5" />
                            Video File
                        </h2>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="video/*"
                            className="hidden"
                        />

                        {!videoFile ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, setFormData)}
                                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer
                  ${isDragOver
                                        ? 'border-purple-500 bg-purple-500/10'
                                        : 'border-gray-600 hover:border-purple-500 hover:bg-gray-700/50'
                                    }`}
                            >
                                <UploadIcon className={`w-16 h-16 mx-auto mb-4 transition-colors 
                  ${isDragOver ? 'text-purple-400' : 'text-gray-400'}`}
                                />
                                <p className="text-lg font-semibold text-white mb-2">
                                    {isDragOver ? 'Drop your video here' : 'Drag and drop your video file'}
                                </p>
                                <p className="text-gray-400 mb-6">or click to browse files</p>
                                <button
                                    type="button"
                                    className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg text-white font-semibold transition-all duration-200 hover:scale-105"
                                >
                                    Select File
                                </button>
                                <p className="text-sm text-gray-400 mt-4">MP4, MOV, AVI up to 10GB</p>
                            </div>
                        ) : (
                            <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <VideoIcon className="w-8 h-8 text-green-400" />
                                        {videoFile ? (
                                            <div>
                                                <p className="font-semibold text-white">{videoFile.name}</p>
                                                <p className="text-sm text-gray-400">{formatFileSize(videoFile.size)}</p>
                                            </div>
                                        ) : null}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setVideoFile(null)}
                                        disabled={isUploading}
                                        className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-2"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Upload Progress Display */}
                        {isUploading && (
                            <div className="mt-6 space-y-6">
                                <div className="flex items-center gap-3">
                                    {stepIcon}
                                    <div className="flex-1">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-white font-medium capitalize">{currentStep.replace(/-/g, ' ')}</span>
                                            <span className="text-gray-400">
                                                {['uploading on b2', 'downloading on worker'].includes(currentStep)
                                                    ? `${Math.round(uploadProgress.percentage)}%`
                                                    : currentStep === 'processing on worker'
                                                        ? `${completedResolutions.length}/${RESOLUTIONS.length}`
                                                        : ''}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-600 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${['uploading on b2', 'downloading on worker'].includes(currentStep)
                                                        ? uploadProgress.percentage
                                                        : currentStep === 'processing on worker'
                                                            ? (completedResolutions.length / RESOLUTIONS.length) * 100
                                                            : 0}%`,
                                                    backgroundColor:
                                                        currentStep === 'uploading on b2' ? '#eab308' :
                                                            currentStep === 'processing on worker' ? '#a855f7' :
                                                                currentStep === 'downloading on worker' ? '#10b981' : '#3b82f6'
                                                }}
                                            />
                                        </div>
                                        <p className="text-sm text-gray-300 mt-2">{stepMessage}</p>
                                    </div>
                                </div>

                                {renderStepContent()}

                                {/* Step Progress Indicator */}
                                <div className="flex justify-between items-center px-4 py-3 bg-gray-700/30 rounded-lg">
                                    {uploadSteps.map((step) => {
                                        const currentIndex = uploadSteps.indexOf(currentStep)
                                        const stepIndex = uploadSteps.indexOf(step)
                                        const isActive = currentStep === step
                                        const isCompleted = currentIndex > stepIndex

                                        const colors = {
                                            'getting url': 'bg-blue-400',
                                            'uploading on b2': 'bg-yellow-400',
                                            'downloading on worker': 'bg-red-400',
                                            'processing on worker': 'bg-purple-400',
                                            'uploading on b2 from worker': 'bg-green-400',
                                            'complete': 'bg-green-400'
                                        }

                                        return (
                                            <div key={step} className="flex flex-col items-center">
                                                <div className={`w-3 h-3 rounded-full ${isActive ? colors[step] : isCompleted ? 'bg-green-400' : 'bg-gray-600'
                                                    }`} />
                                                <span className="text-xs text-gray-400 mt-1 capitalize">{step.replace(/-/g, ' ')}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Video Details */}
                    {!isUploading && (
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                            <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                                <DetailsIcon className="w-5 h-5" />
                                Video Details
                            </h2>

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
                                        onChange={handleInputChange}
                                        disabled={isUploading}
                                        placeholder="Enter an engaging title for your video"
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 transition-colors"
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
                                        onChange={handleInputChange}
                                        disabled={isUploading}
                                        placeholder="Describe your video to help viewers understand what it's about..."
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none disabled:opacity-50 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-red-400">
                                <ErrorIcon className="w-5 h-5" />
                                <p className="font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-700">
                        <Link
                            href="/"
                            className="px-8 py-3 rounded-lg text-white font-semibold transition-all duration-200 text-center bg-gray-700 hover:bg-gray-600 hover:scale-105"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isUploading || !videoFile}
                            className="px-8 py-3 rounded-lg text-white font-semibold transition-all duration-200 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed hover:scale-105 disabled:scale-100"
                        >
                            {isUploading ? (
                                <span className="flex items-center gap-2">
                                    <LoadingSpinner />
                                    {currentStep === 'complete' ? 'Complete!' : 'Processing...'}
                                </span>
                            ) : (
                                'Upload Video'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UploadPage

// Icons (keep the same as your original)
function SegmentIcon({ className }: { className: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
    )
}

function UploadIcon({ className }: { className: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
    )
}

function DownloadIcon({ className }: { className: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
    )
}

function ProcessIcon({ className }: { className: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    )
}

function CompleteIcon({ className }: { className: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
    )
}

function CheckIcon({ className }: { className: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
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

function DetailsIcon({ className }: { className: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    )
}

function ManageIcon({ className }: { className: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
    )
}

function TrashIcon({ className }: { className: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    )
}

function ErrorIcon({ className }: { className: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    )
}

function LoadingSpinner() {
    return (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
    )
}