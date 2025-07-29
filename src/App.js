import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";

// Styles here (reuse the styles from previous examples)
// ...

// Simple in-memory data (for demo, you would fetch from backend API)
const initialTestData = {
  "Anti-cancer drug": [
    {
      id: "1",
      text: "Which alkylating agent is most commonly associated with hemorrhagic cystitis?",
      options: ["Cyclophosphamide", "Melphalan", "Busulfan", "Ifosfamide"],
      correct: 3,
      explanation: "Ifosfamide’s acrolein metabolite causes bladder toxicity and hemorrhagic cystitis."
    },
    //... Add your full question set here
  ],
  // You can add more folders/tests as keys here
};

function App() {
  // === Global data managed in localStorage for demo persistence ===
  const [tests, setTests] = useState(() => {
    const data = localStorage.getItem("mockTests");
    return data ? JSON.parse(data) : initialTestData;
  });

  // Current UI state
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // key: questionId, value: selectedOptionIdx
  const [showResults, setShowResults] = useState(false);

  // Admin inputs state
  const [newFolderName, setNewFolderName] = useState("");
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    options: ["", "", "", ""],
    correct: 0,
    explanation: ""
  });

  // Save tests to localStorage for demo persistence
  useEffect(() => {
    localStorage.setItem("mockTests", JSON.stringify(tests));
  }, [tests]);

  // Load test questions when folder changes
  useEffect(() => {
    if (!currentFolder) return;
    setCurrentQuestions(tests[currentFolder] || []);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setShowResults(false);
  }, [currentFolder, tests]);

  // === Admin login handler (basic for demo) ===
  function handleAdminLogin() {
    const pwd = prompt("Enter admin password:");
    if(pwd === "admin123") setIsAdmin(true);
    else alert("Wrong password");
  }

  // === Admin logout ===
  function handleAdminLogout() {
    setIsAdmin(false);
    setCurrentFolder(null);
  }

  // === Adding new folder ===
  function addFolder() {
    if (!newFolderName.trim()) {
      alert("Folder name cannot be empty");
      return;
    }
    if(tests[newFolderName]) {
      alert("Folder already exists");
      return;
    }
    setTests(prev => ({...prev, [newFolderName]: []}));
    setNewFolderName("");
  }

  // === Adding new question to current folder ===
  function addNewQuestion() {
    if (!currentFolder) {
      alert("Select or create a folder first!");
      return;
    }
    if (!newQuestion.text.trim() || newQuestion.options.some(opt => !opt.trim())) {
      alert("Fill all question and option fields");
      return;
    }
    // Assign ID (simple)
    const id = new Date().getTime().toString();
    const questionToAdd = {...newQuestion, id};

    setTests(prev => ({
      ...prev,
      [currentFolder]: [...(prev[currentFolder] || []), questionToAdd]
    }));
    // Reset admin question form
    setNewQuestion({text: "", options: ["", "", "", ""], correct: 0, explanation: ""});
  }

  // === User selects answer ===
  function selectAnswer(questionId, optionIdx) {
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  }

  // === Calculate Score ===
  function calculateScore() {
    if(!currentFolder) return 0;
    const questions = tests[currentFolder];
    return questions.reduce((score, q) => {
      return score + ((userAnswers[q.id] === q.correct) ? 1 : 0);
    }, 0);
  }

  // === Rendering ===

  // Admin panel
  if(isAdmin) {
    return (
      <div style={{padding:"20px", maxWidth: "800px", margin: "auto"}}>
        <h1>Admin Panel - Mock Test Management</h1>
        <button onClick={handleAdminLogout}>Logout Admin</button>
        <hr/>

        <div>
          <h2>Create New Folder / Test</h2>
          <input type="text" value={newFolderName} placeholder="Folder name" 
            onChange={e => setNewFolderName(e.target.value)} />
          <button onClick={addFolder}>Add Folder</button>
        </div>

        <hr/>

        <div>
          <h2>Folders / Tests</h2>
          <ul>
            {Object.keys(tests).map(folder => (
              <li key={folder}>
                <b>{folder}</b> ({tests[folder].length} questions)
                <button style={{marginLeft:"10px"}} onClick={() => setCurrentFolder(folder)}>
                  Manage Questions
                </button>
              </li>
            ))}
          </ul>
        </div>

        {currentFolder && (
          <>
            <hr/>
            <h2>Manage Questions for "{currentFolder}"</h2>
            <div>
              <h3>Add New Question</h3>
              <label>Question:</label><br/>
              <textarea
                rows="3"
                style={{width: "100%"}}
                value={newQuestion.text}
                onChange={e => setNewQuestion({...newQuestion, text: e.target.value})}
              />
              <br/>
              <label>Options:</label>
              {newQuestion.options.map((opt, idx) => (
                <div key={idx}>
                  <input
                    type="text"
                    value={opt}
                    onChange={e => {
                      const newOptions = [...newQuestion.options];
                      newOptions[idx] = e.target.value;
                      setNewQuestion({...newQuestion, options: newOptions});
                    }}
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    style={{width:"90%"}}
                  />
                  <input
                    type="radio"
                    name="correctOption"
                    checked={newQuestion.correct === idx}
                    onChange={() => setNewQuestion({...newQuestion, correct: idx})}
                    title="Mark as correct answer"
                  />
                </div>
              ))}
              <label>Explanation (will show for wrong answers):</label><br/>
              <textarea
                rows="2"
                style={{width:"100%"}}
                value={newQuestion.explanation}
                onChange={e => setNewQuestion({...newQuestion, explanation: e.target.value})}
              />
              <br/>
              <button onClick={addNewQuestion}>Add Question</button>
            </div>

            <hr/>

            <h3>Existing Questions</h3>
            <ul>
              {tests[currentFolder].map(q => (
                <li key={q.id}>
                  <b>{q.text}</b> (Answer: {String.fromCharCode(65 + q.correct)})
                  {/* You can add edit/delete buttons here */}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  }

  // User mode

  if (!currentFolder) {
    // Folder selection UI
    return (
      <div style={{ maxWidth: "600px", margin: "auto", padding: "20px", fontFamily: "sans-serif" }}>
        <h1>Select a Test</h1>
        <button onClick={handleAdminLogin} style={{marginBottom: "20px", background: "#c33", color: "#fff"}}>
          Admin Login
        </button>
        <ul>
          {Object.keys(tests).map(folder => (
            <li key={folder} style={{marginBottom: "10px"}}>
              <button onClick={() => setCurrentFolder(folder)} style={{width:"100%", padding: "10px", fontSize:"1.1rem"}}>
                {folder} ({tests[folder].length} Questions)
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (showResults) {
    // Show detailed results with explanations
    const score = calculateScore();
    const total = (tests[currentFolder] || []).length;

    return (
      <div style={{maxWidth:"700px", margin:"auto", padding:"20px", fontFamily:"sans-serif"}}>
        <h1>Test Results for "{currentFolder}"</h1>
        <p>
          You scored {score} out of {total} ({((score/total)*100).toFixed(2)}%)
        </p>
        <button onClick={() => {
          setShowResults(false);
          setCurrentQuestionIdx(0);
          setUserAnswers({});
        }}>Retake Test</button>
        <button onClick={() => setCurrentFolder(null)} style={{marginLeft:"10px"}}>Back to Test Selection</button>

        <hr/>

        <h2>Review Your Answers</h2>
        {tests[currentFolder].map((q, i) => {
          const userAns = userAnswers[q.id];
          const isCorrect = userAns === q.correct;
          return (
            <div key={q.id} style={{marginBottom:"20px", borderLeft: `5px solid ${isCorrect ? "green" : "red"}`, paddingLeft:"10px"}}>
              <p><b>Q{i+1}: {q.text}</b></p>
              <p>
                Your answer: {userAns != null ? q.options[userAns] : "Not answered"} {!isCorrect && "(Wrong)"}
              </p>
              <p>Correct answer: {q.options[q.correct]}</p>
              {!isCorrect && q.explanation && (
                <p><i>Explanation: {q.explanation}</i></p>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Test question UI

  const question = currentQuestions[currentQuestionIdx];

  return (
    <div style={{maxWidth:"700px", margin:"auto", padding:"20px", fontFamily:"sans-serif"}}>
      <h1>Test: {currentFolder}</h1>
      <button onClick={() => setCurrentFolder(null)} style={{marginBottom:"10px"}}>Back to Test Selection</button>

      <p>Question {currentQuestionIdx +1} of {currentQuestions.length}</p>
      <p><b>{question.text}</b></p>

      <ul style={{listStyle:"none", paddingLeft: 0}}>
        {question.options.map((opt, idx) => (
          <li key={idx} style={{marginBottom:"10px"}}>
            <label style={{cursor: "pointer"}}>
              <input
                type="radio"
                name="answer"
                checked={userAnswers[question.id] === idx}
                onChange={() => selectAnswer(question.id, idx)}
              />
              {" "}
              {String.fromCharCode(65 + idx)}. {opt}
            </label>
          </li>
        ))}
      </ul>

      <div>
        <button
          onClick={() => setCurrentQuestionIdx(i => Math.max(i-1, 0))}
          disabled={currentQuestionIdx === 0}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentQuestionIdx(i => Math.min(i+1, currentQuestions.length -1))}
          disabled={currentQuestionIdx === currentQuestions.length -1}
          style={{marginLeft:"10px"}}
        >
          Next
        </button>

        <button
          onClick={() => setShowResults(true)}
          style={{marginLeft:"20px"}}
        >
          Submit Test
        </button>
      </div>

      <p>
        Selected Answer: {userAnswers[question.id] != null ? question.options[userAnswers[question.id]] : "None"}
      </p>
    </div>
  );
}

export default App;
