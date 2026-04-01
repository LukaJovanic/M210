import { useState } from "react";

const API_URL = "https://nmg2ran6xwtyxcyfhhdsb6lmai0alido.lambda-url.us-east-1.on.aws/"; // z.B. https://abc.lambda-url...

function App() {
  const [input, setInput] = useState("");
  const [data, setData] = useState([]);

  const add = async () => {
    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        kennzeichen: input
      })
    });

    setInput("");
  };

  const load = async () => {
    const res = await fetch(API_URL);
    const json = await res.json();
    setData(json);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Auto Verwaltung</h1>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Kennzeichen"
      />

      <button onClick={add}>Hinzufügen</button>
      <button onClick={load}>Laden</button>

      <ul>
        {data.map((item, i) => (
          <li key={i}>{item.Kennzeichen}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;