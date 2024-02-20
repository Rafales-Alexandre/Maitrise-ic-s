export default function Image({ src, alt, status, updateStatus }) {
    // Determine if the user has already voted
    const hasVoted = status === 'like' || status === 'dislike';

    return (
        <div className="relative w-full h-full">
            <img src={src} alt={alt} className="w-full h-full object-cover rounded-full" />
            <div className="absolute top-0 left-0 p-4 flex justify-between items-start w-full h-full">

            <button 
                    onClick={() => updateStatus('like')} 
                    aria-label="Like" 
                    className={`focus:outline-none rounded-full p-2 ${
                        status === 'like' ? 'bg-gray-200' : 'bg-gray-200'
                    }`}
                >
                    {status === 'like' ? '❤️' : '🤍'}
                </button>
                <button 
                    onClick={() => updateStatus('dislike')} 
                    aria-label="Dislike" 
                    className={`focus:outline-none rounded-full p-2 ${
                        status === 'dislike' ? 'bg-gray-200' : 'bg-gray-200'
                    }`}
                >
                    {status === 'dislike' ? '❌' : '✖️'}
                </button>
            </div>
        </div>
    );
}
