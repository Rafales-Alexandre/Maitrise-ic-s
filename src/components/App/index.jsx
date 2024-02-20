import { useState, useEffect } from "react";
import Image from "../Image/Index";
import { supabase } from '../../../supabaseClient';
import logo from "../../assets/Logo.jpeg"


export default function App() {
    const [status, setStatus] = useState({});
    const [images, setImages] = useState([]);

    const updateStatus = async (imageId, newStatus) => {
        const currentStatus = status[imageId];
    
        // Determine the change based on the new status and current status
        let voteChange = 0;
        if (currentStatus === newStatus) {
            // Toggle off - reversing the vote
            newStatus = '';
            voteChange = currentStatus === 'like' ? -1 : 1; // Reversing the vote
        } else {
            // Applying a new vote or switching from one to another
            if (newStatus === 'like') {
                voteChange = currentStatus === 'dislike' ? 2 : 1; // Switch from dislike to like or a fresh like
            } else if (newStatus === 'dislike') {
                voteChange = currentStatus === 'like' ? -2 : -1; // Switch from like to dislike or a fresh dislike
            }
        }
    
        // Optimistic update for a responsive UI
        setStatus(prev => ({ ...prev, [imageId]: newStatus }));
    
        // Directly update the local state to avoid re-fetching
        setImages(images => images.map(img => {
            if (img.id === imageId) {
                return {
                    ...img,
                    votes: (img.votes || 0) + voteChange,
                };
            }
            return img;
        }));
    
        // Update the database
        const imageToUpdate = images.find(img => img.id === imageId);
        const newVotes = (imageToUpdate.votes || 0) + voteChange;
    
        const { error } = await supabase
            .from('images')
            .update({ votes: newVotes })
            .match({ id: imageId });
    
        if (error) console.error('Error updating image status:', error);
    };
    
    

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
                const initialStatus = sortedData.reduce((acc, img) => ({...acc, [img.id]: ''}), {});
                setStatus(initialStatus);
            } else {
                console.error(error);
            }
        };
    
        fetchImages();
    }, []);
    

    return (
        <div className="bg-gradient-to-br from-gray-200 via-gray-400 to-gray-600 h-full flex justify-center items-center">
            <section className="">
                <div className="container px-4 space-y-12 lg:space-y-16">
                <div className="relative bg-gradient-to-r from-[#e8f2f3] to-[#cadce6] flex items-center justify-between h-20 rounded-full px-4">
    <img className="absolute left-0 h-20 rounded-full" src={logo} alt="" srcset="" /> 
    <h1 class="text-4xl font-bold tracking-tighter sm:text-3xl md:text-4xl text-center flex-grow">
       
                        Choisissez votre Icône préféré.
                        </h1>
                    </div>
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4 md:gap-10">
                        {images.map(image => (
                            <Image 
                                key={image.id}
                                src={image.url}
                                alt={image.title || 'Image'}
                                status={status[image.id]}
                                updateStatus={(newStatus) => updateStatus(image.id, newStatus)}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
