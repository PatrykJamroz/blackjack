import { type } from "os";
import { useEffect, useState } from "react";

interface Deck {
  success: boolean;
  deck_id: string;
  cards: Array<Card>;
  remaining: number;
}

interface Card {
  code: string;
  image: string;
  images: { svg: string; png: string };
  value: string;
  suit: string;
}

type RoundState = "Win" | "Loose" | "Draw" | "In progress" | null;

function getValue(props: string): number {
  if (props === "ACE") {
    return 11;
  } else if (props === "QUEEN" || props === "KING" || props === "JACK") {
    return 10;
  } else {
    return Number(props);
  }
}

function count(cards: Array<Card>): number {
  let playerCount = 0;
  let aceSeen = false;
  for (const card of cards) {
    let p = getValue(card.value);
    if (aceSeen && card.value === "ACE") {
      p = 1;
    }
    aceSeen = card.value === "ACE";
    playerCount += p;
  }
  return playerCount;
}

interface IroundHistory {
  round: number;
  playerHand: Card[];
  playerCount: number;
  dealerHand: Card[];
  dealerCount: number;
}

export default function useGame() {
  const [playerDeck, setPlayerDeck] = useState<Array<Card>>([]);
  const [dealerDeck, setdealerDeck] = useState<Array<Card>>([]);

  const [isGameOn, setIsGameOn] = useState<boolean>(false);
  const [roundNo, setRoundNo] = useState<number>(0);
  const [roundHistory, setRoundHistory] = useState<Array<IroundHistory>>([]);

  const [cardsCountDisplayPlayer, setCardsCountDisplayPlayer] = useState(2);
  const [cardsCountDisplayDealer, setcardsCountDisplayDealer] = useState(1);

  const [roundState, setRoundState] = useState<RoundState>(null);
  //const [roundLoose, setRoundLoose] = useState<boolean>(false);

  const [actionBtnsDisabled, setActionBtnsDisabled] = useState<boolean>(true);
  const [isRoundBtnDisabled, setIsRoundBtnDisabled] = useState<boolean>(true);
  const [isBetInputDisabled, setIsBetInputDisabled] = useState<boolean>(false);
  const [isBetFaulty, setIsBetFaulty] = useState<boolean>(true);

  const [isDealerTurn, setIsDealerTurn] = useState<boolean>(false);

  const [credit, setCredit] = useState<number>(1000);
  const [bet, setBet] = useState<number>(200);

  // let roundHistory = [{}];

  async function getDeck() {
    const url = `https://deckofcardsapi.com/api/deck/new/draw/?count=6`;
    const res = await fetch(url);
    const deckData = await res.json();
    return deckData;
  }

  function splitCards(deck: Deck) {
    let pDeck = [];
    let dDeck = [];
    for (const [index, card] of Object.entries(deck.cards)) {
      const i = Number(index);
      if (i % 2 == 0) {
        dDeck.push(card);
      } else {
        pDeck.push(card);
      }
    }
    setPlayerDeck(pDeck);
    setdealerDeck(dDeck);
  }

  function startGame() {
    setIsDealerTurn(false);
    setCredit(1000);
    setRoundHistory([]);
    setPlayerDeck([]);
    setdealerDeck([]);
    setIsGameOn(true);
    setRoundState("In progress");
    setCardsCountDisplayPlayer(2);
    setcardsCountDisplayDealer(1);
    setRoundNo(1);
    setActionBtnsDisabled(false);
    getDeck().then((deckData) => {
      splitCards(deckData);
    });
  }

  function handleHit() {
    setIsDealerTurn(true);
    setActionBtnsDisabled(true);
    setCardsCountDisplayPlayer(3);
    setcardsCountDisplayDealer(2);
  }

  function handleStand() {
    setIsDealerTurn(true);
    setActionBtnsDisabled(true);
    setcardsCountDisplayDealer(2);
  }

  function handleNewRound() {
    setRoundState("In progress");
    setPlayerDeck([]);
    setdealerDeck([]);
    setCardsCountDisplayPlayer(2);
    setcardsCountDisplayDealer(1);
    setIsDealerTurn(false);
    getDeck().then((deckData) => {
      splitCards(deckData);
      setActionBtnsDisabled(false);
    });
    setRoundNo(roundNo + 1);
  }

  function handleBetChange(e: React.FormEvent<HTMLInputElement>) {
    setBet(Number(e.currentTarget.value));
  }

  function calcCredit(bet: number, roundState: RoundState) {
    switch (roundState) {
      case "Win":
        setCredit(credit + bet);
        break;
      case "Loose":
        setCredit(credit - bet);
        break;
    }
  }

  function compareCounts(playerCount: number, dealerCount: number) {
    if (dealerCount > playerCount) {
      setRoundState("Loose");
      console.log("loose");
    } else if (dealerCount < playerCount) {
      setRoundState("Win");
      console.log("win");
    } else {
      setRoundState("Draw");
      console.log("draw");
    }
  }

  const dealerHand = dealerDeck.slice(0, cardsCountDisplayDealer);
  const playerHand = playerDeck.slice(0, cardsCountDisplayPlayer);
  const playerCount = count(playerHand);
  const dealerCount = count(dealerHand);

  useEffect(() => {
    bet > credit || bet === 0 ? setIsBetFaulty(true) : setIsBetFaulty(false);
  }, [bet]);

  useEffect(() => {
    if (roundState === null) {
      setIsRoundBtnDisabled(true);
    } else if (roundState === "In progress") {
      setIsRoundBtnDisabled(true);
    } else if (roundNo === 5) {
      setIsRoundBtnDisabled(true);
    } else {
      setIsRoundBtnDisabled(false);
    }
  }, [roundState, roundNo]);

  useEffect(() => {
    if (roundState !== "In progress") {
      setActionBtnsDisabled(true);
      //console.log("set buttons disabled");
    }

    if (roundState !== "In progress" && roundNo === 5) {
      setIsGameOn(false);
    }
  }, [roundState, roundNo]);

  useEffect(() => {
    switch (roundState) {
      case "Win":
      case "Loose":
      case "Draw":
        setRoundHistory([
          ...roundHistory,
          {
            round: roundNo,
            playerHand: playerHand,
            playerCount: playerCount,
            dealerHand: dealerHand,
            dealerCount: dealerCount,
          },
        ]);
        setIsBetInputDisabled(false);
        calcCredit(bet, roundState);
        console.log(roundHistory);
        break;
      case "In progress":
        setIsBetInputDisabled(true);
        break;
    }
  }, [roundState]);

  useEffect(() => {
    if (isGameOn) {
      if (!isDealerTurn && playerCount === 21) {
        if (cardsCountDisplayDealer === 1) {
          setcardsCountDisplayDealer(2);
        } else if (dealerCount === 21 && cardsCountDisplayDealer === 2) {
          setRoundState("Draw");
          console.log("draw");
        } else {
          setRoundState("Win");
          console.log("BlackJack!");
        }
      } else {
        if (cardsCountDisplayPlayer === 3) {
          if (playerCount > 21) {
            setRoundState("Loose");
            console.log("loose");
          } else if (playerCount === 21) {
            if (cardsCountDisplayDealer === 1) {
              setcardsCountDisplayDealer(2);
            } else if (dealerCount === 21 && cardsCountDisplayDealer === 2) {
              setRoundState("Draw");
              console.log("draw");
            } else if (dealerCount < 17 && cardsCountDisplayDealer === 2) {
              setcardsCountDisplayDealer(3);
            } else if (cardsCountDisplayDealer === 3) {
              // dealerCount < 17 &&
              if (dealerCount === 21) {
                setRoundState("Draw");
                console.log("draw");
              } else {
                setRoundState("Win");
                console.log("win");
              }
            } else {
              setRoundState("Win");
              console.log("win"); //lost?
            }
          } else {
            if (cardsCountDisplayDealer === 1) {
              setcardsCountDisplayDealer(2);
            } else if (dealerCount === 21 && cardsCountDisplayDealer === 2) {
              setRoundState("Loose");
              console.log("loose");
            } else if (dealerCount < 17 && cardsCountDisplayDealer === 2) {
              setcardsCountDisplayDealer(3);
            } else if (cardsCountDisplayDealer === 3) {
              //dealerCount < 17 &&
              if (dealerCount === 21) {
                setRoundState("Loose");
                console.log("loose");
              } else if (dealerCount > 21) {
                setRoundState("Win");
                console.log("win");
              } else if (dealerCount > playerCount) {
                setRoundState("Loose");
                console.log("loose");
              } else if (dealerCount < playerCount) {
                setRoundState("Win");
                console.log("win");
              } else {
                setRoundState("Draw");
                console.log("draw");
              }
            } else {
              compareCounts(playerCount, dealerCount);
            }
          }
        } else if (cardsCountDisplayPlayer === 2 && isDealerTurn) {
          if (cardsCountDisplayDealer === 1) {
            setcardsCountDisplayDealer(2);
          } else if (dealerCount === 21 && cardsCountDisplayDealer === 2) {
            setRoundState("Loose");
            console.log("loose");
          } else if (dealerCount < 17 && cardsCountDisplayDealer === 2) {
            setcardsCountDisplayDealer(3);
          } else if (cardsCountDisplayDealer === 3) {
            //dealerCount < 17 &&
            if (dealerCount === 21) {
              setRoundState("Loose");
              console.log("loose");
            } else if (dealerCount > 21) {
              setRoundState("Win");
              console.log("win");
            } else if (dealerCount > playerCount) {
              setRoundState("Loose");
              console.log("loose");
            } else if (dealerCount < playerCount) {
              setRoundState("Win");
              console.log("win");
            } else {
              setRoundState("Draw");
              console.log("draw");
            }
          } else {
            compareCounts(playerCount, dealerCount);
          }
        }
      }
    }
  }, [
    dealerCount,
    playerCount,
    isDealerTurn,
    cardsCountDisplayDealer,
    cardsCountDisplayPlayer,
    isGameOn,
  ]);

  return {
    startGame,
    playerDeck,
    dealerDeck,
    isGameOn,
    cardsCountDisplayPlayer,
    playerHand,
    dealerHand,
    playerCount,
    dealerCount,
    handleHit,
    handleStand,
    actionBtnsDisabled,
    handleNewRound,
    isRoundBtnDisabled,
    roundNo,
    roundHistory,
    roundState,
    credit,
    bet,
    handleBetChange,
    isBetInputDisabled,
    isBetFaulty,
  };
}
