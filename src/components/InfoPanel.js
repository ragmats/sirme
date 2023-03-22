export default function InfoPanel({
  playerName,
  round,
  points,
  repeats,
  score,
  playerRank,
}) {
  return (
    <>
      {playerName.length > 12 ? (
        <p className="name">
          {playerName.toLocaleLowerCase().substring(0, 12) + "..."}
        </p>
      ) : (
        <p className="name">{playerName.toLocaleLowerCase()}</p>
      )}
      <p>Round: {round}</p>
      <p>Points: {points}</p>
      <p>Repeats: ({repeats})</p>
      <p>Total Score: {score}</p>
      {playerRank ? <p>Rank: {playerRank}</p> : null}
    </>
  );
}
