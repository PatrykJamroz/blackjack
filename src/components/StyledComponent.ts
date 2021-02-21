import styled from "styled-components";

const GameContainer = styled.div`
  width: 300.5px;
  margin: 0 auto;
`;

const TopPanel = styled.div`
  background-color: brown;
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
  background-color: green;
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
  background-color: yellow;
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
  background-color: #7fffd4;
  padding: 0;
  font-size: 1rem;
  font-family: Arial;
  font-weight: 600;
  border-radius: 0.5rem;
  align-items: center;
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  width: 32%;
  border-radius: 0.5rem;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  background-color: yellow;
  padding: 0.25rem 0;
`;

const Input = styled.input`
  width: 40%;
  margin: 0 0 0 1rem;
  padding: 0;
  font-size: 1rem;
`;

const BetInput = styled.input`
  width: 66%;
  background-color: #7fffd4;
  border-radius: 0.5rem;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  padding: 0;
`;

export {
  GameContainer,
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
  BetContainer,
  Input,
  BetInput,
};
