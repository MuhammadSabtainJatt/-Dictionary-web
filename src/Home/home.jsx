import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faVolumeUp, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'; // Import necessary icons

export default function Home() {
  const [word, setWord] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setWord(e.target.value);
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
        setResult(data);
        setError(null);
      })
      .catch((error) => {
        setResult(null);
        setError(error.message);
      });
  };

  const handleAudioClick = (audioUrl) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  return (
    <div className="main bg-warning">
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
              className="mt-5 p-2 w-75 shadow  rounded-5"
              style={{ backgroundColor: 'transparent',border:"none" }}
              value={word}
              onChange={handleChange}
            />
            <button
              className="btn  p-2 shadow  rounded-5 text-dark" style={{border:"none"}}
              onClick={handleSubmit}
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>
        {error && (
          <div className="row">
            <div className="col text-center">
              <p className="text-danger"><img src="https://vectorified.com/images/no-data-icon-10.png" width={400} alt="" /></p>
              
            </div>
          </div>
        )}
        {result && result.length > 0 && (
          <div className="row">
            <div className="col">
              {result.map((entry, index) => (
                <div key={index}>
                  <h2>{entry.word}</h2>
                  {entry.meanings && entry.meanings.map((meaning, meaningIndex) => (
                    <div key={meaningIndex}>
                      <h3>{meaning.partOfSpeech}</h3>
                      <ul>
                        {meaning.definitions && meaning.definitions.map((definition, definitionIndex) => (
                          <li key={definitionIndex}>
                            <strong>Definition:</strong> {definition.definition}<br />
                            {definition.example && <span><strong>Example:</strong> {definition.example}</span>}
                          </li>
                        ))}
                      </ul>
                      {meaning.phonetics && meaning.phonetics.map((phonetic, phoneticIndex) => (
                        <button
                          key={phoneticIndex}
                          className="btn btn-danger"
                          onClick={() => handleAudioClick(phonetic.audio)}
                        >
                          <FontAwesomeIcon icon={faVolumeUp} />
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
