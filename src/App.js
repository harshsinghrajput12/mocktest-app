import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";

// -------- Global Styles --------
const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Inter', 'Roboto', Arial, sans-serif;
    margin: 0; background: linear-gradient(115deg, #24243e 0%, #302b63 47%, #0f0c29 100%);
    color: #f3f8fa; min-height: 100vh;
  }
`;

// -------- Styled components --------
const Container = styled.div`
  max-width: 900px;
  margin: 20px auto;
  background: rgba(20, 20, 40, 0.95);
  border-radius: 12px;
  padding: 20px 30px 40px 30px;
  box-shadow: 0 0 14px #007868aa;
`;
const Heading = styled.h1`
  color: #31c491;
  font-family: 'Orbitron', sans-serif;
  text-align: center;
`;
const Button = styled.button`
  background: #31c491;
  border: none;
  padding: 10px 18px;
  color: #060f07;
  border-radius: 7px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 0 3px 15px #32dfa6cc;
  transition: background 0.3s;
  &:hover {
    background: #56e3a7;
  }
  &:disabled {
    background: #355b45; color: #8ed3be; cursor: not-allowed;
    box-shadow: none;
  }
`;
const Input = styled.input`
  padding: 8px 10px;
  font-size: 1rem;
  border-radius: 8px;
  border: none;
  margin: 5px 5px 15px 0;
  width: 100%;
  box-sizing: border-box;
`;
const TextArea = styled.textarea`
  font-size: 1rem;
  border-radius: 8px;
  border: none;
  padding: 10px;
  width: 100%;
  margin-bottom: 15px;
  box-sizing: border-box;
  resize: vertical;
`;
const Label = styled.label`
  font-weight: 600;
  margin-bottom: 5px;
  display: block;
`;
const Section = styled.div`
  margin-bottom: 25px;
`;
const OptionLabel = styled.label`
  display: block;
  margin-bottom: 10px;
  cursor: pointer;
  user-select: none;
  color: ${({ checked }) => (checked ? "#6df59a" : "#d1f7d9")};
`;
const ReviewItem = styled.div`
  padding: 12px 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  border-left: 5px solid ${({ correct }) => (correct ? "#50d890" : "#f14855")};
  background: ${({ correct }) => (correct ? "#153928" : "#401617")};
`;
const AnswerText = styled.p`
  margin: 6px 0;
