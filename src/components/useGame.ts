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

const todayDate: string = new Date().toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

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

  // const [playerDeck, setPlayerDeck] = useState<Array<Card>>(
  //   JSON.parse(localStorage.getItem("playerDeck") || "[]")
  // );
  // const [dealerDeck, setdealerDeck] = useState<Array<Card>>(
  //   JSON.parse(localStorage.getItem("dealerDeck") || "[]")
  // );

  // const [isGameOn, setIsGameOn] = useState<boolean>(
  //   JSON.parse(localStorage.getItem("isGameOn") || "false")
  // );
  // const [roundNo, setRoundNo] = useState<number>(
  //   JSON.parse(localStorage.getItem("roundNo") || "0")
  // );
  // const [roundHistory, setRoundHistory] = useState<Array<IroundHistory>>(
  //   JSON.parse(localStorage.getItem("roundHistory") || "[]")
  // );
  // const [rank, setRank] = useState<Array<Irank>>(
  //   JSON.parse(localStorage.getItem("rank") || "[]")
  // );

  // const [cardsCountDisplayPlayer, setCardsCountDisplayPlayer] = useState(
  //   JSON.parse(localStorage.getItem("cardsCountDisplayPlayer") || "2")
  // );
  // const [cardsCountDisplayDealer, setcardsCountDisplayDealer] = useState(
  //   JSON.parse(localStorage.getItem("cardsCountDisplayDealer") || "1")
  // );

  // const [roundState, setRoundState] = useState<RoundState>(
  //   JSON.parse(localStorage.getItem("roundState") || "null")
  // );

  // const [actionBtnsDisabled, setActionBtnsDisabled] = useState<boolean>(
  //   JSON.parse(localStorage.getItem("actionBtnsDisabled") || "true")
  // );
  // const [isRoundBtnDisabled, setIsRoundBtnDisabled] = useState<boolean>(
  //   JSON.parse(localStorage.getItem("isRoundBtnDisabled") || "true")
  // );
  // const [isBetInputDisabled, setIsBetInputDisabled] = useState<boolean>(
  //   JSON.parse(localStorage.getItem("isBetInputDisabled") || "false")
  // );
  // const [isDoubleBtnDisabled, setIsDoubleBtnDisabled] = useState<boolean>(
  //   JSON.parse(localStorage.getItem("isDoubleBtnDisabled") || "true")
  // );
  // const [isBetFaulty, setIsBetFaulty] = useState<boolean>(
  //   JSON.parse(localStorage.getItem("isBetFaulty") || "true")
  // );

  // const [isDealerTurn, setIsDealerTurn] = useState<boolean>(
  //   JSON.parse(localStorage.getItem("isDealerTurn") || "false")
  // );

  // const [credit, setCredit] = useState<number>(
  //   JSON.parse(localStorage.getItem("credit") || "1000")
  // );
  // const [bet, setBet] = useState<number>(
  //   JSON.parse(localStorage.getItem("bet") || "200")
  // );
  // const [playerName, setPlayerName] = useState<string>(
  //   JSON.parse(localStorage.getItem("playerName") || '"Player Name"')
  // );

  useEffect(() => {
    localStorage.setItem("globalState", JSON.stringify(globalState));
    // localStorage.setItem("playerDeck", JSON.stringify(playerDeck));
    // localStorage.setItem("dealerDeck", JSON.stringify(dealerDeck));
    // localStorage.setItem("roundHistory", JSON.stringify(roundHistory));
    // localStorage.setItem("roundNo", JSON.stringify(roundNo));
    // localStorage.setItem("isGameOn", JSON.stringify(isGameOn));
    // localStorage.setItem("rank", JSON.stringify(rank));
    // localStorage.setItem(
    //   "cardsCountDisplayPlayer",
    //   JSON.stringify(cardsCountDisplayPlayer)
    // );
    // localStorage.setItem(
    //   "cardsCountDisplayDealer",
    //   JSON.stringify(cardsCountDisplayDealer)
    // );
    // localStorage.setItem("roundState", JSON.stringify(roundState));
    // localStorage.setItem(
    //   "actionBtnsDisabled",
    //   JSON.stringify(actionBtnsDisabled)
    // );
    // localStorage.setItem(
    //   "isRoundBtnDisabled",
    //   JSON.stringify(isRoundBtnDisabled)
    // );
    // localStorage.setItem(
    //   "isBetInputDisabled",
    //   JSON.stringify(isBetInputDisabled)
    // );
    // localStorage.setItem(
    //   "isDoubleBtnDisabled",
    //   JSON.stringify(isDoubleBtnDisabled)
    // );
    // localStorage.setItem("isBetFaulty", JSON.stringify(isBetFaulty));
    // localStorage.setItem("isDealerTurn", JSON.stringify(isDealerTurn));
    // localStorage.setItem("credit", JSON.stringify(credit));
    // localStorage.setItem("bet", JSON.stringify(bet));
    // localStorage.setItem("playerName", JSON.stringify(playerName));
  }, [
    globalState,
    // playerDeck,
    // dealerDeck,
    // roundHistory,
    // roundNo,
    // isGameOn,
    // rank,
    // cardsCountDisplayPlayer,
    // cardsCountDisplayDealer,
    // actionBtnsDisabled,
    // isRoundBtnDisabled,
    // isBetInputDisabled,
    // isDoubleBtnDisabled,
    // isBetFaulty,
    // isDealerTurn,
    // credit,
    // bet,
    // playerName,
  ]);

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
          { playerName: playerName, credit: prevCredit, date: todayDate },
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
      credit: 100,
      roundHistory: [],
      playerDeck: [],
      dealerDeck: [],
      roundState: "In progress",
      cardsCountDisplayPlayer: 2,
      cardsCountDisplayDealer: 1,
      roundNo: 1,
      actionBtnsDisabled: false,
    }));
    // setIsGameOn(true);
    // setIsDealerTurn(false);
    // setCredit(1000);
    // setRoundHistory([]);
    // setPlayerDeck([]);
    // setdealerDeck([]);
    // setRoundState("In progress");
    // setCardsCountDisplayPlayer(2);
    // setcardsCountDisplayDealer(1);
    // setRoundNo(1);
    // setActionBtnsDisabled(false);
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
    // setIsDealerTurn(true);
    // setActionBtnsDisabled(true);
    // setCardsCountDisplayPlayer(3);
    // setcardsCountDisplayDealer(2);
  }

  function handleStand() {
    setGlobalState((prevState) => ({
      ...prevState,
      isDealerTurn: true,
      actionBtnsDisabled: true,
      cardsCountDisplayDealer: 2,
    }));
    // setIsDealerTurn(true);
    // setActionBtnsDisabled(true);
    // setcardsCountDisplayDealer(2);
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
    // setBet(bet * 2);
    // setIsDealerTurn(true);
    // setActionBtnsDisabled(true);
    // setCardsCountDisplayPlayer(3);
    // setcardsCountDisplayDealer(2);
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
    // setRoundState("In progress");
    // setPlayerDeck([]);
    // setdealerDeck([]);
    // setCardsCountDisplayPlayer(2);
    // setcardsCountDisplayDealer(1);
    // setIsDealerTurn(false);
    getDeck().then((deckData) => {
      splitCards(deckData);
      setGlobalState((prevState) => ({
        ...prevState,
        actionBtnsDisabled: false,
      }));
      // setActionBtnsDisabled(false);
    });
    const nextRoundNo = globalState.roundNo + 1;
    setGlobalState((prevState) => ({ ...prevState, roundNo: nextRoundNo }));
    // setRoundNo(roundNo + 1);

    // doublecheck if it's possible to do it under one setState
  }

  function handleBetChange(e: React.FormEvent<HTMLInputElement>) {
    const newBetVal = Number(e.currentTarget.value);
    setGlobalState((prevState) => ({ ...prevState, bet: newBetVal }));
    // setBet(Number(e.currentTarget.value));
  }

  function handlePlayerNameChange(e: React.FormEvent<HTMLInputElement>) {
    const newPlayerName = e.currentTarget.value;
    setGlobalState((prevState) => ({
      ...prevState,
      playerName: newPlayerName,
    }));
    // setPlayerName(e.currentTarget.value);
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
        // setCredit(credit + 1.5 * bet);
        break;
      case "Loose":
        setGlobalState((prevState) => ({
          ...prevState,
          credit: newCreditValLoose,
        }));
        // setCredit(credit - bet);
        break;
    }
  }

  const prevCreditRef = useRef<number>();

  useEffect(() => {
    prevCreditRef.current = globalState.credit;
  });

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
      // setRoundState("Loose");
    } else if (dealerCount < playerCount) {
      setGlobalState((prevState) => ({ ...prevState, roundState: "Win" }));
      // setRoundState("Win");
    } else {
      setGlobalState((prevState) => ({ ...prevState, roundState: "Draw" }));
      // setRoundState("Draw");
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

  useEffect(() => {
    if (!globalState.isGameOn) {
      setGlobalState((prevState) => ({ ...prevState, credit: 1000 }));
      // setCredit(1000);
    }
  }, [globalState.isGameOn]);

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
      //setIsRoundBtnDisabled(true);
    } else if (globalState.roundState === "In progress") {
      setGlobalState((prevState) => ({
        ...prevState,
        isRoundBtnDisabled: true,
      }));
      //setIsRoundBtnDisabled(true);
    } else if (globalState.roundNo === 5) {
      setGlobalState((prevState) => ({
        ...prevState,
        isRoundBtnDisabled: true,
      }));
      //setIsRoundBtnDisabled(true);
    } else if (!globalState.isGameOn) {
      setGlobalState((prevState) => ({
        ...prevState,
        isRoundBtnDisabled: true,
      }));
      //setIsRoundBtnDisabled(true);
    } else {
      setGlobalState((prevState) => ({
        ...prevState,
        isRoundBtnDisabled: false,
      }));
      //setIsRoundBtnDisabled(false);
    }
  }, [globalState.roundState, globalState.roundNo, globalState.isGameOn]);

  useEffect(() => {
    if (globalState.roundState !== "In progress") {
      setGlobalState((prevState) => ({
        ...prevState,
        actionBtnsDisabled: true,
      }));
      //setActionBtnsDisabled(true);
    }

    if (globalState.roundState !== "In progress" && globalState.roundNo === 5) {
      setGlobalState((prevState) => ({ ...prevState, isGameOn: false }));
      //setIsGameOn(false);
    }
  }, [globalState.roundState, globalState.roundNo]);

  useEffect(() => {
    if (globalState.roundState === null) {
      setGlobalState((prevState) => ({
        ...prevState,
        isDoubleBtnDisabled: true,
      }));
      //setIsDoubleBtnDisabled(true);
    } else if (2 * globalState.bet > globalState.credit) {
      setGlobalState((prevState) => ({
        ...prevState,
        isDoubleBtnDisabled: true,
      }));
      //setIsDoubleBtnDisabled(true);
    } else if (globalState.actionBtnsDisabled) {
      setGlobalState((prevState) => ({
        ...prevState,
        isDoubleBtnDisabled: true,
      }));
      //setIsDoubleBtnDisabled(true);
    } else if (
      !globalState.actionBtnsDisabled &&
      2 * globalState.bet <= globalState.credit
    ) {
      setGlobalState((prevState) => ({
        ...prevState,
        isDoubleBtnDisabled: false,
      }));
      //setIsDoubleBtnDisabled(false);
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
      //setIsGameOn(false);
      setGlobalState((prevState) => ({
        ...prevState,
        roundState: "Game over",
      }));
      //setRoundState("Game over");
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
        // setRoundHistory([
        //   ...roundHistory,
        //   {
        //     round: roundNo,
        //     playerHand: playerHand,
        //     playerCount: playerCount,
        //     dealerHand: dealerHand,
        //     dealerCount: dealerCount,
        //   },
        // ]);
        setGlobalState((prevState) => ({
          ...prevState,
          isBetInputDisabled: false,
        }));
        //setIsBetInputDisabled(false);
        calcCredit(globalState.bet, globalState.roundState, globalState.credit);

        break;
      case "In progress":
        setGlobalState((prevState) => ({
          ...prevState,
          isBetInputDisabled: true,
        }));
        //setIsBetInputDisabled(true);
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
          //setcardsCountDisplayDealer(2);
        } else if (
          dealerCount === 21 &&
          globalState.cardsCountDisplayDealer === 2
        ) {
          setGlobalState((prevState) => ({ ...prevState, roundState: "Draw" }));
          //setRoundState("Draw");
        } else {
          setGlobalState((prevState) => ({ ...prevState, roundState: "Win" }));
          //setRoundState("Win");
        }
      } else {
        if (globalState.cardsCountDisplayPlayer === 3) {
          if (playerCount > 21) {
            setGlobalState((prevState) => ({
              ...prevState,
              roundState: "Loose",
            }));
            //setRoundState("Loose");
          } else if (playerCount === 21) {
            if (globalState.cardsCountDisplayDealer === 1) {
              setGlobalState((prevState) => ({
                ...prevState,
                cardsCountDisplayDealer: 2,
              }));
              //setcardsCountDisplayDealer(2);
            } else if (
              dealerCount === 21 &&
              globalState.cardsCountDisplayDealer === 2
            ) {
              setGlobalState((prevState) => ({
                ...prevState,
                roundState: "Draw",
              }));
              //setRoundState("Draw");
            } else if (
              dealerCount < 17 &&
              globalState.cardsCountDisplayDealer === 2
            ) {
              setGlobalState((prevState) => ({
                ...prevState,
                cardsCountDisplayDealer: 3,
              }));
              //setcardsCountDisplayDealer(3);
            } else if (globalState.cardsCountDisplayDealer === 3) {
              if (dealerCount === 21) {
                setGlobalState((prevState) => ({
                  ...prevState,
                  roundState: "Draw",
                }));
                //setRoundState("Draw");
              } else {
                setGlobalState((prevState) => ({
                  ...prevState,
                  roundState: "Win",
                }));
                //setRoundState("Win");
              }
            } else {
              setGlobalState((prevState) => ({
                ...prevState,
                roundState: "Win",
              }));
              //setRoundState("Win");
            }
          } else {
            if (globalState.cardsCountDisplayDealer === 1) {
              setGlobalState((prevState) => ({
                ...prevState,
                cardsCountDisplayDealer: 2,
              }));
              //setcardsCountDisplayDealer(2);
            } else if (
              dealerCount === 21 &&
              globalState.cardsCountDisplayDealer === 2
            ) {
              setGlobalState((prevState) => ({
                ...prevState,
                roundState: "Loose",
              }));
              //setRoundState("Loose");
            } else if (
              dealerCount < 17 &&
              globalState.cardsCountDisplayDealer === 2
            ) {
              setGlobalState((prevState) => ({
                ...prevState,
                cardsCountDisplayDealer: 3,
              }));
              //setcardsCountDisplayDealer(3);
            } else if (globalState.cardsCountDisplayDealer === 3) {
              if (dealerCount === 21) {
                setGlobalState((prevState) => ({
                  ...prevState,
                  roundState: "Loose",
                }));
                //setRoundState("Loose");
              } else if (dealerCount > 21) {
                setGlobalState((prevState) => ({
                  ...prevState,
                  roundState: "Win",
                }));
                //setRoundState("Win");
              } else if (dealerCount > playerCount) {
                setGlobalState((prevState) => ({
                  ...prevState,
                  roundState: "Loose",
                }));
                //setRoundState("Loose");
              } else if (dealerCount < playerCount) {
                setGlobalState((prevState) => ({
                  ...prevState,
                  roundState: "Win",
                }));
                //setRoundState("Win");
              } else {
                setGlobalState((prevState) => ({
                  ...prevState,
                  roundState: "Draw",
                }));
                //setRoundState("Draw");
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
            //setcardsCountDisplayDealer(2);
          } else if (
            dealerCount === 21 &&
            globalState.cardsCountDisplayDealer === 2
          ) {
            setGlobalState((prevState) => ({
              ...prevState,
              roundState: "Loose",
            }));
            //setRoundState("Loose");
          } else if (
            dealerCount < 17 &&
            globalState.cardsCountDisplayDealer === 2
          ) {
            setGlobalState((prevState) => ({
              ...prevState,
              cardsCountDisplayDealer: 3,
            }));
            //setcardsCountDisplayDealer(3);
          } else if (globalState.cardsCountDisplayDealer === 3) {
            if (dealerCount === 21) {
              setGlobalState((prevState) => ({
                ...prevState,
                roundState: "Loose",
              }));
              //setRoundState("Loose");
            } else if (dealerCount > 21) {
              setGlobalState((prevState) => ({
                ...prevState,
                roundState: "Win",
              }));
              //setRoundState("Win");
            } else if (dealerCount > playerCount) {
              setGlobalState((prevState) => ({
                ...prevState,
                roundState: "Loose",
              }));
              //setRoundState("Loose");
            } else if (dealerCount < playerCount) {
              setGlobalState((prevState) => ({
                ...prevState,
                roundState: "Win",
              }));
              //setRoundState("Win");
            } else {
              setGlobalState((prevState) => ({
                ...prevState,
                roundState: "Draw",
              }));
              //setRoundState("Draw");
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
    // playerDeck,
    // dealerDeck,
    // isGameOn,
    // cardsCountDisplayPlayer,
    playerHand,
    dealerHand,
    playerCount,
    dealerCount,
    handleHit,
    handleStand,
    //actionBtnsDisabled,
    handleNewRound,
    // isRoundBtnDisabled,
    // roundNo,
    // roundHistory,
    // roundState,
    // credit,
    // bet,
    handleBetChange,
    // isBetInputDisabled,
    // isBetFaulty,
    // playerName,
    handlePlayerNameChange,
    todayDate,
    rankSorted,
    prevCredit,
    creditDisplayVal,
    gameStateText,
    handleDouble,
    // isDoubleBtnDisabled,
    roundResult,
    globalState,
  };
}
