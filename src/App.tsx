import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

function App() {
  const [html, setHtml] = useState('');
  const [status, setStatus] = useState('');

  const handleSave = async () => {
    const res = await fetch('/api/save-template.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: 'template1.json',
        content: html,
      }),
    });
    const result = await res.json();
    setStatus(result.status || '保存完了');
  };

  const handleLoad = async () => {
    const res = await fetch('/api/load-template.php?filename=template1.json');
    const result = await res.json();
    setHtml(result.content || '');
    setStatus('読み込み完了');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', padding: 20, boxSizing: 'border-box' }}>
      {/* 左：エディタ */}
      <div style={{ flex: 1, marginRight: 20 }}>
        <h2>HTMLエディター</h2>
        <textarea
          style={{ width: '100%', height: '80%' }}
          value={html}
          onChange={(e) => setHtml(e.target.value)}
        />
        <div style={{ marginTop: 10 }}>
          <button onClick={handleSave}>💾 保存</button>
          <button onClick={handleLoad} style={{ marginLeft: 10 }}>📂 読み込み</button>
        </div>
        <p>{status}</p>
      </div>

      {/* 右：プレビュー */}
      <div style={{ flex: 1, borderLeft: '1px solid #ccc', paddingLeft: 20 }}>
        <h2>プレビュー</h2>
        <div
          style={{
            border: '1px solid #ddd',
            padding: 10,
            minHeight: '80%',
            backgroundColor: '#f9f9f9',
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}

export default App;
