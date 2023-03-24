export default function ScoreMessage({
  gameOver,
  personalBest,
  score,
  playerRank,
}) {
  return (
    <div className="score-message">
      {!gameOver && personalBest === score && playerRank === 1
        ? "Top score!"
        : !gameOver && personalBest === score
        ? "Personal best score!"
        : null}
    </div>
  );
}
