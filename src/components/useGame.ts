import { useEffect, useRef, useState } from "react";

window.onbeforeunload = function () {
  return "Do you really want to close?";
};

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

interface IroundHistory {
  round: number;
  playerHand: Card[];
  playerCount: number;
  dealerHand: Card[];
  dealerCount: number;
}

interface Irank {
  playerName: string;
  credit: number;
  date: string;
}

type RoundState = "Win" | "Loose" | "Draw" | "In progress" | "Game over" | null;

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

async function getDeck() {
  const url = `https://deckofcardsapi.com/api/deck/new/draw/?count=6`;
  const res = await fetch(url);
  const deckData = await res.json();
  return deckData;
}

interface GlobalState {
  playerName: string;
  playerDeck: Array<Card>;
  dealerDeck: Array<Card>;
  credit: number;
  bet: number;
  isGameOn: boolean;
  roundNo: number;
  roundState: RoundState;
  roundHistory: Array<IroundHistory>;
  rank: Array<Irank>;
  cardsCountDisplayPlayer: number;
  cardsCountDisplayDealer: number;
  actionBtnsDisabled: boolean;
  isRoundBtnDisabled: boolean;
  isBetInputDisabled: boolean;
  isDoubleBtnDisabled: boolean;
  isBetFaulty: boolean;
  isDealerTurn: boolean;
}

