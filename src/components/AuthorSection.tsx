import Image from "next/image";

export default function AuthorsSection() {
    const authors = [
        { id: 1, name: "Author One", image: "https://placehold.co/100x100/ec4899/ffffff?text=A1", featured: true },
        { id: 2, name: "Author Two", image: "https://placehold.co/100x100/84cc16/ffffff?text=A2", featured: false },
        { id: 3, name: "Author Three", image: "https://placehold.co/100x100/22d3ee/ffffff?text=A3", featured: false },
        { id: 4, name: "Author Four", image: "https://placehold.co/100x100/f59e0b/ffffff?text=A4", featured: false },
        { id: 5, name: "Author Five", image: "https://placehold.co/100x100/ef4444/ffffff?text=A5", featured: false },
        { id: 6, name: "Author Six", image: "https://placehold.co/100x100/6366f1/ffffff?text=A6", featured: false }
    ]

    return (
        <section>
            <SectionHeader title="Top authors" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {authors.map(author => (
                    <AuthorCard key={author.id} author={author} />
                ))}
            </div>
        </section>
    )
}

type SectionHeaderProps = {
    title: string;
};

function SectionHeader({ title }: SectionHeaderProps) {
    return (
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">{title}</h3>
            <a href="#" className="bg-gray-800 hover:bg-gray-700 text-sm px-4 py-2 rounded-full transition-colors">
                View all
            </a>
        </div>
    )
}

type Author = {
    id: number;
    name: string;
    image: string;
    featured: boolean;
};

type AuthorCardProps = {
    author: Author;
};

function AuthorCard({ author }: AuthorCardProps) {
    return (
        <div className="flex flex-col items-center">
            <Image unoptimized
                width={320}
                height={240}
                src={author.image}
                alt={author.name}
                className={`w-24 h-24 rounded-full border-4 ${author.featured ? 'border-purple-500' : 'border-transparent'}`}
            />
            <h4 className="font-semibold mt-2">{author.name}</h4>
        </div>
    )
}