import useGame from "./useGame";
// import Card from "./Card";
import {
  GameContainer,
  Container,
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
  PlayerInput,
  RoundHistoryContainer,
  TitlePTag,
  Wrapper,
  RoundHistoryRecordPtag,
  RankContainer,
  RankRecordLiTag,
  FaultyBetPTag,
} from "./StyledComponent";

export default function Game() {
  const game = useGame();

  return (
    <GameContainer>
      <Wrapper>
        <Container>
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
              style={{ backgroundColor: "#FFC0CB" }}
            >
              New round
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
              style={{ backgroundColor: "#DDA0DD" }}
            >
              New game
            </Button>
            <PlayerInput
              name="playerInput"
              type="text"
              value={game.playerName}
              onChange={game.handlePlayerNameChange}
              //disabled={game.isGameOn}
            />
          </ControlsContainer>
          <FaultyBetPTag
            style={{
              display: game.isBetFaulty ? "block" : "none",
            }}
          >
            Bet must be a number between 1 and {game.credit}!
          </FaultyBetPTag>
        </Container>
        <RoundHistoryContainer>
          <TitlePTag>Round History</TitlePTag>
          <div>
            {game.roundHistory.map((obj, index) => {
              return (
                <div key={index}>
                  <RoundHistoryRecordPtag>
                    Round: {obj.round}
                  </RoundHistoryRecordPtag>
                  <RoundHistoryRecordPtag>
                    Dealer Score: {obj.dealerCount}
                  </RoundHistoryRecordPtag>
                  <RoundHistoryRecordPtag>
                    Cards:{" "}
                    {obj.dealerHand.map((array, index) => {
                      return <span key={index}>{array.code} </span>;
                    })}
                  </RoundHistoryRecordPtag>
                  <RoundHistoryRecordPtag>
                    Player Score: {obj.playerCount}
                  </RoundHistoryRecordPtag>
                  <RoundHistoryRecordPtag>
                    {" "}
                    Cards:{" "}
                    {obj.playerHand.map((array, index) => {
                      return <span key={index}>{array.code} </span>;
                    })}
                  </RoundHistoryRecordPtag>
                  <hr />
                </div>
              );
            })}
          </div>
        </RoundHistoryContainer>
      </Wrapper>
      <RankContainer>
        <TitlePTag>Rank</TitlePTag>
        <ol>
          {game.rankSorted.map((obj, index) => {
            return (
              <div key={index}>
                <RankRecordLiTag>
                  {obj.playerName} - ${obj.credit} - {obj.date}
                </RankRecordLiTag>
              </div>
            );
          })}
        </ol>
      </RankContainer>
    </GameContainer>
  );
}
