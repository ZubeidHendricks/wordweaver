import React from 'react';
import AdSense from 'react-adsense';

const AdComponent = ({ adSlot }) => {
  return (
    <AdSense.Google
      client='ca-pub-3043747446376015' 
      slot={adSlot}
      style={{ display: 'block' }}
      format='auto'
      responsive='true'
    />
  );
};

export default AdComponent;