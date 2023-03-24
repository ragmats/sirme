import Table from "react-bootstrap/Table";
import "../CSS/HighScores.css";

export default function HighScoresTable({ highScores, playerName }) {
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
            {highScores.map(({ id, name, score }, idx) => {
              return (
                <tr
                  className={
                    playerName.toLowerCase() === name ? "highlighted" : null
                  }
                  key={id}
                >
                  <td>{idx + 1}</td>
                  {/* <td className="highscore-name">{name.toLowerCase()}</td> */}
                  <td className="highscore-name">
                    {name.length > 8
                      ? name.toLowerCase().substring(0, 8) + "..."
                      : name.toLowerCase()}
                  </td>
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
