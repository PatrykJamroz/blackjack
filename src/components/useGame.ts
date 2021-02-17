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

export default function useGame() {
  const [playerDeck, setPlayerDeck] = useState<Array<Card>>([]);
  const [dealerDeck, setdealerDeck] = useState<Array<Card>>([]);

  const [gameOn, setGameOn] = useState<boolean>(false);
  const [roundNo, setRoundNo] = useState<number>(0);
  const [roundHistory, setRoundHistory] = useState([{}]);

  const [cardsCountDisplayPlayer, setCardsCountDisplayPlayer] = useState(2);
  const [cardsCountDisplayDealer, setcardsCountDisplayDealer] = useState(1);

  const [roundState, setroundState] = useState<RoundState>(null);
  //const [roundLoose, setRoundLoose] = useState<boolean>(false);

  const [actionBtnsDisabled, setActionBtnsDisabled] = useState<boolean>(true);
  const [isRoundBtnDisabled, setIsRoundBtnDisabled] = useState<boolean>(true);

  const [isDealerTurn, setIsDealerTurn] = useState<boolean>(false);

  // let roundHistory = [{}];

  async function getDeck() {
    const url = `https://deckofcardsapi.com/api/deck/new/draw/?count=6`;
    const res = await fetch(url);
    const deckData = await res.json();
    return deckData;
  }

  function splitCards(deck: Deck) {
    let playerDeck = [];
    let dealerDeck = [];
    for (const [index, card] of Object.entries(deck.cards)) {
      const i = Number(index);
      if (i % 2 == 0) {
        dealerDeck.push(card);
      } else {
        playerDeck.push(card);
      }
    }
    setPlayerDeck(playerDeck);
    setdealerDeck(dealerDeck);
  }

  function startGame() {
    setGameOn(true);
    setRoundNo(roundNo + 1);
    setroundState("In progress");
    getDeck().then((deckData) => {
      splitCards(deckData);
      setActionBtnsDisabled(false);
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
    setroundState("In progress");
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

  function compareCounts(playerCount: number, dealerCount: number) {
    if (playerCount > dealerCount) {
      setroundState("Win");
      console.log("win");
      console.log(playerCount, dealerCount);
    } else if (playerCount < dealerCount) {
      setroundState("Loose");
      console.log("loose");
      console.log(playerCount, dealerCount);
    } else {
      setroundState("Draw");
      console.log("draw");
      console.log(playerCount, dealerCount);
    }
  }

  const dealerHand = dealerDeck.slice(0, cardsCountDisplayDealer);
  const playerHand = playerDeck.slice(0, cardsCountDisplayPlayer);
  const playerCount = count(playerHand);
  const dealerCount = count(dealerHand);

  useEffect(() => {
    if (roundState === "In progress" || roundState === null) {
      setIsRoundBtnDisabled(true);
    } else {
      setIsRoundBtnDisabled(false);
      setRoundHistory([
        ...roundHistory,
        {
          playerHand: playerHand,
          playerCount: playerCount,
          dealerHand: dealerHand,
          dealerCount: dealerCount,
        },
      ]);

      console.log(`Round no: ${roundNo}`);
      console.log(roundHistory);
    }
  }, [roundState, roundNo]);

  useEffect(() => {
    if (gameOn) {
      if (playerCount === 21) {
        setroundState("Win");
        console.log("win!");
      }
    }
  }, [gameOn, playerCount]);

  useEffect(() => {
    if (roundNo > 4 && roundState !== "In progress") {
      //setGameOn(false);
      setIsRoundBtnDisabled(true);
      setActionBtnsDisabled(true);
      setGameOn(false);
    }
  }, [roundNo, gameOn, roundState]);

  useEffect(() => {
    if (isDealerTurn && cardsCountDisplayDealer === 2) {
      if (dealerCount > 21) {
        setroundState("Win");
        console.log("win");
      } else if (dealerCount < 17) {
        console.log(`dealer count when 3rd card shown: ${dealerCount}`);
        setcardsCountDisplayDealer(3);
      } else if (dealerCount === 21) {
        setroundState("Loose");
        console.log("loose");
      } else if (playerCount > 21) {
        setroundState("Loose");
        console.log("loose");
      } else {
        compareCounts(playerCount, dealerCount);
      }
    } else if (isDealerTurn && playerCount > 21) {
      setroundState("Loose");
      console.log("loose");
    } else if (isDealerTurn && dealerCount < 21 && playerCount < 21) {
      compareCounts(playerCount, dealerCount);
    } else if (isDealerTurn && dealerCount === 21) {
      setroundState("Loose");
      console.log("loose");
    } else if (isDealerTurn && dealerCount > 21) {
      setroundState("Win");
      console.log("win");
    }
  }, [cardsCountDisplayDealer, dealerCount, isDealerTurn, playerCount]);

  return {
    startGame,
    playerDeck,
    dealerDeck,
    gameOn,
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
  };
}
