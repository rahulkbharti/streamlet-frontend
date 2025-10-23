'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios, { AxiosError } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

// --- Type Definitions ---

// 1. Define the shape of your form values
type SignupFormValues = {
    username: string
    email: string
    password: string
    confirmPassword: string
    agreeToTerms: boolean
}

// 2. Define the expected API success response (assuming simple success message)
type SignupResponse = {
    message: string
    // Add other fields if your API returns user/tokens on signup
}

// 3. Define the expected API error response
type ApiError = {
    message: string
}

// --- React Query Mutation Function ---

/**
 * This function handles the actual API call for signup.
 */
const signupUser = async (
    values: SignupFormValues,
): Promise<SignupResponse> => {
    // The API might not need confirmPassword.
    // If so, you can destructure and omit it:
    // const { confirmPassword, ...apiData } = values
    // const { data } = await axios.post(`${API_URL}/auth/signup`, apiData, { ... })

    // For now, sending all form data as in the original script
    const { data } = await axios.post(`${API_URL}/auth/signup`, values, {
        headers: { 'Content-Type': 'application/json' },
    })
    return data
}

// --- Validation Schema ---

/**
 * Defines validation rules for the signup form.
 */
const SignupSchema = Yup.object().shape({
    username: Yup.string()
        .min(3, 'Username must be at least 3 characters')
        .required('Username is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match') // Check against 'password'
        .required('Please confirm your password'),
    agreeToTerms: Yup.boolean().oneOf(
        [true],
        'You must accept the terms and conditions',
    ),
})

// --- The Component ---

export default function Signup() {
    const router = useRouter()

    /**
     * 4. Setup useMutation
     * Manages the API request lifecycle for signup.
     */
    const mutation = useMutation<
        SignupResponse,     // Type on success
        AxiosError<ApiError>, // Type on error
        SignupFormValues      // Type of variables
    >({
        mutationFn: signupUser,
        onSuccess: (data) => {
            // 5. Handle success
            console.log('Signup success:', data)
            alert('Account created successfully! Please log in.')
            router.push('/auth/login')
        },
        onError: (error) => {
            // 6. Handle error
            console.error('Signup error:', error)
            const message =
                error.response?.data?.message || error.message || 'Signup Failed'
            alert(message)
        },
    })

    /**
     * 7. Setup Formik
     * Manages form state, validation, and submission.
     */
    const formik = useFormik<SignupFormValues>({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            agreeToTerms: false,
        },
        validationSchema: SignupSchema, // Apply validation rules
        onSubmit: (values) => {
            // 8. On submit, call the mutation
            mutation.mutate(values)
        },
    })

    return (
        // Page container
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-950">
            <div className="max-w-md w-full space-y-8">
                {/* Here is the single merged box as requested.
          The header content and form are now children of the same card.
        */}
                <div className="bg-gray-900 rounded-xl shadow-lg p-8">
                    {/* Header Section (inside the box) */}
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
                        <h2 className="text-3xl font-bold text-white">
                            Create your account
                        </h2>
                        <p className="mt-2 text-gray-400">
                            Join Xplay and start streaming today
                        </p>
                    </div>

                    {/* Signup Form (inside the box) */}
                    {/* 9. Use formik.handleSubmit */}
                    <form className="space-y-6 mt-8" onSubmit={formik.handleSubmit}>
                        <div className="space-y-4">
                            {/* Username */}
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-300"
                                >
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Choose a username"
                                    // 10. Use formik.getFieldProps
                                    {...formik.getFieldProps('username')}
                                    className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                {/* 11. Show validation error */}
                                {formik.touched.username && formik.errors.username ? (
                                    <div className="text-red-400 text-sm mt-1">
                                        {formik.errors.username}
                                    </div>
                                ) : null}
                            </div>

                            {/* Email */}
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
                                    {...formik.getFieldProps('email')}
                                    className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                {formik.touched.email && formik.errors.email ? (
                                    <div className="text-red-400 text-sm mt-1">
                                        {formik.errors.email}
                                    </div>
                                ) : null}
                            </div>

                            {/* Password */}
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
                                    placeholder="Create a password"
                                    {...formik.getFieldProps('password')}
                                    className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                {formik.touched.password && formik.errors.password ? (
                                    <div className="text-red-400 text-sm mt-1">
                                        {formik.errors.password}
                                    </div>
                                ) : null}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-gray-300"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    {...formik.getFieldProps('confirmPassword')}
                                    className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                {formik.touched.confirmPassword &&
                                    formik.errors.confirmPassword ? (
                                    <div className="text-red-400 text-sm mt-1">
                                        {formik.errors.confirmPassword}
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="agreeToTerms"
                                    type="checkbox"
                                    {...formik.getFieldProps('agreeToTerms')}
                                    checked={formik.values.agreeToTerms}
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded bg-gray-800"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label
                                    htmlFor="agreeToTerms"
                                    className="text-gray-300"
                                >
                                    I agree to the{' '}
                                    <a
                                        href="#"
                                        className="text-purple-400 hover:text-purple-300"
                                    >
                                        Terms and Conditions
                                    </a>
                                </label>
                                {formik.touched.agreeToTerms && formik.errors.agreeToTerms ? (
                                    <div className="text-red-400 text-sm mt-1">
                                        {formik.errors.agreeToTerms}
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                // 12. Use mutation.isPending for loading state
                                disabled={mutation.isPending}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 transition-colors disabled:bg-purple-800 disabled:cursor-not-allowed"
                                suppressHydrationWarning={true}
                            >
                                {mutation.isPending ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </div>

                        {/* Link to Login */}
                        <div className="text-center">
                            <span className="text-gray-400">
                                Already have an account?{' '}
                            </span>
                            <Link
                                href="/auth/login"
                                className="text-purple-400 hover:text-purple-300 font-medium"
                            >
                                Sign in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

