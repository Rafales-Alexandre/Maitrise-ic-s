import { useState, useEffect } from "react";
import Image from "../Image/Index";
import { supabase } from '../../../supabaseClient';
import logo from "../../assets/Logo.jpeg";
import Cookies from 'js-cookie'; // Make sure to install js-cookie

export default function App() {
    const [status, setStatus] = useState({});
    const [images, setImages] = useState([]);
    const [showTopVoted, setShowTopVoted] = useState(false);
    useEffect(() => {
        const fetchImages = async () => {
            let { data, error } = await supabase
                .from('images')
                .select('*');
                
            if (data) {
                // Sort images by id in ascending order
                const sortedData = data.sort((a, b) => a.id - b.id);
                setImages(sortedData);

                // Initialize status state
                const savedStatus = Cookies.get('imageStatus');
                const initialStatus = savedStatus ? JSON.parse(savedStatus) : sortedData.reduce((acc, img) => ({...acc, [img.id]: ''}), {});
                setStatus(initialStatus);
            } else {
                console.error(error);
            }
        };
    
        fetchImages();
    }, []);

    const updateStatus = async (imageId, newStatus) => {
        const currentStatus = status[imageId];
        let voteChange = 0;
        if (currentStatus === newStatus) {
            newStatus = '';
            voteChange = currentStatus === 'like' ? -1 : 1;
        } else {
            if (newStatus === 'like') {
                voteChange = currentStatus === 'dislike' ? 2 : 1;
            } else if (newStatus === 'dislike') {
                voteChange = currentStatus === 'like' ? -2 : -1;
            }
        }

        setStatus(prev => {
            const updatedStatus = { ...prev, [imageId]: newStatus };
            Cookies.set('imageStatus', JSON.stringify(updatedStatus), { expires: 30 }); // Save status in cookies
            return updatedStatus;
        });

        setImages(images => images.map(img => {
            if (img.id === imageId) {
                return {
                    ...img,
                    votes: (img.votes || 0) + voteChange,
                };
            }
            return img;
        }));

        const imageToUpdate = images.find(img => img.id === imageId);
        const newVotes = (imageToUpdate.votes || 0) + voteChange;

        const { error } = await supabase
            .from('images')
            .update({ votes: newVotes })
            .match({ id: imageId });

        if (error) console.error('Error updating image status:', error);
    };

    const toggleShowTopVoted = () => {
        setShowTopVoted(!showTopVoted);
    };

    // Find top 3 voted images
    const topVotedImages = images.slice().sort((a, b) => (b.votes || 0) - (a.votes || 0)).slice(0, 3);

    return (
        <div className="bg-gradient-to-br from-gray-200 via-gray-400 to-gray-600 h-full flex justify-center items-center">
            <section>
                <div className="container px-4 space-y-12 lg:space-y-16">
                    <div className="relative bg-gradient-to-r from-[#e8f2f3] to-[#cadce6] flex items-center justify-between h-20 rounded-full px-4">
                        <img className="absolute left-0 h-12 sm:h-20 rounded-full" src={logo} alt="" />
                        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter text-center flex-grow z-10 w-1/2">
    Choisissez votre icône préféré.
</h1>
<button 
  onClick={toggleShowTopVoted} 
  className="absolute right-0 w-10 h-10 sm:w-20 sm:h-20 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-lg z-20"
>
  Top 3
</button>


                    </div>
                    {showTopVoted && (
  <div className="absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-75 flex flex-col items-center justify-center z-50">
      <h2 className="text-2xl font-bold mb-4">Top 3</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topVotedImages.map((image, index) => {
              let borderColorClass = '';
              if (index === 0) borderColorClass = 'border-8 border-gold'; // Gold border for 1st
              else if (index === 1) borderColorClass = 'border-8 border-silver'; // Silver border for 2nd
              else if (index === 2) borderColorClass = 'border-8 border-bronze'; // Bronze border for 3rd

              return (
                  <div className={`${borderColorClass} rounded-full`}>
                      <Image 
                          key={image.id}
                          src={image.url}
                          alt={image.title || 'Top Voted Image'}
                          status={status[image.id]}
                          updateStatus={(newStatus) => updateStatus(image.id, newStatus)}
                          counter={false}
                          votes={image.votes}
                          rounded={true}
                      />
                  </div>
              );
          })}
      </div>
      <button onClick={toggleShowTopVoted} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-full">
          Close
      </button>
  </div>
)}

                    <div className="grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4 md:gap-10">
                        {images.map(image => (
                            <Image 
                                key={image.id}
                                src={image.url}
                                alt={image.title || 'Image'}
                                status={status[image.id]}
                                updateStatus={(newStatus) => updateStatus(image.id, newStatus)}
                                counter={true}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
