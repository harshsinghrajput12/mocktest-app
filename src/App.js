import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

// Demo data: Replace this with your fetch
const sampleQuestions = [
  {
    text: "Which planet is known as the Red Planet?",
    options: ["Earth", "Venus", "Mars", "Jupiter"],
  },
  {
    text: "What is the chemical symbol for water?",
    options: ["CO2", "O2", "H2O", "NaCl"],
  },
  {
    text: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "Shakespeare", "J.K. Rowling", "Mark Twain"],
  },
  // Add more questions...
];

// ---------- Styled Components ----------
const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Inter', 'Roboto', Arial, sans-serif;
    margin: 0;
    background: linear-gradient(115deg, #24243e 0%, #302b63 47%, #0f0c29 100%);
    color: #f3f8fa;
    min-height: 100vh;
  }
`;
const Container = styled.div`
  display: flex; justify-content: center; padding: 40px 0;
  min-height: 100vh;
`;
const LeftPanel = styled.div`
  background: rgba(20,24,36,0.97); border-radius: 20px; padding: 32px 32px 0 32px;
  box-shadow: 0 10px 32px rgba(10,0,48,0.15);
  width: 58%; margin-right: 5%;
  min-width: 360px; max-width: 540px;
  position: relative;
`;
const RightPanel = styled.div`
  width: 240px; background: rgba(20,20,50,0.91);
  border-radius: 20px; padding: 28px 20px;
  box-shadow: 0 4px 26px rgba(20,46,70,0.22);
  display:flex; flex-direction:column; align-items:center;
  min-width:220px;
`;
const Logo = styled.h1`
  font-family: 'Orbitron', 'Montserrat', sans-serif;
  color: #31C491;
  margin: 0 0 16px 0; font-size: 2.2rem; letter-spacing: 2px;
  text-shadow: 0 3px 18px #181854;
`;
const Timer = styled.div`
  font-family: 'JetBrains Mono', monospace; font-size: 1.9rem;
  margin-bottom: 22px;
  color: ${({ remaining }) => (remaining < 61 ? "#ff2c5f" : "#31c491")};
  background: rgba(10,40,24,0.26); border-radius: 10px;
  padding: 5px 20px; box-shadow:0 0 4px #26632b44;
  transition: color 0.3s;
`;
const QuestionNo = styled.div`
  font-size: 1rem; color: #49d9e6;
  letter-spacing:1px; margin-bottom: 10px;
`;
const QuestionText = styled.div`
  font-size: 1.36rem; margin-bottom: 28px;
  font-weight:600; color:#f2fbff;
`;

const OptionLabel = styled.label`
  display: flex; align-items: center; margin-bottom: 15px;  
  padding: 12px 16px; border-radius: 10px;
  background: ${({ checked }) => checked ? "#2d7b60" : "rgba(50,50,70,0.29)"};
  color: ${({ checked }) => checked ? "#fff" : "#eaffd6"};
  border: 2px solid ${({ checked }) => checked ? "#31c491" : "transparent"};
  transition: background 0.22s, border 0.22s, color 0.2s;
  cursor: pointer;
  font-family: inherit;
  font-size: 1.08rem;
  box-shadow: ${({ checked }) => checked ? "0 2px 15px #32dfa6bd" : "none"};
`;

const OptionRadio = styled.input`
  margin-right: 14px;
  accent-color: #31c491;
  transform: scale(1.26);
`;

const NavButtons = styled.div`
  display: flex; justify-content: space-between;
  margin: 33px 0 42px 0; gap:12px;
