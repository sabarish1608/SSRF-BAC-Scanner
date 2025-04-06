import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBox.css"; // Import the CSS file
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap for styling

const SearchBox = () => {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!url.trim()) {
      alert("Please enter a valid URL");
      return;
    }

    fetch("http://127.0.0.1:8000/api/scan/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })
      .then((response) => response.json())
      .then((data) => {
        navigate("/dashboard", { state: { data } });
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to analyze the website. Please try again.");
      });
  };

  return (
    <div className="search-container glass-card">
      <div className="content">
        <h1 className="title">Website Vulnerability Analyzer</h1>
        <p className="description">
          Simply paste the website link and hit Search. Our dashboard will instantly display visual cues highlighting vulnerabilities, and you can easily download a comprehensive report.
        </p>
        <div className="input-group">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Enter website URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
