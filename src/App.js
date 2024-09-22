import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState('');

  // Set the website title to your roll number
  useEffect(() => {
    document.title = "RA2111008020144";
  }, []);

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async () => {
    setError('');
    setResponse(null);
    setSelectedOptions([]);

    try {
      const parsedInput = JSON.parse(jsonInput);
      const res = await axios.post('https://bajaj-backend-1-r5bj.onrender.com/bfhl', { 
        data: parsedInput.data, 
        file_b64: parsedInput.file_b64 || null // Make sure to include the base64 file if needed
      });
      console.log(res.data);
      setResponse(res.data);
    } catch (error) {
      setError('Invalid JSON input or Error fetching data');
    }
  };

  const handleOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOptions(prevOptions =>
      prevOptions.includes(value)
        ? prevOptions.filter(option => option !== value)
        : [...prevOptions, value]
    );
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    return (
      <div className="filtered-response">
        {selectedOptions.includes('numbers') && (
          <div>
            <h3>Numbers:</h3>
            <p>{response.numbers.join(', ')}</p>
          </div>
        )}
        {selectedOptions.includes('alphabets') && (
          <div>
            <h3>Alphabets:</h3>
            <p>{response.alphabets.join(', ')}</p>
          </div>
        )}
        {selectedOptions.includes('highest_lowercase_alphabet') && (
          <div>
            <h3>Highest Lowercase Alphabet:</h3>
            <p>{Array.isArray(response.highest_lowercase_alphabet) 
                ? response.highest_lowercase_alphabet.join(', ') 
                : response.highest_lowercase_alphabet}</p>
          </div>
        )}
        {selectedOptions.includes('file_valid') && (
          <div>
            <h3>File Valid:</h3>
            <p>{response.file_valid ? "Yes" : "No"}</p>
            {response.file_valid && (
              <>
                <h4>MIME Type:</h4>
                <p>{response.file_mime_type}</p>
                <h4>File Size (KB):</h4>
                <p>{response.file_size_kb}</p>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>{'RA2111008020144'}</h1>
      <input 
        type="text" 
        value={jsonInput} 
        onChange={handleInputChange} 
        placeholder='Enter JSON input' 
        className="json-input"
      />
      {error && <p className="error">{error}</p>}
      {response && (
        <div>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                value="alphabets"
                checked={selectedOptions.includes('alphabets')}
                onChange={handleOptionChange}
              />
              Alphabets
            </label>
            <label>
              <input
                type="checkbox"
                value="numbers"
                checked={selectedOptions.includes('numbers')}
                onChange={handleOptionChange}
              />
              Numbers
            </label>
            <label>
              <input
                type="checkbox"
                value="highest_lowercase_alphabet"
                checked={selectedOptions.includes('highest_lowercase_alphabet')}
                onChange={handleOptionChange}
              />
              Highest Lowercase Alphabet
            </label>
            {/* <label>
              <input
                type="checkbox"
                value="file_valid"
                checked={selectedOptions.includes('file_valid')}
                onChange={handleOptionChange}
              />
              File Valid
            </label> */}
          </div>
          {renderFilteredResponse()}
        </div>
      )}
      <button onClick={handleSubmit} className="submit-button">Submit</button>
    </div>
  );
}

export default App;
