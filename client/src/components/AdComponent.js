import React from 'react';

const AdComponent = ({ adSlot }) => {
  return (
    <div>
      {/* Ad implementation will go here */}
      <div style={{ textAlign: 'center', padding: '20px', background: '#f5f5f5' }}>
        Advertisement Space (Slot: {adSlot})
      </div>
    </div>
  );
};

export default AdComponent;