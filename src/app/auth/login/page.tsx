'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios, { AxiosError } from 'axios' // Import axios at the top
import { login } from '@/store/authSlice' // Assuming this is your Redux action

const API_URL = process.env.NEXT_PUBLIC_API_URL

// --- Type Definitions for clarity ---

// 1. Define the shape of your form values
type LoginFormValues = {
    email: string
    password: string
    rememberMe: boolean
}

// 2. Define the expected API success response
type LoginResponse = {
    user: {
        id: string
        email: string
        username: string
        name: string
    }
    tokens: {
        accessToken: string
        refreshToken: string
    }
}

// 3. Define the expected API error response
type ApiError = {
    message: string
    // Add other potential error fields if your API sends them
}

// --- React Query Mutation Function ---

/**
 * This function handles the actual API call.
 * It's passed to useMutation's `mutationFn`.
 */
const loginUser = async (
    values: LoginFormValues,
): Promise<LoginResponse> => {
    const { data } = await axios.post(`${API_URL}/auth/login`, values, {
        headers: { 'Content-Type': 'application/json' },
    })
    return data
}

// --- Validation Schema ---

/**
 * Defines validation rules for the form using Yup.
 */
const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string().required('Password is required'),
})

// --- The Component ---

export default function Login() {
    const dispatch = useDispatch()
    const router = useRouter()

    /**
     * 4. Setup useMutation
     * This hook manages the entire lifecycle of the login request.
     */
    const mutation = useMutation<
        LoginResponse,    // Type on success
        AxiosError<ApiError>, // Type on error
        LoginFormValues     // Type of variables passed to mutationFn
    >({
        mutationFn: loginUser, // The async function to call
        onSuccess: (data) => {
            // 5. Handle success side-effects
            // This runs when the API call is successful
            dispatch(
                login({
                    id: data.user.id,
                    email: data.user.email,
                    username: data.user.username,
                    name: data.user.name,
                    accessToken: data.tokens.accessToken,
                    refreshToken: data.tokens.refreshToken,
                    exp: Date.now() + 15 * 60 * 1000,
                }),
            )
            router.push('/')
        },
        onError: (error) => {
            // 6. Handle error side-effects
            // This runs if the API call fails
            console.error('Login error:', error)
            const message =
                error.response?.data?.message || error.message || 'Login Failed'
            alert(message)
        },
    })

    /**
     * 7. Setup Formik
     * This hook manages form state, validation, and submission.
     */
    const formik = useFormik<LoginFormValues>({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        validationSchema: LoginSchema, // Apply the validation rules
        onSubmit: (values) => {
            // 8. On submit, call the mutation
            mutation.mutate(values)
        },
    })

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-gray-800 rounded-xl shadow-lg p-8">
                    {/* Header (unchanged) */}
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <Link href="/" className="flex items-center group">
                                <Image
                                    src="/logo.png"
                                    alt="Logo"
                                    width={100}
                                    height={40}
                                    className="rounded-lg shadow-md group-hover:scale-105 transition-transform"
                                />
                            </Link>
                        </div>
                        <h2 className="text-3xl font-bold text-white">Welcome back</h2>
                        <p className="mt-2 text-gray-400">
                            Sign in to your Streamlet account
                        </p>
                    </div>

                    {/* 9. Use formik.handleSubmit */}
                    <form className="space-y-6 mt-8" onSubmit={formik.handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-300"
                                >
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    // 10. Use formik.getFieldProps for easy binding
                                    {...formik.getFieldProps('email')}
                                    className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                {/* 11. Show validation error */}
                                {formik.touched.email && formik.errors.email ? (
                                    <div className="text-red-400 text-sm mt-1">
                                        {formik.errors.email}
                                    </div>
                                ) : null}
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-300"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    // 10. Use formik.getFieldProps
                                    {...formik.getFieldProps('password')}
                                    className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                {/* 11. Show validation error */}
                                {formik.touched.password && formik.errors.password ? (
                                    <div className="text-red-400 text-sm mt-1">
                                        {formik.errors.password}
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            {/* Added the "Remember me" checkbox from your original state */}
                            <div className="flex items-center">
                                <input
                                    id="rememberMe"
                                    type="checkbox"
                                    // 10. Use formik.getFieldProps (works for checkboxes too!)
                                    {...formik.getFieldProps('rememberMe')}
                                    checked={formik.values.rememberMe} // Explicitly set checked
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 bg-gray-900 rounded"
                                />
                                <label
                                    htmlFor="rememberMe"
                                    className="ml-2 block text-sm text-gray-300"
                                >
                                    Remember me
                                </label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="text-purple-400 hover:text-purple-300">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                // 12. Use mutation.isPending for loading & disabled states
                                disabled={mutation.isPending}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 transition-colors disabled:bg-purple-800 disabled:cursor-not-allowed"
                                suppressHydrationWarning={true}
                            >
                                {mutation.isPending ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>

                        <div className="text-center">
                            <span className="text-gray-400">
                                Don&apos;t have an account?{' '}
                            </span>
                            <Link
                                href="/auth/signup"
                                className="text-purple-400 hover:text-purple-300 font-medium"
                            >
                                Sign up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}