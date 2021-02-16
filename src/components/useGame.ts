import { count } from "console";
import { stringify } from "querystring";
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

const poitns = {
  QUEEN: 10,
  ACE: 10,
};

export default function useExchange() {
  const [playerDeck, setPlayerDeck] = useState<Array<Card>>([]);
  const [dealerDeck, setdealerDeck] = useState<Array<Card>>([]);
  const [gameOn, setGameOn] = useState<boolean>(false);
  const [cardsCountDisplayPlayer, setCardsCountDisplayPlayer] = useState(2);
  const [cardsCountDisplayDealer, setcardsCountDisplayDealer] = useState(1);
  const [playerCount, setPlayerCount] = useState(0);
  const [dealerCount, setdealerCount] = useState(0);
  const [winner, setWinner] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [actionBtnsDisabled, setActionBtnsDisabled] = useState<boolean>(true);
  const [gameStatus, setGameStatus] = useState("");
  const [isDealerTurn, setIsDealerTurn] = useState<boolean>(false);

  async function getDeck() {
    const url = `https://deckofcardsapi.com/api/deck/new/draw/?count=6`;
    const res = await fetch(url);
    const deckData = await res.json();
    splitCards(deckData);
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

  const dealerHand = dealerDeck.slice(0, cardsCountDisplayDealer);
  const playerHand = playerDeck.slice(0, cardsCountDisplayPlayer);

  function startGame() {
    setGameOn(true);
    getDeck();
    setActionBtnsDisabled(false);
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

  function checkValue(props: string): number {
    if (props === "ACE") {
      return 11;
    } else if (props === "QUEEN" || props === "KING" || props === "JACK") {
      return 10;
    } else {
      return Number(props);
    }
  }

  function countPlayer(playerHand: Array<Card>) {
    let playerCount = 0;
    for (const card of playerHand) {
      playerCount = playerCount + checkValue(card.value);
    }
    setPlayerCount(playerCount);
  }

  function countDealer(dealerHand: Array<Card>) {
    let dealerCount = 0;
    for (const card of dealerHand) {
      dealerCount = dealerCount + checkValue(card.value);
    }
    setdealerCount(dealerCount);
  }

  function compareCounts(playerCount: number, dealerCount: number) {
    if (playerCount > dealerCount) {
      console.log("win");
      console.log(playerCount, dealerCount);
    } else if (playerCount < dealerCount) {
      console.log("loose");
      console.log(playerCount, dealerCount);
    } else {
      console.log("draw");
      console.log(playerCount, dealerCount);
    }
  }

  useEffect(() => {
    if (gameOn) {
      if (playerCount >= 21) {
        console.log("win!");
      }
    }
  }, [gameOn]);

  useEffect(() => {
    countPlayer(playerHand);
    countDealer(dealerHand);
  }, [
    gameOn,
    playerHand,
    dealerHand,
    cardsCountDisplayDealer,
    cardsCountDisplayPlayer,
  ]);

  useEffect(() => {
    if (playerHand.length > 2) {
      if (playerCount > 21) {
        console.log("loose");
      } else if (playerCount === 21) {
        console.log("win");
      }
    }
  }, [playerHand]);

  useEffect(() => {
    if (isDealerTurn && cardsCountDisplayDealer === 2) {
      if (dealerCount >= 21) {
        console.log("loose");
      } else if (dealerCount < 17) {
        console.log(`dealer count when 3rd card shown: ${dealerCount}`);
        setcardsCountDisplayDealer(3);
      } else {
        compareCounts(playerCount, dealerCount);
      }
    } else if (isDealerTurn && dealerCount < 21) {
      compareCounts(playerCount, dealerCount);
    } else if (isDealerTurn) {
      console.log("win");
      compareCounts(playerCount, dealerCount);
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
    winner,
    gameStatus,
  };
}
