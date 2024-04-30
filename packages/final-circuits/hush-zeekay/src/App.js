import React, { useState, useEffect } from 'react';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import circuit from './target/circuit.json';

import './App.css';

function App() {
  const [logs, setLogs] = useState([]);
  const [results, setResults] = useState([]);
  const [guessInput, setGuessInput] = useState('');

  useEffect(() => {
    const setup = async () => {
      await Promise.all([
        import("@noir-lang/noirc_abi").then(module =>
          module.default(new URL("@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm", import.meta.url).toString())
        ),
        import("@noir-lang/acvm_js").then(module =>
          module.default(new URL("@noir-lang/acvm_js/web/acvm_js_bg.wasm", import.meta.url).toString())
        )
      ]);
    };

    setup();
  }, []);

 
  const handleGuessSubmit = async () => {
    try {
      const backend = new BarretenbergBackend(circuit);
      const noir = new Noir(circuit, backend);
      const x = parseInt(guessInput);
      const input = [[10,20,30,40],[ 95,  83, 192, 255,   7, 186,  93, 154,
        51,  14, 104, 201,  93, 171, 177, 169,
       188,  73, 226, 159, 158, 213,  63, 111,
       167, 198, 217, 154, 187,   0,   0,  80]];  
      setLogs([...logs, 'Generating proof... ⌛']);
      const proof = await noir.prove(input); // Use the prove method instead of generateProof
      setLogs([...logs, 'Generating proof... ✅']);
      setResults([...results, proof]);
  
      setLogs([...logs, 'Verifying proof... ⌛']);
      const verification = await noir.verifyProof(proof);
      if (verification) {
        setLogs([...logs, 'Verifying proof... ✅']);
      }
    } catch (err) {
      setLogs([...logs, 'Oh 💔 Wrong guess']);
      console.log(err);
    }
  };
  

  return (
    <div className="App">
      <h1>Noir app</h1>
      <div className="input-area">
        <input 
          type="number" 
          placeholder="Enter your guess" 
          value={guessInput}
          onChange={(e) => setGuessInput(e.target.value)}
        />
        <button onClick={handleGuessSubmit}>Submit Guess</button>
      </div>
      <div className="outer">
        <div id="logs" className="inner">
          <h2>Logs</h2>
          {logs.map((log, index) => (
            <p key={index}>{log}</p>
          ))}
        </div>
        <div id="results" className="inner">
          <h2>Proof</h2>
          {results.map((result, index) => (
            <p key={index}>{result}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
