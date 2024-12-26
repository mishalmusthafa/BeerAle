import { useState, useEffect, useMemo } from 'react';
import StarRating from '../components/StarRating';
import { Search } from 'lucide-react';
import debounce from 'lodash/debounce';

function Home() {
    const [results, setResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Fetch data with error handling
    const fetchResult = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                'https://api.sampleapis.com/beers/ale'
            );
            if (!response.ok) {
                throw new Error(`HTTP Error! status:${response.status}`);
            }
            const data = await response.json();
            setResults(data);
        } catch (error) {
            setError(`Failed to fetch beers: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResult();
    }, []);

    // memoizing filter
    const filteredResult = useMemo(() => {
        if (!searchTerm.trim()) return [];
        return results.filter((result) =>
            result.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [results, searchTerm]);

    // Debounced search handler for better perfomance
    const debouncedSearch = debounce((value) => {
        setSearchTerm(value);
    }, 300);

    return (
        <div className="container mx-auto px-8 py-4 ">
            <h1 className="text-3xl font-bold mb-8 text-center">
                Explore Beer Ale
            </h1>
            {/* Search Bar */}
            <div className="flex justify-center mb-8">
                <div className="relative w-full max-w-2xl">
                    <input
                        type="text"
                        className="w-full pl-4 pr-12 h-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Search beers..."
                        onChange={(e) => debouncedSearch(e.target.value)}
                    />
                    <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>
            {/* Loading and Error states */}
            {loading && (
                <div className="flex justify-center">
                    <div className="animate-pulse text-lg">
                        Loading Beers...
                    </div>
                </div>
            )}
            {error && (
                <div className="flex justify-center">
                    <div className="animate-pusle text-lg text-red-500">
                        {error}
                    </div>
                </div>
            )}
            {/* Search and guidance */}
            {!searchTerm && !loading && (
                <div className="text-center text-gray-500 mb-8">
                    Start typing to search for beers
                </div>
            )}
            {/* Results*/}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredResult.map((result) => (
                    <div
                        key={result.id}
                        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                    >
                        {/* Product image */}
                        <div className="p-4">
                            <img
                                src={result.image || '/api/placeholder/400/400'}
                                alt={result.name}
                                className="w-full object-scale-down h-48"
                                loading="lazy"
                            />

                            {/* Product Info */}
                            <h3 className="mb-2 text-lg font-semibold line-clamp-2">
                                {result.name}
                            </h3>
                            {/* Product Pricing and rating */}
                            <div className="space-y-2">
                                <span className="text-yellow-500">
                                    <StarRating
                                        rating={result.rating.average.toFixed(
                                            1
                                        )}
                                    />
                                </span>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">
                                        {result.rating.reviews} Reviews
                                    </span>
                                    <span className="font-bold text-xl">
                                        {result.price}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* No Result found */}
            {searchTerm && filteredResult.length === 0 && !loading && (
                <div className="text-center text-gray-500 mt-8">
                    No beers found matching your search
                </div>
            )}
        </div>
    );
}

export default Home;
