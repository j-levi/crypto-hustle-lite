import React, { useEffect, useState } from "react";

const CryptoScam = () => {
  const [scamList, setScamList] = useState(null);
  const [scamError, setScamError] = useState(null);

  useEffect(() => {
    const getScams = async () => {
      try {
        const response = await fetch("https://api.cryptoscamdb.org/v1/featured");
        const json = await response.json();
        setScamList(json);
      } catch (error) {
        setScamError("Error fetching scam data.");
        console.error("Scam fetch error:", error);
      }
    };
    getScams().catch(console.error);
  }, []);

  if (scamError) {
    return (
      <div>
        <h2>Recent Crypto Scams</h2>
        <p>{scamError}</p>
      </div>
    );
  }

  if (!scamList) {
    return (
      <div>
        <h2>Recent Crypto Scams</h2>
        <p>Loading scam data...</p>
      </div>
    );
  }

  if (!scamList.result || scamList.result.length === 0) {
    return (
      <div>
        <h2>Recent Crypto Scams</h2>
        <p>No scam data available.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Recent Crypto Scams</h2>
      <p>Coins/platforms involved in recent crypto-related scams:</p>
      <ul className="side-list">
        {scamList.result.map((scam) => (
          <li key={scam.name}>{scam.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CryptoScam;
