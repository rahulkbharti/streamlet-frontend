import Link from "next/link"

export default function Sidebar() {
    return (
        <aside className="w-20 bg-[#121212] p-4 flex flex-col items-center space-y-8 sticky top-0 h-screen">
            {/* Logo */}
            <div className="w-8 h-8">
                <Link href="/">
                    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M20 0L25.8779 14.1221L40 20L25.8779 25.8779L20 40L14.1221 25.8779L0 20L14.1221 14.1221L20 0Z"
                            fill="url(#paint0_linear_10_2)"
                        />
                        <defs>
                            <linearGradient id="paint0_linear_10_2" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#A855F7" />
                                <stop offset="1" stopColor="#6D28D9" />
                            </linearGradient>
                        </defs>
                    </svg>
                </Link>
            </div>

            {/* Sidebar Icons */}
            <nav className="flex flex-col items-center space-y-6">
                <Link href="/" className="p-3 bg-purple-600/20 text-purple-400 rounded-lg">
                    <HomeIcon />
                </Link>
                <a href="/upload" className="p-3 text-gray-400 hover:bg-gray-700/50 rounded-lg transition-colors">
                    <PlusIcon />
                </a>
                {/* <Link href="#" className="p-3 text-gray-400 hover:bg-gray-700/50 rounded-lg transition-colors">
                    <ChartIcon />
                </Link>
                <Link href="#" className="p-3 text-gray-400 hover:bg-gray-700/50 rounded-lg transition-colors">
                    <StarIcon />
                </Link> */}
            </nav>
        </aside>
    )
}

// Icon Components
function HomeIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    )
}

function PlusIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
    )
}

// function ChartIcon() {
//     return (
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
//         </svg>
//     )
// }

// function StarIcon() {
//     return (
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
//         </svg>
//     )
// }