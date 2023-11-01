import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function EditQuestion() {
  const location = useLocation();
  const [currQuestion, setCurrQuestion] = useState({
    titleSlug: location.state.titleSlug,
    title: location.state.title,
    description: location.state.description,
    categories: location.state.categories,
    difficulty: location.state.difficulty,
  });
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

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

  const titleToSlug = (title) => {
    const lowerTitle = title.toLowerCase();
    const resTitle = lowerTitle.replace(/\s+/g, "-");
    return resTitle;
  };

  const handleFormCheck = async () => {
    var newErrors = [];

    if (currQuestion.title === "") {
      newErrors.push("Please enter a title");
    }
    if (currQuestion.description === "") {
      newErrors.push("Please enter a description");
    }
    const categoriesArr = currQuestion.categories.split(",");
    const trimmedArr = categoriesArr.map((cat) => {
      return cat.trim();
    });
    if (trimmedArr.includes("")) {
      newErrors.push("Please choose at least one category");
    }
    console.log(newErrors);
    setErrors(newErrors);
    if (newErrors.length === 0) {
      console.log("Question may be updated");
      for (var i = 0; i < trimmedArr.length; i++) {
        var entry = { name: trimmedArr[i] };
        trimmedArr[i] = entry;
      }
      // update question
      try {
        await axios.post(
          `http://localhost:5000/api/v1/question/update/${currQuestion.titleSlug}`,
          {
            title: currQuestion.title,
            titleSlug: titleToSlug(currQuestion.title),
            difficulty: currQuestion.difficulty,
            problem: currQuestion.description,
            topicTags: trimmedArr,
            status: "Not Attempted",
          }
        );
        navigate("/dashboard");
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <div className="question-form">
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            name="title"
            type="text"
            value={currQuestion.title}
            onChange={onValChange}
            placeholder="Enter a title for the question"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            name="description"
            as="textarea"
            rows="8"
            type="text"
            value={currQuestion.description}
            onChange={onValChange}
            placeholder="Enter a description for the question"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            name="categories"
            type="text"
            value={currQuestion.categories}
            onChange={onValChange}
            placeholder="Enter at least one category for the question"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Complexity</Form.Label>
          <Form.Control
            name="complexity"
            as="select"
            defaultValue={location.state.difficulty}
            onChange={onValChange}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </Form.Control>
        </Form.Group>
      </Form>
      <br></br>
      <Button variant="primary" onClick={handleFormCheck}>
        Submit
      </Button>
    </div>
  );
}