`;

// ------------ Initial Data (example with few questions) -------------
// Replace this with your full question set per last instructions.
const initialTestData = {
  "Anti-cancer drug": [
    {
      id: "1",
      text: "Which of the following is an alkylating agent?",
      options: ["Cyclophosphamide", "Methotrexate", "Vincristine", "Doxorubicin"],
      correct: 0,
      explanation: "Cyclophosphamide is a commonly used alkylating agent."
    },
    {
      id: "2",
      text: "Methotrexate primarily inhibits which enzyme?",
      options: ["DNA polymerase", "Thymidylate synthase", "Dihydrofolate reductase", "Topoisomerase II"],
      correct: 2,
      explanation: "Methotrexate inhibits dihydrofolate reductase, blocking DNA synthesis."
    },
    // ... Insert the full 76 questions array here from the previous message ...
  ],
};

export default function App() {
  const [tests, setTests] = useState(() => {
    const data = localStorage.getItem("mockTests");
    return data ? JSON.parse(data) : initialTestData;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoginVisible, setAdminLoginVisible] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoginError, setAdminLoginError] = useState("");
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const [newFolderName, setNewFolderName] = useState("");
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    options: ["", "", "", ""],
    correct: 0,
    explanation: ""
  });

  useEffect(() => {
    localStorage.setItem("mockTests", JSON.stringify(tests));
  }, [tests]);

  useEffect(() => {
    if (!currentFolder) return;
    setCurrentQuestions(tests[currentFolder] || []);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setShowResults(false);
  }, [currentFolder, tests]);

  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    if (adminUsername === "admin" && adminPassword === "admin123") {
      setIsAdmin(true);
      setAdminLoginVisible(false);
      setAdminUsername("");
      setAdminPassword("");
      setAdminLoginError("");
    } else {
      setAdminLoginError("Invalid username or password");
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setCurrentFolder(null);
  };

  const addFolder = () => {
    const name = newFolderName.trim();
    if (!name) {
      alert("Folder name cannot be empty");
      return;
    }
    if (tests[name]) {
      alert("Folder already exists");
      return;
    }
    setTests(prev => ({ ...prev, [name]: [] }));
    setNewFolderName("");
  };

  const addNewQuestion = () => {
    if (!currentFolder) {
      alert("Select or create a folder first!");
      return;
    }
    if (!newQuestion.text.trim() || newQuestion.options.some(opt => !opt.trim())) {
      alert("Fill all question and option fields");
      return;
    }
    const id = Date.now().toString();
    const questionToAdd = { ...newQuestion, id };

    setTests(prev => ({
      ...prev,
      [currentFolder]: [...(prev[currentFolder] || []), questionToAdd]
    }));

    setNewQuestion({
      text: "",
      options: ["", "", "", ""],
      correct: 0,
      explanation: ""
    });
  };

  const selectAnswer = (questionId, optionIdx) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const calculateScore = () => {
    if (!currentFolder) return 0;
    const questions = tests[currentFolder];
    return questions.reduce((score, q) => (userAnswers[q.id] === q.correct ? score + 1 : score), 0);
  };

  // Handle empty question set gracefully:
  if (currentFolder && currentQuestions.length === 0) {
    return (
      <Container>
        <Heading>{currentFolder}</Heading>
        <p>No questions available in this folder.</p>
        <Button onClick={() => setCurrentFolder(null)}>Back to Folder Selection</Button>
      </Container>
    );
  }

  if (isAdmin) {
    // Admin UI (same as your implementation)
    return (
      <Container>
        <Heading>Admin Panel - Mock Test Management</Heading>
        <Button onClick={handleAdminLogout}>Logout Admin</Button>

        <Section>
          <h2>Create New Folder / Test</h2>
          <Input
            placeholder="Folder name"
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
          />
          <Button onClick={addFolder}>Add Folder</Button>
        </Section>

        <Section>
          <h2>Folders / Tests</h2>
          {Object.keys(tests).length === 0 && <p>No folders created yet.</p>}
          <ul>
            {Object.keys(tests).map(folder => (
              <li key={folder} style={{ marginBottom: "10px" }}>
                <b>{folder}</b> ({tests[folder].length} questions)
                <Button style={{ marginLeft: "10px" }} onClick={() => setCurrentFolder(folder)}>
                  Manage Questions
                </Button>
              </li>
            ))}
          </ul>
        </Section>

        {currentFolder && (
          <>
            <Section>
              <h2>Manage Questions for "{currentFolder}"</h2>

              <h3>Add New Question</h3>
              <Label>Question:</Label>
              <TextArea
                rows={3}
                value={newQuestion.text}
                onChange={e => setNewQuestion({ ...newQuestion, text: e.target.value })}
              />

              <Label>Options:</Label>
              {newQuestion.options.map((opt, idx) => (
                <div key={idx} style={{ marginBottom: "10px" }}>
                  <Input
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    value={opt}
                    onChange={e => {
                      const newOptions = [...newQuestion.options];
                      newOptions[idx] = e.target.value;
                      setNewQuestion({ ...newQuestion, options: newOptions });
                    }}
                  />
                  <label>
                    <input
                      type="radio"
                      name={`correctOption-${newQuestion.id || "new"}`} // unique name
                      checked={newQuestion.correct === idx}
                      onChange={() => setNewQuestion({ ...newQuestion, correct: idx })}
                    />{" "}
                    Mark as correct
                  </label>
                </div>
              ))}

              <Label>Explanation (shown for wrong answers):</Label>
              <TextArea
                rows={2}
                value={newQuestion.explanation}
                onChange={e => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
              />

              <Button onClick={addNewQuestion}>Add Question</Button>
            </Section>

            <Section>
              <h3>Existing Questions</h3>
              {tests[currentFolder].length === 0 && <p>No questions in this folder yet.</p>}
              <ul>
                {tests[currentFolder].map(q => (
                  <li key={q.id} style={{ marginBottom: "10px" }}>
                    <b>{q.text}</b> (Answer: {String.fromCharCode(65 + q.correct)})
                  </li>
                ))}
              </ul>
            </Section>
          </>
        )}
      </Container>
    );
  }

  if (!currentFolder) {
    return (
      <Container>
        <GlobalStyle />
        <Heading>Mock Test App</Heading>

        {!adminLoginVisible ? (
          <>
            <Button
              onClick={() => setAdminLoginVisible(true)}
              style={{ marginBottom: "20px", background: "#c33", color: "#fff" }}
            >
              Admin Login
            </Button>

            <h2>Select a Test Folder</h2>
            {Object.keys(tests).length === 0 && <p>No test folders available</p>}
            <ul>
              {Object.keys(tests).map(folder => (
                <li key={folder} style={{ marginBottom: "10px" }}>
                  <Button style={{ width: "100%", fontSize: "1.1rem" }} onClick={() => setCurrentFolder(folder)}>
                    {folder} ({tests[folder].length} Questions)
                  </Button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <form onSubmit={handleAdminLoginSubmit} style={{ maxWidth: "300px", margin: "auto" }}>
            <Label>Admin Username:</Label>
            <Input
              type="text"
              required
              value={adminUsername}
              onChange={e => setAdminUsername(e.target.value)}
            />

            <Label>Admin Password:</Label>
            <Input
              type="password"
              required
              value={adminPassword}
              onChange={e => setAdminPassword(e.target.value)}
            />

            {adminLoginError && <p style={{ color: "red" }}>{adminLoginError}</p>}

            <Button type="submit" style={{ width: "100%" }}>
              Log In
            </Button>
            <Button type="button" onClick={() => setAdminLoginVisible(false)} style={{ marginTop: "8px", width: "100%" }}>
              Cancel
            </Button>
          </form>
        )}
      </Container>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const total = currentQuestions.length;

    return (
      <Container>
        <Heading>Test Results: {currentFolder}</Heading>

        <p>
          You scored {score} out of {total} ({((score / total) * 100).toFixed(2)}%)
        </p>

        <Button
          onClick={() => {
            setShowResults(false);
            setCurrentQuestionIdx(0);
            setUserAnswers({});
          }}
        >
          Retake Test
        </Button>
        <Button onClick={() => setCurrentFolder(null)} style={{ marginLeft: "10px" }}>
          Back to Folder Selection
        </Button>

        <Section>
          <h2>Review Your Answers</h2>
          {currentQuestions.map((q, i) => {
            const userAns = userAnswers[q.id];
            const isCorrect = userAns === q.correct;
            return (
              <ReviewItem key={q.id} correct={isCorrect}>
                <p>
                  <b>
                    Q{i + 1}: {q.text}
                  </b>
                </p>
                <AnswerText>Your answer: {userAns != null ? q.options[userAns] : "Not answered"} {!isCorrect && "(Wrong)"}</AnswerText>
                <AnswerText>Correct answer: {q.options[q.correct]}</AnswerText>
                {!isCorrect && q.explanation && <AnswerText><i>Explanation: {q.explanation}</i></AnswerText>}
              </ReviewItem>
            );
          })}
        </Section>
      </Container>
    );
  }

  const question = currentQuestions[currentQuestionIdx];

  return (
    <Container>
      <Heading>Test: {currentFolder}</Heading>
      <Button onClick={() => setCurrentFolder(null)} style={{ marginBottom: "15px" }}>
        Back to Folder Selection
      </Button>

      <p>
        Question {currentQuestionIdx + 1} of {currentQuestions.length}
      </p>
      <p style={{ fontWeight: "600", fontSize: "1.2rem", marginBottom: "16px" }}>{question.text}</p>

      <ul style={{ paddingLeft: 0, listStyleType: "none" }}>
        {question.options.map((opt, idx) => (
          <li key={idx} style={{ marginBottom: "12px" }}>
            <OptionLabel checked={userAnswers[question.id] === idx}>
              <input
                type="radio"
                name={`answer-${question.id}`}
                checked={userAnswers[question.id] === idx}
                onChange={() => selectAnswer(question.id, idx)}
                style={{ marginRight: "10px" }}
              />
              {String.fromCharCode(65 + idx)}. {opt}
            </OptionLabel>
          </li>
        ))}
      </ul>

      <div>
        <Button onClick={() => setCurrentQuestionIdx(i => Math.max(i - 1, 0))} disabled={currentQuestionIdx === 0}>
          Previous
        </Button>
        <Button
          onClick={() => setCurrentQuestionIdx(i => Math.min(i + 1, currentQuestions.length - 1))}
          disabled={currentQuestionIdx === currentQuestions.length - 1}
          style={{ marginLeft: "10px" }}
        >
          Next
        </Button>

        <Button
          onClick={() => setShowResults(true)}
          style={{ marginLeft: "20px" }}
          disabled={currentQuestions.length === 0}
        >
          Submit Test
        </Button>
      </div>

      <p style={{ marginTop: "20px" }}>
        Selected Answer: {userAnswers[question.id] != null ? question.options[userAnswers[question.id]] : "None"}
      </p>
    </Container>
  );
}
