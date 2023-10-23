import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

import QuestionTable from "./dashboard_components/QuestionTable";
import CreateQuestion from "./dashboard_components/CreateQuestion";

//temporary test
import Axios from "axios";
import Match from "./Match";

export default function Dashboard() {
	const [loading, setLoading] = useState(true);
	const { currentUser } = useAuth();
	const { isAdmin } = useAuth();

	const [questions, setQuestions] = useState([
		{
			id: "1",
			title: "Inverse a Tree",
			complexity: "Easy",
			categories: ["Array"],
			description: "Do it in O(n) time",
		},
		{
			id: "2",
			title: "3sum",
			complexity: "Easy",
			categories: ["Array"],
			description: "Sum some numbers lo",
		},
	]);

	const [currQuestion, setCurrQuestion] = useState({
		id: 0,
		title: "",
		description: "",
		categories: [],
		complexity: "Easy",
	});

	useEffect(() => {
		// Axios.get("http://localhost:3002/all/")
		// 	.then((response) => {
		// 		setQuestions(response.data);
		setLoading(false);
		// 	})
		// 	.catch((error) => {
		// 		console.log(error.message);
		// 	});
	}, []);

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
		console.log(currentUser);
		var updatedCategories = currQuestion.categories;
		if (!updatedCategories.includes(e.target.value)) {
			updatedCategories.push(e.target.value);
		} else {
			let i = 0;
			while (i < updatedCategories.length) {
				if (updatedCategories[i] === e.target.value) {
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

	const onCreateQuestion = async () => {
		var newQuestions = questions;
		newQuestions.push(currQuestion);
		newQuestions.sort(function (a, b) {
			return a.id - b.id;
		});
		setQuestions(newQuestions);

		await Axios.post("http://localhost:3002/add/", currQuestion)
			.then(function (response) {
				console.log(response);
			})
			.catch(function (error) {
				console.log(error);
			});

		clearCurrQuestion();
	};

	const onUpdateQuestion = async (id) => {
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

		await Axios.put(`http://localhost:3002/update/${id}`, currQuestion)
			.then((response) => {
				console.log(response.data);
			})
			.catch((error) => {
				console.error(error);
			});

		clearCurrQuestion();
	};

	const onDeleteQuestion = async (id) => {
		var updatedQuestions = questions.filter(function (question) {
			return question.id !== id;
		});
		setQuestions(updatedQuestions);

		await Axios.delete(`http://localhost:3002/delete/${id}`)
			.then(() => {
				console.log(`Deleted post with ID ${id}`);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<>
			<div
				className="match-container"
				style={{
					display: "flex",
				}}
			>
				<Match />
			</div>
			<Link to="/profile" className="btn btn-primary w-100 mt-3">
				My Profile
			</Link>
			<div className="app-body">
				{loading ? (
					<div className="db_loading">
						<Spinner
							className="db_loading"
							animation="border"
							role="status"
							style={{ width: "4rem", height: "4rem" }}
						>
							<span className="visually-hidden">Loading...</span>
						</Spinner>
					</div>
				) : (
					<div>
						{isAdmin ? (
							<CreateQuestion
								questions={questions}
								currQuestion={currQuestion}
								onValChange={onValChange}
								onCategoryValChange={onCategoryValChange}
								onCreateQuestion={onCreateQuestion}
								clearCurrQuestion={clearCurrQuestion}
							/>
						) : (
							<div></div>
						)}
						<QuestionTable
							questions={questions}
							currQuestion={currQuestion}
							onValChange={onValChange}
							onCategoryValChange={onCategoryValChange}
							onDeleteQuestion={onDeleteQuestion}
							onUpdateQuestion={onUpdateQuestion}
							clearCurrQuestion={clearCurrQuestion}
							updateCurrQuestion={updateCurrQuestion}
							isAdmin={isAdmin}
						/>
					</div>
				)}
			</div>
			{<div>{isAdmin.toString()}</div>}
			{<div>{currentUser.uid.toString()}</div>}
		</>
	);
}
