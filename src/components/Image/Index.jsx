export default function Image({ src, alt, status, updateStatus }) {
    return (
        <div className="relative w-full h-full">
            <img src={src} alt={alt} className="w-full h-full object-cover rounded-lg" />
            <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end bg-gradient-to-t from-black to-transparent rounded-lg">
                <button
                    onClick={() => updateStatus('like')}
                    aria-label="Like"
                    className={`focus:outline-none rounded-full p-2 h-20 text-white ${
                        status === 'like' ? 'bg-gray-200' : 'bg-gray-200'
                    }`}
                >
                    {status === 'like' ? '❤️' : '🤍'}
                </button>
                <button
                    onClick={() => updateStatus('dislike')}
                    aria-label="Dislike"
                    className={`focus:outline-none rounded-full p-2 text-white ${
                        status === 'dislike' ? 'bg-gray-200' : 'bg-gray-200'
                    }`}
                >
                    {status === 'dislike' ? '❌' : '✖️'}
                </button>
            </div>
        </div>
    );
}
