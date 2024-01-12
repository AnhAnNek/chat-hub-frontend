import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const LoadingButton = ({ content, onClick, isLoading }) => {
    return (
        <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={onClick}
            disabled={isLoading}
        >
            {isLoading ? (
                <>
                    <FontAwesomeIcon icon={faSpinner} size="xl" spin style={{ color: "#ffffff" }} />
                    <span className="ml-2">Loading...</span>
                </>
            ) : (
                <>{content}</>
            )}
        </button>
    );
};

export default LoadingButton;
