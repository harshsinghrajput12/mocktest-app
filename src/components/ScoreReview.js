import React from 'react';

export default function ScoreReview({ questions, answers }) {
  const correctCount = questions.reduce((acc, q, i) => (
    acc + (q.correct === answers[i] ? 1 : 0)
  ), 0);

  return (
    <div>
      <h3>Your Score: {correctCount} / {questions.length}</h3>
      {questions.map((q, i) => (
        <div key={i} style={{ marginBottom: '1em' }}>
          <p><strong>Q{i + 1}: {q.q}</strong></p>
          <p>Your Answer: {q.options[answers[i]] || "Not answered"}</p>
          <p>Correct Answer: {q.options[q.correct]}</p>
          <p><em>Explanation: {q.explanation}</em></p>
        </div>
      ))}
    </div>
  );
}
