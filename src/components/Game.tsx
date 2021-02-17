import react from "react";
import useGame from "./useGame";
import Card from "./Card";

export default function Game() {
  const game = useGame();

  return (
    <div>
      <div>
        dealer Cards: {game.dealerCount}
        <div style={{ display: "flex" }}>
          {game.dealerHand.map((card, index) => (
            <Card image={card.image} key={index} />
          ))}
        </div>
      </div>
      <hr />
      <div>
        <div style={{ display: "flex" }}>
          {game.playerHand.map((card, index) => (
            <Card image={card.image} key={index} />
          ))}
        </div>
        Player Cards {game.playerCount}
      </div>
      <div>Round: {game.roundNo}</div>
      <div>
        <button
          onClick={game.handleHit}
          disabled={game.actionBtnsDisabled ? true : false}
        >
          Hit
        </button>
        <button
          onClick={game.handleStand}
          disabled={game.actionBtnsDisabled ? true : false}
        >
          Stand
        </button>
        <button>Double</button>
      </div>
      <button
        onClick={game.handleNewRound}
        disabled={game.isRoundBtnDisabled ? true : false}
      >
        New Round
      </button>
      <div>
        <p>Credit: $1000</p>
        <input></input>
        <button>Bet</button>
      </div>
      <input></input>
      <button onClick={game.startGame} disabled={game.gameOn ? true : false}>
        New game
      </button>
      <div>History component</div>
    </div>
  );
}
