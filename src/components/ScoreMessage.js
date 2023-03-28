import { useEffect, useState } from "react";

export default function ScoreMessage({
  gameOver,
  personalBest,
  score,
  playerRank,
  highScores,
  restart,
  quit,
}) {
  const [scoreMessage, setScoreMessage] = useState(null);

  /*
   * Resets on various game changes to determine the score message
   */
  useEffect(() => {
    if (!gameOver && personalBest === score) {
      if (playerRank === 1) setScoreMessage("Top score!");
      else setScoreMessage("Personal best score!");
    }
  }, [gameOver, personalBest, score, playerRank]);

  /*
   * Resets on various game changes to clear the score message
   */
  useEffect(() => {
    if (gameOver || restart || quit || highScores.length === 0)
      setScoreMessage(null);
  }, [gameOver, restart, quit, highScores]);

  return (
    <div className="score-message">{scoreMessage ? scoreMessage : null}</div>
  );
}
