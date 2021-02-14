import { stringify } from "querystring";
import { useEffect, useState } from "react";

export default function useExchange() {
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
    value: string | number;
    suit: string;
  }

  const [deck, setDeck] = useState<Deck>({
    success: true,
    deck_id: "",
    cards: [
      {
        code: "",
        image: "",
        images: { svg: "", png: "" },
        value: "",
        suit: "",
      },
    ],
    remaining: 0,
  });
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

  const [playerHand, setPlayerHand] = useState<Array<Card>>([]);
  const [croupierHand, setCroupierHand] = useState<Array<Card>>([]);

  async function getDeck() {
    const url = `https://deckofcardsapi.com/api/deck/new/draw/?count=6`;
    const res = await fetch(url);
    const deckData = await res.json();
    //console.log(deckData.cards);
    setDeck(deckData);
  }

  function splitCards(deck: Deck) {
    let playerDeck = [];
    let croupierDeck = [];
    for (let i = 0; i < 6; i++) {
      if (i % 2 == 0) {
        croupierDeck.push(deck.cards[i]);
      } else {
        playerDeck.push(deck.cards[i]);
      }
    }
    setPlayerDeck(playerDeck);
    setCroupierDeck(croupierDeck);
    console.log(playerDeck);
  }

  function showCards(
    playerDeck: Card[],
    cardsCountDisplayPlayer: Number,
    cardsCountDisplayCroupier: Number
  ) {
    let playerHand = [];
    let croupierHand = [];
    for (let i = 0; i <= cardsCountDisplayPlayer; i++) {
      playerHand.push(playerDeck[i]);
      console.log(playerDeck[i]);
    }
    setPlayerHand(playerHand);
    console.log(playerHand);

    for (let i = 0; i <= cardsCountDisplayCroupier; i++) {
      croupierHand.push(playerDeck[i]);
    }
    setCroupierHand(croupierHand);
  }

  function startGame(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setGameOn(true);
  }

  useEffect(() => {
    getDeck();
  }, []);

  useEffect(() => {
    splitCards(deck);
  }, [gameOn, deck]);

  useEffect(() => {
    showCards(playerDeck, cardsCountDisplayPlayer, cardsCountDisplayCroupier);
  }, [playerDeck, croupierDeck]);

  return {
    deck,
    startGame,
    playerDeck,
    croupierDeck,
    gameOn,
    cardsCountDisplayPlayer,
    playerHand,
    croupierHand,
  };
}
