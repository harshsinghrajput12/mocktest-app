import React from 'react';

export default function QuizPlayer({ question, index, total, selected, onAnswer }) {
  return (
    <div>
      <h3>Question {index + 1} of {total}</h3>
      <p>{question.q}</p>
      {question.options.map((opt, i) => (
        <button
          key={i}
          onClick={() => onAnswer(i)}
          style={{
            backgroundColor: selected === i ? 'lightblue' : 'white',
            margin: '5px'
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
