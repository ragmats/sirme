export default function ScoreMessage({
  gameOver,
  personalBest,
  score,
  playerRank,
}) {
  return (
    <>
      {!gameOver && personalBest === score && playerRank === 1 ? (
        <p>Top score!</p>
      ) : !gameOver && personalBest === score ? (
        <p>Personal best score!</p>
      ) : null}
    </>
  );
}
