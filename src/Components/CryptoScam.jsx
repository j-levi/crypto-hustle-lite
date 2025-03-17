import React, { useEffect, useState } from "react";

const CryptoScam = () => {
  const [scamList, setScamList] = useState(null);

  useEffect(() => {
    const getScams = async () => {
      try {
        const response = await fetch("https://api.cryptoscamdb.org/v1/featured");
        const json = await response.json();
        setScamList(json);
      } catch (error) {
        console.error(error);
      }
    };
    getScams().catch(console.error);
  }, []);

  return (
    <div>
      <h2>Recent Crypto Scams</h2>
      <p>
        Here is a list of coins and platforms involved in recent crypto-related scams:
      </p>
      <ul className="side-list">
        {scamList && scamList.result ? (
          scamList.result.map((scam) => (
            <li key={scam.name}>{scam.name}</li>
          ))
        ) : (
          <li>Loading...</li>
        )}
      </ul>
    </div>
  );
};

export default CryptoScam;
