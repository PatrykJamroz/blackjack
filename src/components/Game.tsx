import react from "react";
import useGame from "./useGame";
import Card from "./Card";

export default function Game() {
  const game = useGame();

  return (
    <div>
      <div>
        Croupier Cards:
        <div style={{ display: "flex" }}>
          {game.croupierHand.map((card, index) => (
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
        Player Cards
      </div>
      <div>Some text about game state</div>
      <div>
        <button>Hit</button>
        <button>Stand</button>
        <button>Double</button>
      </div>
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
