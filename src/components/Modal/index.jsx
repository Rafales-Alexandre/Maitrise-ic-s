// Modal.jsx
import { Button, Modal } from 'flowbite-react';
import { useState } from 'react';
import Image from '../Image/Index'; // Assuming this is the path to your Image component

// If `status` and `updateStatus` are not globally available, they need to be passed as props too.
export default function MyModal({ topVotedImages, status, updateStatus }) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Button onClick={() => setOpenModal(true)}>Top 3</Button>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Top 3</Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 gap-1 md:grid-cols-3 md:gap-4">
            {topVotedImages.map((image, index) => {
              let borderColorClass = "";
              if (index === 0) borderColorClass = "border-2 md:border-8 border-gold";
              else if (index === 1) borderColorClass = "border-2 md:border-8 border-silver";
              else if (index === 2) borderColorClass = "border-2 md:border-8 border-bronze";

              return (
                <div key={image.id} className={`${borderColorClass} rounded-full p-1`}>
                  <Image
                    src={image.url}
                    alt={image.title || "Top Voted Image"}
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
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}