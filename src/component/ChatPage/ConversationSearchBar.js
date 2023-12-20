import {useState} from "react";

const ConversationSearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (event) => {
        const term = event.target.value.trim();
        setSearchTerm(term);
    }

    const handleSearch = () => {
        onSearch(searchTerm);
    }

    return (
        <div className="relative">
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleInputChange}
                className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                onClick={handleSearch}
            >
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-5.2-5.2"/>
                    <circle cx="10" cy="10" r="8" />
                </svg>
            </div>
        </div>
    );
}

export default ConversationSearchBar;