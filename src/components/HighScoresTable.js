import Table from "react-bootstrap/Table";
import "../CSS/HighScores.css";

export default function HighScoresTable({ highScores }) {
  return (
    <>
      {highScores.length > 0 ? (
        <Table borderless striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {console.log("highScores: ", highScores)}
            {highScores.map(({ id, name, score }, idx) => {
              return (
                <tr key={id}>
                  <td>{idx + 1}</td>
                  <td>{name}</td>
                  <td>{score}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <div className="center">No high scores yet... be the first!</div>
      )}
    </>
  );
}
