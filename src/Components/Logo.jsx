import React from 'react';

function Logo({ className = '' }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                />
            </svg>
            <span className="text-2xl font-bold text-white">
                Note<span className="text-blue-400">form</span>
            </span>
        </div>
    );
}

export default Logo;
