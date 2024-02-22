import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'; // Import the search icon from FontAwesome

export default function Home() {
  const [word, setWord] = useState('');
  const [result, setResult] = useState(null); // State to store the API result
  const [error, setError] = useState(null); // State to store error messages, if any

  const handleChange = (e) => {
    setWord(e.target.value); // Update the word state as the user types
  };

  const handleSubmit = () => {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Word not found');
        }
        return response.json();
      })
      .then((data) => {
        setResult(data); // Store the API result in the result state
        setError(null); // Clear any previous error messages
      })
      .catch((error) => {
        setResult(null); // Clear the result state
        setError(error.message); // Store the error message
      });
  };

  return (
    <div className="main bg-info">
      <div className="container">
        <div className="row">
          <div className="col mt-4 text-center">
            <h1 style={{ fontFamily: "'Brush Script MT', cursive", fontSize: '90px' }}>Dictionary</h1>
            <div className="image rounded-5 mt-3"></div>
          </div>
        </div>
        <div className="row">
          <div className="col text-center">
            <input
              type="text"
              name="word"
              placeholder="Enter Word"
              className="mt-5 p-2 w-75 shadow border rounded-5"
              style={{ backgroundColor: 'transparent' }}
              value={word} // Bind the value of the input field to the word state
              onChange={handleChange} // Handle input changes
            />
            <button
              className="btn btn-danger p-2 shadow border rounded-5 text-dark"
              onClick={handleSubmit} // Handle form submission
            >
              <FontAwesomeIcon icon={faSearch} /> {/* Display the search icon */}
            </button>
          </div>
        </div>
        {error && <p className="text-danger">{error}</p>} {/* Display error messages, if any */}
        {result && (
          <div className="row">
            <div className="col text-center">
              {/* Display the dictionary result */}
              {/* You need to implement rendering of the result based on the API response */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
