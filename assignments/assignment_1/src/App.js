import React, { useState, useEffect } from "react";

import QuestionTable from "./components/QuestionTable";
import CreateQuestion from "./components/CreateQuestion";

function App() {
  const [questions, setQuestions] = useState(() => {
    const savedQuestions = localStorage.getItem("questions-storage");
    if (savedQuestions) {
      return JSON.parse(savedQuestions);
    } else {
      return [];
    }
  });
  const [currQuestion, setCurrQuestion] = useState({
    id: 0,
    title: "",
    description: "",
    categories: [],
    complexity: "Easy",
  });

  useEffect(() => {
    localStorage.setItem("questions-storage", JSON.stringify(questions));
  }, [questions]);

  const clearCurrQuestion = () => {
    const isEmpty = {
      id: 0,
      title: "",
      description: "",
      categories: [],
      complexity: "Easy",
    };
    setCurrQuestion(isEmpty);
  };

  const updateCurrQuestion = (question) => {
    setCurrQuestion(question);
  };

  const onValChange = (e) => {
    var newValue = e.target.value;
    if (parseInt(newValue)) {
      newValue = parseInt(newValue);
    }
    const updatedQuestion = (res) => ({
      ...res,
      [e.target.name]: newValue,
    });
    setCurrQuestion(updatedQuestion);
  };

  const onCategoryValChange = (e) => {
    var updatedCategories = currQuestion.categories;
    if (!updatedCategories.includes(e.target.value)) {
      updatedCategories.push(e.target.value);
    } else {
      let i = 0;
      while (i < updatedCategories.length) {
        if (updatedCategories[i] == e.target.value) {
          updatedCategories.splice(i, 1);
          break;
        }
        i++;
      }
    }
    var updatedQuestion = currQuestion;
    updatedQuestion.categories = updatedCategories;
    console.log(currQuestion);
    setCurrQuestion(updatedQuestion);
  };

  const onCreateQuestion = () => {
    setQuestions((res) => [...res, currQuestion]);
    clearCurrQuestion();
  };

  const onUpdateQuestion = (id) => {
    console.log(id);
    var newQuestions = questions.filter(function (question) {
      return question.id !== id;
    });
    setQuestions(newQuestions);
    newQuestions.push(currQuestion);
    newQuestions.sort(function (a, b) {
      return a.id - b.id;
    });
    setQuestions(newQuestions);
    clearCurrQuestion();
  };

  const onDeleteQuestion = (id) => {
    var updatedQuestions = questions.filter(function (question) {
      return question.id !== id;
    });
    setQuestions(updatedQuestions);
  };

  return (
    <div className="app-body">
      <CreateQuestion
        questions={questions}
        currQuestion={currQuestion}
        onValChange={onValChange}
        onCategoryValChange={onCategoryValChange}
        onCreateQuestion={onCreateQuestion}
        clearCurrQuestion={clearCurrQuestion}
      />
      <QuestionTable
        questions={questions}
        currQuestion={currQuestion}
        onValChange={onValChange}
        onCategoryValChange={onCategoryValChange}
        onDeleteQuestion={onDeleteQuestion}
        onUpdateQuestion={onUpdateQuestion}
        clearCurrQuestion={clearCurrQuestion}
        updateCurrQuestion={updateCurrQuestion}
      />
    </div>
  );
}

export default App;
