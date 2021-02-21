import useGame from "./useGame";
// import Card from "./Card";
import {
  GameContainer,
  TopPanel,
  BotPanel,
  Table,
  Card,
  Deck,
  GameStatus,
  GameStatusPtag,
  CardDummy,
  ControlsContainer,
  Button,
  BetContainer,
  Input,
  BetInput,
} from "./StyledComponent";

export default function Game() {
  const game = useGame();

  return (
    <div>
      <GameContainer>
        <TopPanel>Dealer hand: {game.dealerCount}</TopPanel>
        <Table>
          <Deck>
            {game.roundState === null ? (
              <CardDummy src="https://www.researchgate.net/profile/Francisco_Perales2/publication/334204491/figure/fig1/AS:776599045697537@1562167049292/Question-card-Symbol-question-mark-example-card.jpg" />
            ) : (
              game.dealerHand.map((card, index) => (
                <Card src={card.image} key={index} />
              ))
            )}
          </Deck>
          <GameStatus>
            <GameStatusPtag>{game.roundResult}</GameStatusPtag>
            <GameStatusPtag>{game.gameStateText}</GameStatusPtag>
          </GameStatus>
          <Deck>
            {game.roundState === null ? (
              <CardDummy src="https://www.researchgate.net/profile/Francisco_Perales2/publication/334204491/figure/fig1/AS:776599045697537@1562167049292/Question-card-Symbol-question-mark-example-card.jpg" />
            ) : (
              game.playerHand.map((card, index) => (
                <Card src={card.image} key={index} />
              ))
            )}
          </Deck>
        </Table>
        <BotPanel>
          <p style={{ margin: "0" }}>Player hand: {game.playerCount}</p>
          <p style={{ margin: "0" }}>Round: {game.roundNo}/5</p>
          <p style={{ margin: "0" }}>Credit: ${game.creditDisplayVal}</p>
        </BotPanel>
        <ControlsContainer>
          <Button
            onClick={game.handleHit}
            disabled={game.actionBtnsDisabled ? true : false}
          >
            Hit
          </Button>
          <Button
            onClick={game.handleStand}
            disabled={game.actionBtnsDisabled ? true : false}
          >
            Stand
          </Button>
          <Button
            onClick={game.handleDouble}
            disabled={game.isDoubleBtnDisabled}
          >
            Double
          </Button>
        </ControlsContainer>
        <ControlsContainer>
          <Button
            onClick={game.handleNewRound}
            disabled={
              game.isRoundBtnDisabled || game.isBetFaulty ? true : false
            }
            style={{ backgroundColor: "orange" }}
          >
            New Round
          </Button>
          <BetContainer>
            Your bet:
            <Input
              name="betInput"
              type="number"
              value={game.bet}
              onChange={game.handleBetChange}
              disabled={game.isBetInputDisabled}
              autoFocus
            />
          </BetContainer>
        </ControlsContainer>
        <ControlsContainer>
          <Button
            onClick={game.startGame}
            disabled={/*game.isGameOn ||*/ game.isBetFaulty ? true : false}
            style={{ backgroundColor: "#5F9EA0" }}
          >
            New game
          </Button>
          <BetInput
            name="playerInput"
            type="text"
            value={game.playerName}
            onChange={game.handlePlayerNameChange}
            disabled={game.isGameOn}
          />
        </ControlsContainer>
      </GameContainer>
      <p
        style={{
          display: game.isBetFaulty ? "block" : "none",
          color: "red",
        }}
      >
        Bet must be a number between 1 and {game.credit}!
      </p>
      <div></div>

      <div></div>

      <div>
        <div>
          <p>Rank</p>
          <ol>
            {game.rankSorted.map((obj, index) => {
              return (
                <div key={index}>
                  <li>
                    {obj.playerName} - ${obj.credit} - {obj.date}
                  </li>
                </div>
              );
            })}
          </ol>
        </div>
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
