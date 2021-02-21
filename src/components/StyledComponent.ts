import styled from "styled-components";

const GameContainer = styled.div`
  margin: 0 auto;
  max-width: 450px;
`;

const Wrapper = styled.div`
  max-width: 450px;
  margin: 0 auto;
  @media (min-width: 450px) {
    margin: 0 auto;
    display: flex;
  }
`;

const Container = styled.div`
  width: 300.5px;
  margin: 0 auto;
  margin-right: 5px;
`;

const TopPanel = styled.div`
  background-color: #800000;
  border-radius: 0.5rem 0.5rem 0 0;
  font-size: 1rem;
  color: white;
  padding: 0.25rem;
  margin-bottom: 0;
`;

const BotPanel = styled(TopPanel)`
  border-radius: 0 0 0.5rem 0.5rem;
  display: flex;
  justify-content: space-between;
`;

const Table = styled.div`
  background-color: #007553;
  padding: 5px 0;
`;

const Card = styled.img`
  height: 130px;
  margin-right: 5px;
`;

const CardDummy = styled(Card)`
  border-radius: 0.5rem;
`;

const Deck = styled.div`
  margin: 0 0 0 5px;
  display: flex;
  height: 130px;
`;

const GameStatus = styled.div`
  background-color: #fff8dc;
  margin: 0 5px 0 5px;
  border-radius: 0.5rem;
`;

const GameStatusPtag = styled.p`
  margin: 5px 0;
  text-align: center;
  font-size: 1rem;
  font-family: Arial;
`;

const ControlsContainer = styled.div`
  margin: 5px 0 0 0;
  justify-content: space-between;
  display: flex;
`;

const BetContainer = styled.div`
  width: 66%;
  background-color: #ffff00;
  padding: 0;
  font-size: 1rem;
  font-family: Arial;
  font-weight: 600;
  border-radius: 0.5rem;
  border: solid 0.5px gray;
  align-items: center;
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  width: 32%;
  border-radius: 0.5rem;
  border: solid 0.5px gray;
  font-size: 1rem;
  font-weight: 600;
  background-color: #fff8dc;
  padding: 0.25rem 0;
`;

const BtnNewGame = styled(Button)`
  background-color: #dda0dd;
`;

const BtnNewRound = styled(Button)`
  background-color: #ffc0cb;
`;

const Input = styled.input`
  width: 40%;
  margin: 0 0 0 1rem;
  padding: 0;
  font-size: 1rem;
`;

const PlayerInput = styled.input`
  width: 66%;
  background-color: #ffff00;
  border-radius: 0.5rem;
  border: solid 0.5px gray;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  padding: 0;
`;

const RoundHistoryContainer = styled.div`
  background-color: #dda0dd;
  border-radius: 0.5rem;
  width: 135px;
  padding: 0 5px;
  border: solid 0.5px gray;
`;

const TitlePTag = styled.p`
  font-size: 1rem;
  font-weight: 800;
  font-family: Arial;
  text-align: center;
  margin: 0 0 1rem 0;
`;

const RoundHistoryRecordPtag = styled.p`
  font-size: 0.75rem;
  font-family: Arial;
  margin: 0;
`;

const RoundHistoryRecord = styled.div`
  border-bottom: dashed 0.5px whitesmoke;
`;

const RankContainer = styled.div`
  background-color: #48D1CC;
  border-radius: 0.5rem;
  padding: 0 5px;
  max-440px;
  margin-top: 5px;
`;

const RankRecordLiTag = styled.li`
  font-size: 1rem;
  font-family: Arial;
  justify-content: center;
`;

const FaultyBetPTag = styled.p`
  font-size: 0.75rem;
  font-family: Arial;
  margin: 5px 0 0 0;
  text-align: center;
  background-color: red;
  border-radius: 0.5rem;
  color: white;
`;

export {
  GameContainer,
  Container,
  TopPanel,
  Table,
  Card,
  CardDummy,
  Deck,
  GameStatus,
  GameStatusPtag,
  BotPanel,
  ControlsContainer,
  Button,
  BtnNewGame,
  BtnNewRound,
  BetContainer,
  Input,
  PlayerInput,
  RoundHistoryContainer,
  Wrapper,
  RoundHistoryRecordPtag,
  RankContainer,
  TitlePTag,
  RankRecordLiTag,
  FaultyBetPTag,
  RoundHistoryRecord,
};
