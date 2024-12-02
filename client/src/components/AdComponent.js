import React from 'react';

const AdComponent = ({ adSlot }) => {
  return (
    <div className="ad-container" style={{ textAlign: 'center', padding: '20px', background: '#f5f5f5', margin: '20px 0' }}>
      <div style={{ fontStyle: 'italic', color: '#666' }}>
        Advertisement Space (Slot: {adSlot})
      </div>
    </div>
  );
};

export default AdComponent;