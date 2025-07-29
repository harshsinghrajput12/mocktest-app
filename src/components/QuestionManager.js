import React from 'react';

export default function QuestionManager({ onFileChange, onClear }) {
  return (
    <div>
      <h3>Upload Questions CSV</h3>
      <input type="file" accept=".csv" onChange={onFileChange} />
      <button onClick={onClear}>Clear All Questions</button>
    </div>
  );
}
