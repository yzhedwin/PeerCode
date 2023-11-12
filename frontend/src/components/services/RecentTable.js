import React from "react";
import "../../css/profile.scss";
import { EDITOR_SUPPORTED_LANGUAGES } from "../../utils/constants";

function RecentTable({ submissions, data }) {
  return (
    <div className="right-content">
      <div className="recent-text">Recent Submissions</div>
      {submissions.length > 0 ? (
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
              const question = data.find(
                (qn) => qn.titleSlug === item.submission.titleSlug
              );
              var language = EDITOR_SUPPORTED_LANGUAGES.find((obj) => {
                return obj.id === item.submission.language_id;
              });
              language = language.name.split(" ")[0];
              console.log(question);
              return (
                <tr>
                  <td>{question ? question.title : "Not found"}</td>
                  <td>{question ? question.difficulty : "Not found"}</td>
                  <td>{language ? language : "Not found"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className="recent-no-sub">There are currently no submissions</div>
      )}
    </div>
  );
}

export default RecentTable;
