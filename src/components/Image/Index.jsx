export default function Image({ src, alt, status, updateStatus,votes, counter,rounded }) {
    return (
        <div className="relative w-full h-full">
            {!counter && (
                    <>
                    <div class="absolute top-0 bg-white rounded-full w-10 h-10 flex justify-center items-center rounded-full">
  ❤️ {votes}
</div>
                    </>
                )}
            <img src={src} alt={alt} className={`w-full h-full object-cover ${rounded?'rounded-full':'rounded-lg'}`} />
            <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end  rounded-lg">
                
                {counter && (
                    <>
                <button
                    onClick={() => updateStatus('like')}
                    aria-label="Like"
                    className={`focus:outline-none rounded-full p-2 h-10 w-10 text-white ${
                        status === 'like' ? 'bg-gray-200' : 'bg-gray-200'
                    }`}
                >
                    {status === 'like' ? '❤️' : '🤍'}
                </button>
                <button
                    onClick={() => updateStatus('dislike')}
                    aria-label="Dislike"
                    className={`focus:outline-none rounded-full p-2 h-10 w-10 text-white ${
                        status === 'dislike' ? 'bg-gray-200' : 'bg-gray-200'
                    }`}
                >
                    {status === 'dislike' ? '❌' : '✖️'}
                </button>  </>
                )
                }
                
            </div>
        </div>
    );
}
