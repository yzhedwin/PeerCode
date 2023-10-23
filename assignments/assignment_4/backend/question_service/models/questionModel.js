const mongoose = require('mongoose')

const questionSchema = mongoose.Schema(
  {
    id: {
      type: Number
    },
    title: {
      type: String
    },
    description: {
      type: String
    },
    categories: {
      type: Array
    },
    complexity: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

const Question = mongoose.model("Question", questionSchema, "questions");

module.exports = Question;