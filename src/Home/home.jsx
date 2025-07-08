import React, { useState,useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import "../Scss/home.scss";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const DictionaryApp = () => {
  const [word, setWord] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [translations, setTranslations] = useState({});
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));


  const translateWord = async (word, targetLang) => {
    try {
      const response = await fetch("https://libretranslate.de/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: word,
          source: "en",
          target: targetLang,
          format: "text",
        }),
      });

      const data = await response.json();
      return data.translatedText;
    } catch (error) {
      return null;
    }
  };

  const fetchWordData = async () => {
    if (!word.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");
    setTranslations({});

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      if (!response.ok) throw new Error("Word not found");
      const data = await response.json();
      setResult(data[0]);

      const urdu = await translateWord(word, "ur");
      const hindi = await translateWord(word, "hi");
      const spanish = await translateWord(word, "es");

      setTranslations({ urdu, hindi, spanish });
    } catch (err) {
      setError("Sorry, we couldn't find that word.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") fetchWordData();
  };

  return (
    <div className="dictionary-app">
      <div className="container">
        <div className="theme-toggle">
          <button onClick={toggleTheme}>
            {theme === "light" ? <MdDarkMode /> : <MdLightMode />} 
          </button>
        </div>
        <h1 className="title">📘 Dictionary</h1>

        <div className="search-bar">

           <input
            type="text"
            placeholder="Search for a word..."
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={fetchWordData}><CiSearch style={{fontWeight:"bolder",fontSize:"30px"}} /></button>
         {/* </div> */}
        </div>

        {loading && <p className="info">Loading...</p>}
        {error && <p className="error">{error}</p>}

        {result && (
          <div className="result-card">
            <div className="header">
              <h2>{result.word}</h2>
              {result.phonetics?.[0]?.audio && (
                <button
                  onClick={() => new Audio(result.phonetics[0].audio).play()}
                >
                  🔊
                </button>
              )}
            </div>
            <p className="phonetic">{result.phonetics?.[0]?.text}</p>

            {result.meanings.map((meaning, idx) => (
              <div className="meaning" key={idx}>
                <h4>{meaning.partOfSpeech}</h4>
                <ul>
                  {meaning.definitions.map((def, i) => (
                    <li key={i}>
                      {def.definition}
                      {def.example && (
                        <p className="example">"{def.example}"</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {translations.urdu && (
              <div className="translations">
                <h3>🌐 Translations</h3>
                <p>
                  <strong>Urdu:</strong> {translations.urdu}
                </p>
                <p>
                  <strong>Hindi:</strong> {translations.hindi}
                </p>
                <p>
                  <strong>Spanish:</strong> {translations.spanish}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DictionaryApp;
