import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Inter', sans-serif;
    margin: 0;
    background: linear-gradient(115deg, #24243e, #302b63, #0f0c29);
    color: #f3f8fa;
    min-height: 100vh;
  }
`;

const Container = styled.div`display: flex; justify-content: center; padding: 40px 0; min-height: 100vh;`;
const LeftPanel = styled.div`
  background: rgba(20,24,36,0.97); border-radius: 20px; padding: 32px;
  box-shadow: 0 10px 32px rgba(10,0,48,0.15); width: 58%;
  min-width: 360px; max-width: 540px; position: relative;
`;
const RightPanel = styled.div`
  width: 240px; background: rgba(20,20,50,0.91); border-radius: 20px;
  padding: 28px 20px; box-shadow: 0 4px 26px rgba(20,46,70,0.22);
  display:flex; flex-direction:column; align-items:center;
`;

const sampleQuestions = [
  {
    text: "Which planet is known as the Red Planet?",
    options: ["Earth", "Venus", "Mars", "Jupiter"],
    correct: 2
  },
  {
    text: "What is the chemical symbol for water?",
    options: ["CO2", "O2", "H2O", "NaCl"],
    correct: 2
  },
  {
    text: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "Shakespeare", "J.K. Rowling", "Mark Twain"],
    correct: 1
  },
];

function useCountdown(seconds, onEnd) {
  const [time, setTime] = useState(seconds);
  useEffect(() => {
    if (time <= 0) { onEnd && onEnd(); return; }
    const t = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(t);
  }, [time]);
  return time;
}

export default function App() {
  const [questions] = useState(sampleQuestions);
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [reviewed, setReviewed] = useState([]);
  const timerLimit = 5 * 60;
  const timeLeft = useCountdown(timerLimit, () => setShowResult(true));

  useEffect(() => {
    setAnswers(questions.map(() => ({ answerIdx: null, status: null })));
  }, [questions.length]);

  function selectOption(optIdx) {
    setAnswers(ans => ans.map((a, i) => i === current ? { ...a, answerIdx: optIdx, status: "answer" } : a));
  }

  function handleSaveNext() {
    if (answers[current].answerIdx === null)
      setAnswers(ans => ans.map((a, i) => i === current ? { ...a, status: "not-answer" } : a));
    setCurrent(c => Math.min(c + 1, questions.length - 1));
  }

  function handleMarkReview() {
    setReviewed(r => r.includes(current) ? r : [...r, current]);
    setAnswers(ans => ans.map((a, i) => i === current ? { ...a, status: "review" } : a));
    setCurrent(c => Math.min(c + 1, questions.length - 1));
  }

  function handlePrev() {
    setCurrent(c => Math.max(0, c - 1));
  }

  function paletteState(idx) {
    if (showResult) return answers[idx]?.status;
    if (reviewed.includes(idx)) return "review";
    return answers[idx].status;
  }

  const q = questions[current];

  if (showResult) {
    const score = answers.reduce((acc, ans, i) =>
      ans.answerIdx === questions[i].correct ? acc + 1 : acc, 0);

    return (
      <Container>
        <LeftPanel as={motion.div}
          initial={{ y: 70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 70 }}
        >
          <h2>Quiz Result</h2>
          <p>Total Questions: {questions.length}</p>
          <p>Answered: {answers.filter(a => a.answerIdx !== null).length}</p>
          <p>Marked for Review: {answers.filter(a => a.status === 'review').length}</p>
          <p style={{ color: "#7dffae", fontSize: "1.2rem", marginTop: "10px" }}>
            Score: {score} / {questions.length}
          </p>
          <button onClick={() => window.location.reload()}>Restart</button>
        </LeftPanel>
      </Container>
    );
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <LeftPanel>
          <h2>Question {current + 1}</h2>
          <AnimatePresence exitBeforeEnter>
            <motion.div
              key={current}
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 70 }}
            >
              <p>{q.text}</p>
              {q.options.map((opt, i) => (
                <div key={i}>
                  <label>
                    <input
                      type="radio"
                      checked={answers[current]?.answerIdx === i}
                      onChange={() => selectOption(i)}
                    />
                    {opt}
                  </label>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
          <button onClick={handlePrev} disabled={current === 0}>Previous</button>
          <button onClick={handleSaveNext}>Save & Next</button>
          <button onClick={handleMarkReview}>Mark for Review</button>
        </LeftPanel>

        <RightPanel>
          <p>Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>
          <h3>Question Palette</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            {questions.map((_, idx) => (
              <button
                key={idx}
                style={{
                  width: 30, height: 30,
                  backgroundColor: paletteState(idx) === "answer" ? "green" :
                    paletteState(idx) === "not-answer" ? "red" :
                      paletteState(idx) === "review" ? "orange" : "lightgray"
                }}
                onClick={() => setCurrent(idx)}
              >{idx + 1}</button>
            ))}
          </div>
          <button onClick={() => setShowResult(true)} style={{ marginTop: 20 }}>
            Submit Test
          </button>
        </RightPanel>
      </Container>
    </>
  );
}
