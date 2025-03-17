import React, { useEffect, useState } from "react";
import CoinInfo from "./Components/CoinInfo";
import SideNav from "./Components/SideNav";
import "./App.css";

const API_KEY = import.meta.env.VITE_APP_API_KEY;

function App() {
  const [list, setList] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");

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
        console.error(error);
      }
    };
    fetchAllCoinData();
  }, []);

  // Search function to filter coins by symbol or full name
  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    if (searchValue !== "" && list) {
      const filteredData = Object.keys(list.Data).filter((coinKey) =>
        list.Data[coinKey].Symbol.toLowerCase().includes(searchValue.toLowerCase()) ||
        list.Data[coinKey].FullName.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredResults(filteredData);
    } else if (list) {
      setFilteredResults(Object.keys(list.Data));
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
