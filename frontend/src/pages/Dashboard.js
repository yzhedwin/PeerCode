import Match from "../components/services/Match";
import Question from "../components/services/Question";
import QuestionOTD from "../components/services/QuestionOTD";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-container-top">
        <QuestionOTD />
        <Match />
      </div>
      <Question />
    </div>
  );
}
