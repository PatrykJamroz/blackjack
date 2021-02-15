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
  const [
    cardsCountDisplayPlayer,
    setCardsCountDisplayPlayer,
  ] = useState<Number>(2);
  const [
    cardsCountDisplayCroupier,
    setCardsCountDisplayCroupier,
  ] = useState<Number>(1);

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

  function startGame() {
    setGameOn(true);
  }

  useEffect(() => {
    getDeck();
  }, []);

  const croupierHand = croupierDeck.slice(0, 1);
  const playerHand = playerDeck.slice(0, 2);

  return {
    startGame,
    playerDeck,
    croupierDeck,
    gameOn,
    cardsCountDisplayPlayer,
    playerHand,
    croupierHand,
  };
}
