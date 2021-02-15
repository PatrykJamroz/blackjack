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
  const [croupierDeck, setCroupierDeck] = useState<Array<Card>>([]);
  const [gameOn, setGameOn] = useState<boolean>(false);
  const [cardsCountDisplayPlayer, setCardsCountDisplayPlayer] = useState(2);
  const [cardsCountDisplayCroupier, setCardsCountDisplayCroupier] = useState(1);
  const [playerCount, setPlayerCount] = useState(0);
  const [croupierCount, setCroupierCount] = useState(0);
  const [winner, setWinner] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [actionBtnsDisabled, setActionBtnsDisabled] = useState<boolean>(true);
  const [gameStatus, setGameStatus] = useState("");

  async function getDeck() {
    const url = `https://deckofcardsapi.com/api/deck/new/draw/?count=6`;
    const res = await fetch(url);
    const deckData = await res.json();
    splitCards(deckData);
  }

  function splitCards(deck: Deck) {
    let playerDeck = [];
    let croupierDeck = [];
    for (const [index, card] of Object.entries(deck.cards)) {
      const i = Number(index);
      if (i % 2 == 0) {
        croupierDeck.push(card);
      } else {
        playerDeck.push(card);
      }
    }
    setPlayerDeck(playerDeck);
    setCroupierDeck(croupierDeck);
  }

  const croupierHand = croupierDeck.slice(0, cardsCountDisplayCroupier);
  const playerHand = playerDeck.slice(0, cardsCountDisplayPlayer);

  function startGame() {
    setGameOn(true);
    getDeck();
    setActionBtnsDisabled(false);
  }

  function handleHit() {
    setActionBtnsDisabled(true);
    setCardsCountDisplayPlayer(3);
    setCardsCountDisplayCroupier(2);
  }

  function handleStand() {
    setActionBtnsDisabled(true);
    setCardsCountDisplayCroupier(2);
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

  function countCroupier(croupierHand: Array<Card>) {
    let croupierCount = 0;
    for (const card of croupierHand) {
      //console.log(card.value);
      croupierCount = croupierCount + checkValue(card.value);
    }
    //return croupierCount;
    setCroupierCount(croupierCount);
    if (croupierHand.length === 2 && croupierCount < 17 && playerCount < 21) {
      setCardsCountDisplayCroupier(3);
    }
  }

  function roundChecker(
    playerCount: number,
    croupierCount: number,
    playerHand: Array<Card>,
    croupierHand: Array<Card>
  ) {
    if (playerCount === 21) {
      //setGameStatus("You WON!");
      console.log("win");
    } else if (croupierCount === 21) {
      console.log("loose");
    } else if (playerCount > 21) {
      console.log("loose");
    } else if (croupierCount > 21) {
      console.log("win");
    } else if (
      croupierCount < playerCount &&
      playerHand.length == croupierHand.length &&
      croupierCount > 16
    ) {
      console.log("win");
    } else if (
      croupierCount > playerCount &&
      croupierCount < 21 &&
      croupierHand.length > 1 &&
      croupierCount > 16
    ) {
      console.log("loose");
    } else if (croupierCount === playerCount && croupierCount > 0) {
      console.log("draw");
    } else if (
      croupierCount < playerCount &&
      playerCount < 21 &&
      croupierHand.length >= playerHand.length &&
      croupierCount > 16
    ) {
      console.log("win");
    } else if (
      playerCount < croupierCount &&
      croupierHand.length === 3 &&
      croupierCount < 21
    ) {
      console.log("loose");
    } else if (
      playerCount > croupierCount &&
      croupierHand.length > playerHand.length
    ) {
      console.log("win");
    }
  }

  function countPlayer(playerHand: Array<Card>) {
    //console.log(playerHand);
    let playerCount = 0;
    for (const card of playerHand) {
      //console.log(card.value);
      playerCount = playerCount + checkValue(card.value);
    }
    setPlayerCount(playerCount);

    /*if (playerCount > 21) {
      setGameOver(true);
      setGameStatus("You loose!");
      //console.log("You Lost!");
    } else if (playerCount === 21) {
      setWinner(true);
      setGameStatus("You Won!");
      setActionBtnsDisabled(true);
      //console.log("You WON!");
    }*/
  }

  useEffect(() => {
    //console.log(playerHand);
    countPlayer(playerHand);
    countCroupier(croupierHand);
  }, [playerHand]);

  useEffect(() => {
    roundChecker(playerCount, croupierCount, playerHand, croupierHand);
  }, [playerCount, croupierCount]);

  return {
    startGame,
    playerDeck,
    croupierDeck,
    gameOn,
    cardsCountDisplayPlayer,
    playerHand,
    croupierHand,
    playerCount,
    croupierCount,
    handleHit,
    handleStand,
    actionBtnsDisabled,
    winner,
    gameStatus,
  };
}