`;
const NavBtn = styled.button`
  flex:1; padding: 12px 0;
  border-radius: 8px;
  margin-left: ${p => p.left ? "0" : "7px"};
  border: none; font-size: 1.07rem;
  font-weight: 600; background: #31c491;
  color: #060f07; box-shadow: 0 2px 8px #2b746011;
  cursor: pointer; transition: background 0.22s;
  &:hover { filter: brightness(1.15); background: #56e3a7; }
  &:disabled{background:#355b45;color: #8ed3be;cursor: not-allowed;}
`;

const PaletteGrid = styled.div`
  display: grid; grid-gap: 9px 12px;
  grid-template-columns: repeat(5, 1fr);
  margin: 18px 0 26px 0;
`;
const PaletteDot = styled.div`
  width: 34px; height: 34px; border-radius: 7px;
  background: ${({ state }) => (
      state==="answer" ? "linear-gradient(122deg,#1fcc81 74%,#31c491 94%)" :
      state==="not-answer" ? "linear-gradient(110deg,#f1426f,#a91a58 80%)" :
      state==="review" ? "linear-gradient(72deg,#fde960 60%,#ffb56a 90%)" :
      "linear-gradient(132deg,#e4e6e8, #d0e5e7 90%)"
  )};
  color: ${({ state }) => (["answer","review"].includes(state) ? "#060f07" : "#24243e")};
  display:flex; align-items:center; justify-content:center;
  font-weight:bold; font-size:1.03rem;
  cursor: pointer; user-select: none;
  box-shadow:0 3px 12px #0e203a26;
  border: ${({current})=>current ? "3px solid #49d9e6" : "3px solid transparent"};
  transition: border 0.19s;
`;
const LegendRow = styled.div`
  font-size: 0.98rem; margin: 3px 0 14px 0;
  display: flex; align-items: center; gap:10px;
`;

const SubmitBtn = styled.button`
  width:100%; font-size:1.13rem;
  font-weight: 700; border-radius:8px;
  background: linear-gradient(104deg,#38eebb,#29a778 85%);
  color:#002815;border:none; padding:14px 0; margin-top:18px;
  cursor:pointer; transition: background 0.19s;
  &:hover{ background:linear-gradient(104deg,#65efdb,#5ec784 85%);}
`;

// ------------ Timer Component ------------
function useCountdown(seconds, onEnd) {
  const [time, setTime] = useState(seconds);
  useEffect(() => {
    if(time<=0) { onEnd && onEnd(); return; }
    const t = setTimeout(()=>setTime(time-1), 1000);
    return ()=>clearTimeout(t);
  }, [time, onEnd]);
  return time;
}

// ------------- Main App -------------
export default function MockTestApp() {
  const [questions, setQuestions] = useState(sampleQuestions);

  // user answers: [{answerIdx, status:...}]
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);

  // Timer: e.g. 5 minutes = 5*60
  const timerLimit = 5*60;
  const timeLeft = useCountdown(timerLimit, () => setShowResult(true));

  const [showResult, setShowResult] = useState(false);
  const [reviewed, setReviewed] = useState([]); // Array of indices reviewed

  // Initialize answers array after questions load
  useEffect(() => {
    setAnswers(questions.map(() => ({ answerIdx: null, status: null })));
  }, [questions]);

  // ----------- Controls -----------
  function selectOption(optIdx) {
    setAnswers(ans =>
      ans.map((a, i) => (i === current ? { ...a, answerIdx: optIdx, status: "answer" } : a))
    );
  }

  function clearOption() {
    setAnswers(ans =>
      ans.map((a, i) => (i === current ? { ...a, answerIdx: null, status: "not-answer" } : a))
    );
  }

  function handleSaveNext() {
    if (answers[current]?.answerIdx === null) {
      setAnswers(ans => ans.map((a, i) => (i === current ? { ...a, status: "not-answer" } : a)));
    }
    setCurrent(c => Math.min(c + 1, questions.length - 1));
  }

  function handleMarkReview() {
    setReviewed(r => {
      if (r.includes(current)) return r;
      else return [...r, current];
    });
    setAnswers(ans => ans.map((a, i) => (i === current ? { ...a, status: "review" } : a)));
    setCurrent(c => Math.min(c + 1, questions.length - 1));
  }

  function handlePrev() {
    setCurrent(c => Math.max(0, c - 1));
  }

  function onPaletteJump(idx) {
    setCurrent(idx);
  }

  function submitTest() {
    setShowResult(true);
  }

  // --- Color state for palette, with safe checking
  function paletteState(idx) {
    const answer = answers[idx];
    if (!answer) return undefined;
    if (showResult) return answer.status;
    if (reviewed.includes(idx)) return "review";
    return answer.status;
  }

  // ---------- Render ----------
  if (showResult) {
    return (
      <Container>
        <LeftPanel
          as={motion.div}
          initial={{ y: 70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 70 }}
        >
          <Logo>Quiz Result</Logo>
          <h2>Test Complete!</h2>
          <p>Total questions: {questions.length}</p>
          <p>Answered: {answers.filter(a => a.answerIdx !== null).length}</p>
          <p>Marked for Review: {answers.filter(a => a.status === "review").length}</p>
          <SubmitBtn onClick={() => window.location.reload()}>Restart</SubmitBtn>
        </LeftPanel>
      </Container>
    );
  }

  const q = questions[current];

  return (
    <>
      <GlobalStyle />
      <Container>
        <LeftPanel>
          <Logo>
            <span role="img" aria-label="flare">
              ⚡
            </span>{" "}
            MockTestPro
          </Logo>

          <Timer remaining={timeLeft}>
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
          </Timer>

          <AnimatePresence exitBeforeEnter>
            <motion.div
              key={current}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 60 }}
            >
              <QuestionNo>
                Question {current + 1} of {questions.length}
              </QuestionNo>
              <QuestionText>{q.text}</QuestionText>
              {q.options.map((opt, i) => (
                <OptionLabel key={i} checked={answers[current]?.answerIdx === i} as={motion.label} whileHover={{ scale: 1.03 }}>
                  <OptionRadio type="radio" checked={answers[current]?.answerIdx === i} onChange={() => selectOption(i)} />
                  <span>
                    {String.fromCharCode(65 + i)}. {opt}
                  </span>
                </OptionLabel>
              ))}
            </motion.div>
          </AnimatePresence>

          <NavButtons>
            <NavBtn left onClick={handlePrev} disabled={current === 0}>
              Previous
            </NavBtn>
            <NavBtn onClick={handleSaveNext}>Save & Next</NavBtn>
            <NavBtn onClick={handleMarkReview}>Mark & Next</NavBtn>
            <NavBtn style={{ background: "#ff2c5f", color: "#fff" }} onClick={clearOption}>
              Clear
            </NavBtn>
          </NavButtons>
        </LeftPanel>

        <RightPanel>
          <LegendRow>
            <PaletteDot state="answer"> </PaletteDot> Answered
            <PaletteDot state="not-answer"> </PaletteDot> Unanswered
          </LegendRow>
          <LegendRow>
            <PaletteDot state="review"> </PaletteDot> Marked for Review
          </LegendRow>
          <h3 style={{ margin: "18px 0 10px 0", color: "#45baf0", fontWeight: "bold" }}>Question Palette</h3>
          <PaletteGrid>
            {questions.map((q, idx) => (
              <PaletteDot
                key={idx}
                state={paletteState(idx)}
                current={current === idx}
                as={motion.div}
                onClick={() => onPaletteJump(idx)}
                whileHover={{ scale: 1.16, boxShadow: "0 4px 24px #5ed6c8" }}
              >
                {idx + 1}
              </PaletteDot>
            ))}
          </PaletteGrid>
          <SubmitBtn onClick={submitTest} style={{ marginTop: "1.2rem" }}>
            Submit Test
          </SubmitBtn>
        </RightPanel>
      </Container>
    </>
  );
}