export default function useGame() {
  const [globalState, setGlobalState] = useState<GlobalState>(() => {
    const globalState = localStorage.getItem("globalState");
    if (globalState) {
      return JSON.parse(globalState);
    }
    return {
      playerName: "Player Name",
      playerDeck: [],
      dealerDeck: [],
      credit: 1000,
      bet: 200,
      isGameOn: false,
      roundNo: 0,
      roundState: null,
      roundHistory: [],
      rank: [],
      cardsCountDisplayPlayer: 2,
      cardsCountDisplayDealer: 1,
      actionBtnsDisabled: true,
      isRoundBtnDisabled: true,
      isBetInputDisabled: false,
      isDoubleBtnDisabled: true,
      isBetFaulty: true,
      isDealerTurn: false,
    };
  });

  useEffect(() => {
    localStorage.setItem("globalState", JSON.stringify(globalState));
  }, [globalState]);

  function splitCards(deck: Deck) {
    let pDeck: any = [];
    let dDeck: any = [];
    for (const [index, card] of Object.entries(deck.cards)) {
      const i = Number(index);
      if (i % 2 == 0) {
        dDeck.push(card);
      } else {
        pDeck.push(card);
      }
    }
    setGlobalState((prevState) => ({
      ...prevState,
      playerDeck: pDeck,
      dealerDeck: dDeck,
    }));
  }

  function shouldSetRank(
    roundState: RoundState,
    rank: any,
    roundNo: number,
    playerName: string
  ) {
    if (roundState !== null && roundNo === 5) {
      setGlobalState((prevState) => ({
        ...prevState,
        rank: [
          ...rank,
          {
            playerName: playerName,
            credit: prevCredit,
            date: new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ],
      }));
    }
  }

  function startGame() {
    shouldSetRank(
      globalState.roundState,
      globalState.rank,
      globalState.roundNo,
      globalState.playerName
    );
    setGlobalState((prevState) => ({
      ...prevState,
      isGameOn: true,
      isDealerTurn: false,
      credit: 1000,
      roundHistory: [],
      playerDeck: [],
      dealerDeck: [],
      roundState: "In progress",
      cardsCountDisplayPlayer: 2,
      cardsCountDisplayDealer: 1,
      roundNo: 1,
      actionBtnsDisabled: false,
    }));
    getDeck().then((deckData) => {
      splitCards(deckData);
    });
  }

  function handleHit() {
    setGlobalState((prevState) => ({
      ...prevState,
      isDealerTurn: true,
      actionBtnsDisabled: true,
      cardsCountDisplayPlayer: 3,
      cardsCountDisplayDealer: 2,
    }));
  }

  function handleStand() {
    setGlobalState((prevState) => ({
      ...prevState,
      isDealerTurn: true,
      actionBtnsDisabled: true,
      cardsCountDisplayDealer: 2,
    }));
  }

  function handleDouble() {
    const doubleBet = globalState.bet * 2;
    setGlobalState((prevState) => ({
      ...prevState,
      bet: doubleBet,
      isDealerTurn: true,
      actionBtnsDisabled: true,
      cardsCountDisplayPlayer: 3,
      cardsCountDisplayDealer: 2,
    }));
  }

  function handleNewRound() {
    setGlobalState((prevState) => ({
      ...prevState,
      roundState: "In progress",
      playerDeck: [],
      dealerDeck: [],
      cardsCountDisplayPlayer: 2,
      cardsCountDisplayDealer: 1,
      isDealerTurn: false,
    }));
    getDeck().then((deckData) => {
      splitCards(deckData);
      setGlobalState((prevState) => ({
        ...prevState,
        actionBtnsDisabled: false,
      }));
    });
    const nextRoundNo = globalState.roundNo + 1;
    setGlobalState((prevState) => ({ ...prevState, roundNo: nextRoundNo }));

    // doublecheck if it's possible to do it under one setState
  }

  function handleBetChange(e: React.FormEvent<HTMLInputElement>) {
    const newBetVal = Number(e.currentTarget.value);
    setGlobalState((prevState) => ({ ...prevState, bet: newBetVal }));
  }

  function handlePlayerNameChange(e: React.FormEvent<HTMLInputElement>) {
    const newPlayerName = e.currentTarget.value;
    setGlobalState((prevState) => ({
      ...prevState,
      playerName: newPlayerName,
    }));
  }

  function calcCredit(bet: number, roundState: RoundState, credit: number) {
    const newCreditValWin = credit + 1.5 * bet;
    const newCreditValLoose = credit - bet;
    switch (roundState) {
      case "Win":
        setGlobalState((prevState) => ({
          ...prevState,
          credit: newCreditValWin,
        }));
        break;
      case "Loose":
        setGlobalState((prevState) => ({
          ...prevState,
          credit: newCreditValLoose,
        }));
        break;
    }
  }

  const prevCreditRef = useRef<number>();

  useEffect(() => {
    prevCreditRef.current = globalState.credit;
    console.log(`prevcredit: ${prevCredit} credit: ${globalState.credit}`);
  }, [globalState.credit]);

  const prevCredit = prevCreditRef.current;

  const creditDisplayVal = creditDisplay(
    globalState.credit,
    prevCredit,
    globalState.roundNo,
    globalState.roundState
  );

  function creditDisplay(
    credit: number,
    prevCredit: any,
    roundNo: number,
    roundState: RoundState
  ) {
    if (roundNo === 5) {
      return prevCredit;
    } else if (roundState === "Game over") {
      return 0;
    } else {
      return credit;
    }
  }

  const gameStateText = setGameStateText(
    globalState.roundState,
    globalState.isGameOn,
    globalState.credit,
    globalState.roundNo
  );

  function setGameStateText(
    roundState: RoundState,
    isGameOn: boolean,
    credit: number,
    roundNo: number
  ) {
    if (roundState === "Game over") {
      return "Game over! You are broke, hit new game to start over...";
    } else if (credit > 0 && roundNo !== 0 && !isGameOn) {
      return "End of the game! Set bet and click new game to start over...";
    } else if (
      roundState === "Win" ||
      roundState === "Loose" ||
      roundState === "Draw"
    ) {
      return "Click new round...";
    } else if (roundState === null) {
      return "Set bet, your name and click new game to start...";
    } else {
      return "Hit, stand or double!";
    }
  }

  const roundResult = setRoundResult(globalState.roundState);

  function setRoundResult(roundState: RoundState) {
    switch (roundState) {
      case "Win":
        return "Round won!";
      case "Loose":
        return "Round lost!";
      case "Draw":
        return "It's a draw!";
      case null:
        return "Game not started.";
      default:
        return "Round in progress...";
    }
  }

  function compareCounts(playerCount: number, dealerCount: number) {
    if (dealerCount > playerCount) {
      setGlobalState((prevState) => ({ ...prevState, roundState: "Loose" }));
    } else if (dealerCount < playerCount) {
      setGlobalState((prevState) => ({ ...prevState, roundState: "Win" }));
    } else {
      setGlobalState((prevState) => ({ ...prevState, roundState: "Draw" }));
    }
  }

  const dealerHand = globalState.dealerDeck.slice(
    0,
    globalState.cardsCountDisplayDealer
  );
  const playerHand = globalState.playerDeck.slice(
    0,
    globalState.cardsCountDisplayPlayer
  );
  const playerCount = count(playerHand);
  const dealerCount = count(dealerHand);
  const rankSorted = globalState.rank.sort((a, b) => {
    return b.credit - a.credit;
  });

  const dealerHandVals = dealerHand.map((array) => {
    return array.value;
  });
  const dealerHandValsStr = dealerHandVals.join(", ");

  const playerHandVals = playerHand.map((array) => {
    return array.value;
  });
  const playerHandValsStr = playerHandVals.join(", ");

  useEffect(() => {
    globalState.bet > globalState.credit || globalState.bet === 0
      ? setGlobalState((prevState) => ({ ...prevState, isBetFaulty: true }))
      : setGlobalState((prevState) => ({ ...prevState, isBetFaulty: false }));
  }, [globalState.bet, globalState.credit]);

  useEffect(() => {
    if (globalState.roundState === null) {
      setGlobalState((prevState) => ({
        ...prevState,
        isRoundBtnDisabled: true,
      }));
    } else if (globalState.roundState === "In progress") {
      setGlobalState((prevState) => ({
        ...prevState,
        isRoundBtnDisabled: true,
      }));
    } else if (globalState.roundNo === 5) {
      setGlobalState((prevState) => ({
        ...prevState,
        isRoundBtnDisabled: true,
      }));
    } else if (!globalState.isGameOn) {
      setGlobalState((prevState) => ({
        ...prevState,
        isRoundBtnDisabled: true,
      }));
    } else {
      setGlobalState((prevState) => ({
        ...prevState,
        isRoundBtnDisabled: false,
      }));
    }
  }, [globalState.roundState, globalState.roundNo, globalState.isGameOn]);

  useEffect(() => {
    if (globalState.roundState !== "In progress") {
      setGlobalState((prevState) => ({
        ...prevState,
        actionBtnsDisabled: true,
      }));
    }
    if (globalState.roundState !== "In progress" && globalState.roundNo === 5) {
      setGlobalState((prevState) => ({ ...prevState, isGameOn: false }));
    }
  }, [globalState.roundState, globalState.roundNo]);

  useEffect(() => {
    if (globalState.roundState === null) {
      setGlobalState((prevState) => ({
        ...prevState,
        isDoubleBtnDisabled: true,
      }));
    } else if (2 * globalState.bet > globalState.credit) {
      setGlobalState((prevState) => ({
        ...prevState,
        isDoubleBtnDisabled: true,
      }));
    } else if (globalState.actionBtnsDisabled) {
      setGlobalState((prevState) => ({
        ...prevState,
        isDoubleBtnDisabled: true,
      }));
    } else if (
      !globalState.actionBtnsDisabled &&
      2 * globalState.bet <= globalState.credit
    ) {
      setGlobalState((prevState) => ({
        ...prevState,
        isDoubleBtnDisabled: false,
      }));
    }
  }, [
    globalState.roundState,
    globalState.bet,
    globalState.credit,
    globalState.actionBtnsDisabled,
  ]);

  useEffect(() => {
    if (globalState.credit === 0) {
      setGlobalState((prevState) => ({ ...prevState, isGameOn: false }));
      setGlobalState((prevState) => ({
        ...prevState,
        roundState: "Game over",
      }));
    }
  }, [globalState.credit]);

  const isInitial = useRef(true);
  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }
    switch (globalState.roundState) {
      case "Win":
      case "Loose":
      case "Draw":
        setGlobalState((prevState) => ({
          ...prevState,
          roundHistory: [
            ...prevState.roundHistory,
            {
              round: globalState.roundNo,
              playerHand: playerHand,
              playerCount: playerCount,
              dealerHand: dealerHand,
              dealerCount: dealerCount,
            },
          ],
        }));
        setGlobalState((prevState) => ({
          ...prevState,
          isBetInputDisabled: false,
        }));
        calcCredit(globalState.bet, globalState.roundState, globalState.credit);
        break;
      case "In progress":
        setGlobalState((prevState) => ({
          ...prevState,
          isBetInputDisabled: true,
        }));
        break;
    }
  }, [globalState.roundState]);

  useEffect(() => {
    if (globalState.isGameOn) {
      if (!globalState.isDealerTurn && playerCount === 21) {
        if (globalState.cardsCountDisplayDealer === 1) {
          setGlobalState((prevState) => ({
            ...prevState,
            cardsCountDisplayDealer: 2,
          }));
        } else if (
          dealerCount === 21 &&
          globalState.cardsCountDisplayDealer === 2
        ) {
          setGlobalState((prevState) => ({ ...prevState, roundState: "Draw" }));
        } else {
          setGlobalState((prevState) => ({ ...prevState, roundState: "Win" }));
        }
      } else {
        if (globalState.cardsCountDisplayPlayer === 3) {
          if (playerCount > 21) {
            setGlobalState((prevState) => ({
              ...prevState,
              roundState: "Loose",
            }));
          } else if (playerCount === 21) {
            if (globalState.cardsCountDisplayDealer === 1) {
              setGlobalState((prevState) => ({
                ...prevState,
                cardsCountDisplayDealer: 2,
              }));
            } else if (
              dealerCount === 21 &&
              globalState.cardsCountDisplayDealer === 2
            ) {
              setGlobalState((prevState) => ({
                ...prevState,
                roundState: "Draw",
              }));
            } else if (
              dealerCount < 17 &&
              globalState.cardsCountDisplayDealer === 2
            ) {
              setGlobalState((prevState) => ({
                ...prevState,
                cardsCountDisplayDealer: 3,
              }));
            } else if (globalState.cardsCountDisplayDealer === 3) {
              if (dealerCount === 21) {
                setGlobalState((prevState) => ({
                  ...prevState,
                  roundState: "Draw",
                }));
              } else {
                setGlobalState((prevState) => ({
                  ...prevState,
                  roundState: "Win",
                }));
              }
            } else {
              setGlobalState((prevState) => ({
                ...prevState,
                roundState: "Win",
              }));
            }
          } else {
            if (globalState.cardsCountDisplayDealer === 1) {
              setGlobalState((prevState) => ({
                ...prevState,
                cardsCountDisplayDealer: 2,
              }));
            } else if (
              dealerCount === 21 &&
              globalState.cardsCountDisplayDealer === 2
            ) {
              setGlobalState((prevState) => ({
                ...prevState,
                roundState: "Loose",
              }));
            } else if (
              dealerCount < 17 &&
              globalState.cardsCountDisplayDealer === 2
            ) {
              setGlobalState((prevState) => ({
                ...prevState,
                cardsCountDisplayDealer: 3,
              }));
            } else if (globalState.cardsCountDisplayDealer === 3) {
              if (dealerCount === 21) {
                setGlobalState((prevState) => ({
                  ...prevState,
                  roundState: "Loose",
                }));
              } else if (dealerCount > 21) {
                setGlobalState((prevState) => ({
                  ...prevState,
                  roundState: "Win",
                }));
              } else if (dealerCount > playerCount) {
                setGlobalState((prevState) => ({
                  ...prevState,
                  roundState: "Loose",
                }));
              } else if (dealerCount < playerCount) {
                setGlobalState((prevState) => ({
                  ...prevState,
                  roundState: "Win",
                }));
              } else {
                setGlobalState((prevState) => ({
                  ...prevState,
                  roundState: "Draw",
                }));
              }
            } else {
              compareCounts(playerCount, dealerCount);
            }
          }
        } else if (
          globalState.cardsCountDisplayPlayer === 2 &&
          globalState.isDealerTurn
        ) {
          if (globalState.cardsCountDisplayDealer === 1) {
            setGlobalState((prevState) => ({
              ...prevState,
              cardsCountDisplayDealer: 2,
            }));
          } else if (
            dealerCount === 21 &&
            globalState.cardsCountDisplayDealer === 2
          ) {
            setGlobalState((prevState) => ({
              ...prevState,
              roundState: "Loose",
            }));
          } else if (
            dealerCount < 17 &&
            globalState.cardsCountDisplayDealer === 2
          ) {
            setGlobalState((prevState) => ({
              ...prevState,
              cardsCountDisplayDealer: 3,
            }));
          } else if (globalState.cardsCountDisplayDealer === 3) {
            if (dealerCount === 21) {
              setGlobalState((prevState) => ({
                ...prevState,
                roundState: "Loose",
              }));
            } else if (dealerCount > 21) {
              setGlobalState((prevState) => ({
                ...prevState,
                roundState: "Win",
              }));
            } else if (dealerCount > playerCount) {
              setGlobalState((prevState) => ({
                ...prevState,
                roundState: "Loose",
              }));
            } else if (dealerCount < playerCount) {
              setGlobalState((prevState) => ({
                ...prevState,
                roundState: "Win",
              }));
            } else {
              setGlobalState((prevState) => ({
                ...prevState,
                roundState: "Draw",
              }));
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
    globalState.isDealerTurn,
    globalState.cardsCountDisplayDealer,
    globalState.cardsCountDisplayPlayer,
    globalState.isGameOn,
  ]);

  return {
    startGame,
    playerHand,
    dealerHand,
    playerCount,
    dealerCount,
    handleHit,
    handleStand,
    handleNewRound,
    handleBetChange,
    handlePlayerNameChange,
    rankSorted,
    prevCredit,
    creditDisplayVal,
    gameStateText,
    handleDouble,
    roundResult,
    globalState,
    playerHandValsStr,
    dealerHandValsStr,
  };
}
