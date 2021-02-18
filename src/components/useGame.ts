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

  const [isGameOn, setIsGameOn] = useState<boolean>(false);
  const [roundNo, setRoundNo] = useState<number>(0);
  const [roundHistory, setRoundHistory] = useState([{}]);

  const [cardsCountDisplayPlayer, setCardsCountDisplayPlayer] = useState(2);
  const [cardsCountDisplayDealer, setcardsCountDisplayDealer] = useState(1);

  const [roundState, setRoundState] = useState<RoundState>(null);
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
    setIsGameOn(true);
    setCardsCountDisplayPlayer(2);
    setcardsCountDisplayDealer(1);
    setRoundNo(1);
    setRoundState("In progress");
    getDeck().then((deckData) => {
      splitCards(deckData);
      setActionBtnsDisabled(false);
    });
  }

  function handleHit() {
    setIsDealerTurn(true);
    setActionBtnsDisabled(true);
    setIsRoundBtnDisabled(false);
    setCardsCountDisplayPlayer(3);
    setcardsCountDisplayDealer(2);
  }

  function handleStand() {
    setIsDealerTurn(true);
    setActionBtnsDisabled(true);
    setIsRoundBtnDisabled(false);
    setcardsCountDisplayDealer(2);
  }

  function handleNewRound() {
    setIsRoundBtnDisabled(true);
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

  function compareCounts(playerCount: number, dealerCount: number) {
    if (playerCount > dealerCount) {
      setRoundState("Win");
      console.log("win");
      console.log(playerCount, dealerCount);
    } else if (playerCount < dealerCount) {
      setRoundState("Loose");
      console.log("loose");
      console.log(playerCount, dealerCount);
    } else {
      setRoundState("Draw");
      console.log("draw");
      console.log(playerCount, dealerCount);
    }
  }

  const dealerHand = dealerDeck.slice(0, cardsCountDisplayDealer);
  const playerHand = playerDeck.slice(0, cardsCountDisplayPlayer);
  const playerCount = count(playerHand);
  const dealerCount = count(dealerHand);

  // useEffect(() => {
  //   if (isGameOn) {
  //     if (playerCount === 21) {
  //       setRoundState("Win");
  //       console.log("win!");
  //     }
  //   }
  // }, [isGameOn]);

  useEffect(() => {
    if (roundState !== "In progress") {
      setActionBtnsDisabled(true);
    }

    if (roundState !== "In progress" && roundNo === 5) {
      setIsGameOn(false);
      setIsRoundBtnDisabled(true);
    }
  }, [roundState]);

  //   useEffect(() => {
  //     if (dealerCount < 17 && isDealerTurn) {
  //       setcardsCountDisplayDealer(3);
  //     }
  //   }, [cardsCountDisplayDealer]);

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
            } else if (dealerCount < 17 && cardsCountDisplayDealer === 3) {
              if (dealerCount === 21) {
                setRoundState("Draw");
                console.log("draw");
              } else {
                setRoundState("Win");
                console.log("win");
              }
            } else {
              setRoundState("Win");
              console.log("win");
            }
          } else {
            if (cardsCountDisplayDealer === 1) {
              setcardsCountDisplayDealer(2);
            } else if (dealerCount === 21 && cardsCountDisplayDealer === 2) {
              setRoundState("Loose");
              console.log("loose");
            } else if (dealerCount < 17 && cardsCountDisplayDealer === 2) {
              setcardsCountDisplayDealer(3);
            } else if (dealerCount < 17 && cardsCountDisplayDealer === 3) {
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
          }
        } else if (cardsCountDisplayPlayer === 2 && isDealerTurn) {
          if (cardsCountDisplayDealer === 1) {
            setcardsCountDisplayDealer(2);
          } else if (dealerCount === 21 && cardsCountDisplayDealer === 2) {
            setRoundState("Loose");
            console.log("loose");
          } else if (dealerCount < 17 && cardsCountDisplayDealer === 2) {
            setcardsCountDisplayDealer(3);
          } else if (dealerCount < 17 && cardsCountDisplayDealer === 3) {
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
        }
      }

      // if (isDealerTurn && cardsCountDisplayDealer === 2) {
      //   if (dealerCount > 21) {
      //     setRoundState("Win");
      //     console.log("win");
      //   } else if (dealerCount < 17) {
      //     console.log(`dealer count when 3rd card shown: ${dealerCount}`);
      //     setcardsCountDisplayDealer(3);
      //   } else if (dealerCount === 21) {
      //     setRoundState("Loose");
      //     console.log("loose");
      //   } else if (playerCount > 21) {
      //     setRoundState("Loose");
      //     console.log("loose");
      //   } else {
      //     compareCounts(playerCount, dealerCount);
      //   }
      // } else if (isDealerTurn && playerCount > 21) {
      //   setRoundState("Loose");
      //   console.log("loose");
      // } else if (isDealerTurn && dealerCount < 21 && playerCount < 21) {
      //   compareCounts(playerCount, dealerCount);
      // } else if (isDealerTurn && dealerCount === 21) {
      //   setRoundState("Loose");
      //   console.log("loose");
      // } else if (isDealerTurn && dealerCount > 21) {
      //   setRoundState("Win");
      //   console.log("win");
      // }
    }
  }, [
    dealerCount,
    playerCount,
    isDealerTurn,
    cardsCountDisplayDealer,
    cardsCountDisplayPlayer,
    isGameOn,
  ]);

  //[cardsCountDisplayDealer, dealerCount, isDealerTurn, playerCount]

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
  };
}
