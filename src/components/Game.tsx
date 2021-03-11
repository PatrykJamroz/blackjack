import useGame from "./useGame";
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
  RoundHistoryRecord,
  BtnNewGame,
  BtnNewRound,
} from "./StyledComponent";

const unknownCardURL =
  "https://www.researchgate.net/profile/Francisco_Perales2/publication/334204491/figure/fig1/AS:776599045697537@1562167049292/Question-card-Symbol-question-mark-example-card.jpg";

export default function Game() {
  const game = useGame();

  return (
    <GameContainer>
      <Wrapper>
        <Container>
          <TopPanel>Dealer hand: {game.dealerCount}</TopPanel>
          <Table>
            <Deck>
              {game.globalState.roundState === null ? (
                <CardDummy src={unknownCardURL} />
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
              {game.globalState.roundState === null ? (
                <CardDummy src={unknownCardURL} />
              ) : (
                game.playerHand.map((card, index) => (
                  <Card src={card.image} key={index} />
                ))
              )}
            </Deck>
          </Table>
          <BotPanel>
            <p style={{ margin: "0" }}>Player hand: {game.playerCount}</p>
            <p style={{ margin: "0" }}>Round: {game.globalState.roundNo}/5</p>
            <p style={{ margin: "0" }}>Credit: ${game.creditDisplayVal}</p>
          </BotPanel>
          <ControlsContainer>
            <Button
              onClick={game.handleHit}
              disabled={game.globalState.actionBtnsDisabled ? true : false}
            >
              Hit
            </Button>
            <Button
              onClick={game.handleStand}
              disabled={game.globalState.actionBtnsDisabled ? true : false}
            >
              Stand
            </Button>
            <Button
              onClick={game.handleDouble}
              disabled={game.globalState.isDoubleBtnDisabled}
            >
              Double
            </Button>
          </ControlsContainer>
          <ControlsContainer>
            <BtnNewRound
              onClick={game.handleNewRound}
              disabled={
                game.globalState.isRoundBtnDisabled ||
                game.globalState.isBetFaulty
                  ? true
                  : false
              }
            >
              New round
            </BtnNewRound>
            <BetContainer>
              Your bet:
              <Input
                name="betInput"
                type="number"
                value={game.globalState.bet}
                onChange={game.handleBetChange}
                disabled={game.globalState.isBetInputDisabled}
                autoFocus
              />
            </BetContainer>
          </ControlsContainer>
          <ControlsContainer>
            <BtnNewGame
              onClick={game.startGame}
              disabled={game.globalState.isBetFaulty ? true : false}
            >
              New game
            </BtnNewGame>
            <PlayerInput
              name="playerInput"
              type="text"
              value={game.globalState.playerName}
              onChange={game.handlePlayerNameChange}
            />
          </ControlsContainer>
          <FaultyBetPTag
            style={{
              display: game.globalState.isBetFaulty ? "block" : "none",
            }}
          >
            {
              game.globalState
                .isBetFaultyMessage /* Bet must be a number between 1 and {game.globalState.credit}! */
            }
          </FaultyBetPTag>
        </Container>
        <RoundHistoryContainer>
          <TitlePTag>Round History</TitlePTag>
          <div>
            {game.globalState.roundHistory.map((obj, index) => {
              return (
                <RoundHistoryRecord key={index}>
                  <RoundHistoryRecordPtag>
                    <span style={{ fontWeight: "bold" }}>Round:</span>{" "}
                    {obj.round}
                  </RoundHistoryRecordPtag>
                  <RoundHistoryRecordPtag>
                    <span style={{ fontWeight: "bold" }}>Dealer score:</span>{" "}
                    {obj.dealerCount}
                  </RoundHistoryRecordPtag>
                  <RoundHistoryRecordPtag>
                    <span style={{ fontWeight: "bold" }}>Dealer cards:</span>{" "}
                    {obj.dealerHand}
                  </RoundHistoryRecordPtag>
                  <RoundHistoryRecordPtag>
                    <span style={{ fontWeight: "bold" }}>Player score:</span>{" "}
                    {obj.playerCount}
                  </RoundHistoryRecordPtag>
                  <RoundHistoryRecordPtag>
                    {" "}
                    <span style={{ fontWeight: "bold" }}>
                      Player cards:
                    </span>{" "}
                    {obj.playerHand}
                  </RoundHistoryRecordPtag>
                </RoundHistoryRecord>
              );
            })}
          </div>
        </RoundHistoryContainer>
      </Wrapper>
      <RankContainer>
        <TitlePTag>Ranking</TitlePTag>
        <ol style={{ margin: 0 }}>
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
