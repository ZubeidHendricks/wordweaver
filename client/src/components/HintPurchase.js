import React from 'react';
import axios from 'axios';

const HintPurchase = ({ setHints }) => {
  const purchaseHints = async (amount) => {
    try {
      // In a real app, you'd integrate with a payment processor here
      const { data } = await axios.post('/api/purchase/hints', { amount });
      setHints(prevHints => prevHints + data.hintsAdded);
    } catch (error) {
      console.error('Error purchasing hints:', error);
    }
  };

  return (
    <div className="hint-purchase">
      <h3>Purchase Hints</h3>
      <button onClick={() => purchaseHints(5)}>Buy 5 Hints</button>
      <button onClick={() => purchaseHints(10)}>Buy 10 Hints</button>
    </div>
  );
};

export default HintPurchase;