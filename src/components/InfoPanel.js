export default function InfoPanel({
  playerName,
  round,
  points,
  repeats,
  score,
  playerRank,
}) {
  return (
    <div className="info-panel">
      <div className="name">
        {playerName.length > 8
          ? playerName.toLocaleLowerCase().substring(0, 8) + "..."
          : playerName.toLocaleLowerCase()}
      </div>
      <div className="info-item">Round: {round}</div>
      <div className="info-item">Points: {points}</div>
      <div className="info-item">Repeats: ({repeats})</div>
      <div className="info-item">Score: {score}</div>
      <div className="info-item">
        {playerRank ? `Rank: ${playerRank}` : null}
      </div>
    </div>
  );
}
