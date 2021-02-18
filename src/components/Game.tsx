import react from "react";
import useGame from "./useGame";
import Card from "./Card";

export default function Game() {
  const game = useGame();

  return (
    <div>
      <div
        style={{
          height: "165px",
        }}
      >
        Dealer hand: {game.dealerCount}
        <div style={{ display: "flex" }}>
          {game.dealerHand.map((card, index) => (
            <Card image={card.image} key={index} />
          ))}
        </div>
      </div>

      <h4>
        {
          game.roundState === null
            ? "Click New Game button to start..."
            : game.roundState === "In progress"
            ? "Hit or Stand!"
            : game.roundState
          /* {game.roundState !== null
          ? game.roundState
          : "Click New Game button to start..."} */
        }
      </h4>

      <div
        style={{
          height: "170px",
        }}
      >
        <div style={{ display: "flex" }}>
          {game.playerHand.map((card, index) => (
            <Card image={card.image} key={index} />
          ))}
        </div>
        Player hand: {game.playerCount}
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
      <button onClick={game.startGame} disabled={game.isGameOn ? true : false}>
        New game
      </button>
      <div>
        <div>Round History</div>
        <div>
          {game.roundHistory.map((obj, index) => {
            return (
              <div key={index}>
                <p>Round: {obj.round}</p>
                <p>
                  Player Score: {obj.playerCount} (
                  {obj.playerHand.map((array, index) => {
                    return <span key={index}>{array.code} </span>;
                  })}
                  )
                </p>
                <p>
                  Dealer Score: {obj.dealerCount} (
                  {obj.dealerHand.map((array, index) => {
                    return <span key={index}>{array.code} </span>;
                  })}
                  )
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
