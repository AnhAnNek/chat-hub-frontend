import React from 'react';

const LoadingSpinner = ({ loadingTitle }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full border-t-4 border-gray-500 border-opacity-25 h-12 w-12"></div>
            <div className="text-gray-500 text-sm mt-3 select-none">{loadingTitle}</div>
        </div>
    );
};

export default LoadingSpinner;