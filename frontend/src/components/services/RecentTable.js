import React from "react";
import "../../css/profile.scss";

function RecentTable({ submissions }) {
  console.log(submissions);
  return (
    <div className="right-content">
      <div className="recent-text">Recent Submissions</div>
      <table className="recent-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Difficulty</th>
            <th>Language</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((item) => {
            return (
              <tr>
                <td>{item.submission.titleSlug}</td>
                <td>Easy</td>
                <td>{item.submission.language_id}</td>
              </tr>
            );
          })}
          {/* <tr>
            <td>Find One Two Three in Four</td>
            <td>Easy</td>
            <td>Python</td>
          </tr>

          <tr>
            <td>Add 2 Numbers</td>
            <td>Medium</td>
            <td>C++</td>
          </tr>

          <tr>
            <td>World's Hardest Problem</td>
            <td>Hard</td>
            <td>Assembly</td>
          </tr>

          <tr>
            <td>Find One Two Three in Four</td>
            <td>Easy</td>
            <td>Python</td>
          </tr>

          <tr>
            <td>Add 2 Numbers</td>
            <td>Medium</td>
            <td>C++</td>
          </tr>

          <tr>
            <td>World's Hardest Problem</td>
            <td>Hard</td>
            <td>Assembly</td>
          </tr> */}
        </tbody>
      </table>
    </div>
  );
}

export default RecentTable;
