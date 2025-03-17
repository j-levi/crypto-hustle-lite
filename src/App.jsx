import React, { useEffect, useState } from "react";
import CoinInfo from "./Components/CoinInfo";
import SideNav from "./Components/SideNav";
import "./App.css";

const API_KEY = import.meta.env.VITE_APP_API_KEY;

function App() {
  const [list, setList] = useState(null);           // Full coin list from API
  const [filteredResults, setFilteredResults] = useState([]); 
  const [searchInput, setSearchInput] = useState(""); 
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false); 
  // ↑ Tracks whether the user has clicked the search button at least once

  // 1) Fetch the entire coin list once on mount
  useEffect(() => {
    const fetchAllCoinData = async () => {
      try {
        const response = await fetch(
          "https://min-api.cryptocompare.com/data/all/coinlist?api_key=" + API_KEY
        );
        const json = await response.json();
        setList(json);
      } catch (error) {
        console.error("Error fetching coin data:", error);
      }
    };
    fetchAllCoinData();
  }, []);

  // 2) Handle the search when the user clicks the "Search" button
  const handleSearch = () => {
    setSearchError(null);
    setSearchLoading(true);
    setHasSearched(true); // We know the user has tried to search now

    if (!list || !list.Data) {
      setSearchError("No coin data loaded yet.");
      setSearchLoading(false);
      return;
    }

    // If user didn't type anything, clear results
    if (searchInput.trim() === "") {
      setFilteredResults([]);
      setSearchLoading(false);
      return;
    }

    // Otherwise, filter the list
    try {
      const lowerSearch = searchInput.toLowerCase();
      const filteredData = Object.keys(list.Data).filter((coinKey) => {
        const symbolMatch = list.Data[coinKey].Symbol.toLowerCase().includes(lowerSearch);
        const nameMatch = list.Data[coinKey].FullName.toLowerCase().includes(lowerSearch);
        return symbolMatch || nameMatch;
      });
      setFilteredResults(filteredData);
    } catch (error) {
      setSearchError("Error filtering results.");
      console.error("Search error:", error);
    }
    setSearchLoading(false);
  };

  return (
    <div className="app-container">
      {/* Side navigation for scam info */}
      <SideNav />

      {/* Main content area */}
      <div className="whole-page">
        <h1>James Levi Z23677798 Crypto List</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Enter symbol or name"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {/* Show search status messages */}
        <div className="search-status">
          {searchLoading && <p>Loading search results...</p>}
          {searchError && <p>{searchError}</p>}
          {hasSearched && !searchLoading && !searchError && (
            <p>
              {filteredResults.length > 0
                ? `Found ${filteredResults.length} result(s).`
                : "No results found."}
            </p>
          )}
        </div>

        <ul>
          {/* Only render coin list if user has clicked search */}
          {hasSearched &&
            filteredResults.map((coinKey) => (
              <CoinInfo
                key={list.Data[coinKey].Symbol}
                image={list.Data[coinKey].ImageUrl}
                name={list.Data[coinKey].FullName}
                symbol={list.Data[coinKey].Symbol}
              />
            ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
