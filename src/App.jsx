import React, { useEffect, useState } from "react";
import CoinInfo from "./Components/CoinInfo";
import SideNav from "./Components/SideNav";
import "./App.css";

const API_KEY = import.meta.env.VITE_APP_API_KEY;

function App() {
  const [list, setList] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Fetch list of coins on component mount
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

  // Search function to filter coins by symbol or full name
  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    setSearchError(null);
    setSearchLoading(true);

    if (searchValue !== "" && list) {
      // Simulate a short delay to display a loading state
      setTimeout(() => {
        try {
          const filteredData = Object.keys(list.Data).filter((coinKey) =>
            list.Data[coinKey].Symbol.toLowerCase().includes(searchValue.toLowerCase()) ||
            list.Data[coinKey].FullName.toLowerCase().includes(searchValue.toLowerCase())
          );
          setFilteredResults(filteredData);
        } catch (error) {
          setSearchError("Error filtering results.");
          console.error("Search error:", error);
        }
        setSearchLoading(false);
      }, 500);
    } else if (list) {
      setFilteredResults(Object.keys(list.Data));
      setSearchLoading(false);
    }
  };

  return (
    <div className="app-container">
      <SideNav />
      <div className="whole-page">
        <h1>My Crypto List</h1>
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => searchItems(e.target.value)}
        />
        {searchInput && (
          <div className="search-status">
            {searchLoading && <p>Loading search results...</p>}
            {searchError && <p>{searchError}</p>}
            {!searchLoading && !searchError && (
              <p>
                {filteredResults.length > 0
                  ? `Found ${filteredResults.length} result(s).`
                  : "No results found."}
              </p>
            )}
          </div>
        )}
        <ul>
          {list &&
            (searchInput.length > 0
              ? filteredResults.map((coin) =>
                  list.Data[coin].PlatformType === "blockchain" ? (
                    <CoinInfo
                      key={list.Data[coin].Symbol}
                      image={list.Data[coin].ImageUrl}
                      name={list.Data[coin].FullName}
                      symbol={list.Data[coin].Symbol}
                    />
                  ) : null
                )
              : Object.keys(list.Data).map((coin) =>
                  list.Data[coin].PlatformType === "blockchain" ? (
                    <CoinInfo
                      key={list.Data[coin].Symbol}
                      image={list.Data[coin].ImageUrl}
                      name={list.Data[coin].FullName}
                      symbol={list.Data[coin].Symbol}
                    />
                  ) : null
                ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
