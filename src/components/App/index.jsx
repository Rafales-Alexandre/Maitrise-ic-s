import { useState, useEffect } from "react";
import Image from "../Image/Index";
import { supabase } from '../../../supabaseClient';
import logo from "../../assets/Logo.jpeg";
import Cookies from 'js-cookie'; // Make sure to install js-cookie

export default function App() {
    const [status, setStatus] = useState({});
    const [images, setImages] = useState([]);

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

    return (
        <div className="bg-gradient-to-br from-gray-200 via-gray-400 to-gray-600 h-full flex justify-center items-center">
            <section>
                <div className="container px-4 space-y-12 lg:space-y-16">
                    <div className="relative bg-gradient-to-r from-[#e8f2f3] to-[#cadce6] flex items-center justify-between h-20 rounded-full px-4">
                        <img className="absolute left-0 h-20 rounded-full" src={logo} alt="" />
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-3xl md:text-4xl text-center flex-grow">
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
