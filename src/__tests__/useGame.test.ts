import { act, renderHook } from "@testing-library/react-hooks";
import useGame from "../components/useGame";

describe("useGame", () => {
  it("change player name", () => {
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.handlePlayerNameChange({
        currentTarget: { value: "patryk" },
      } as any);
    });

    expect(result.current.globalState.playerName).toBe("patryk");
  });

  it("calc credit", () => {
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.calcCredit(10, "Win", 1000);
    });
    expect(result.current.globalState.credit).toBe(1015);
  });

  it("start game", () => {
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.startGame();
    });
    expect(result.current.globalState.isGameOn).toBe(true);
    expect(result.current.globalState.isDealerTurn).toBe(false);
    expect(result.current.globalState.credit).toBe(1000);
    expect(result.current.globalState.roundHistory).toStrictEqual([]);
    expect(result.current.globalState.playerDeck).toStrictEqual([]);
    expect(result.current.globalState.dealerDeck).toStrictEqual([]);
    expect(result.current.globalState.roundState).toBe("In progress");
    expect(result.current.globalState.cardsCountDisplayPlayer).toBe(2);
    expect(result.current.globalState.cardsCountDisplayDealer).toBe(1);
    expect(result.current.globalState.actionBtnsDisabled).toBe(false);
    expect(result.current.globalState.roundNo).toBe(1);
  });

  it("handle hit", () => {
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.handleHit();
    });
    expect(result.current.globalState.isDealerTurn).toBe(true);
    expect(result.current.globalState.actionBtnsDisabled).toBe(true);
    expect(result.current.globalState.cardsCountDisplayPlayer).toBe(3);
    expect(result.current.globalState.cardsCountDisplayDealer).toBe(3);
  });

  it("handle stand", () => {
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.handleStand();
    });
    expect(result.current.globalState.isDealerTurn).toBe(true);
    expect(result.current.globalState.actionBtnsDisabled).toBe(true);
  });

  it("handle double", () => {
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.handleDouble();
    });
    expect(result.current.globalState.bet).toBe(400);
  });

  it("handle bet change", () => {
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.handleBetChange({
        currentTarget: { value: 300 },
      } as any);
    });
    expect(result.current.globalState.bet).toBe(300);
  });

  it("set game state text", () => {
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.setGameStateText("Win", true, 1000, 4);
    });
    expect(result.current.gameStateText).toBe("Click new round...");
  });

  it("compare counts", () => {
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.compareCounts(20, 10);
    });
    expect(result.current.globalState.roundState).toBe("Win");
  });
  // it("get value", () => {
  //   const { result } = renderHook(() => useGame());
  //   act(() => {
  //     result.current.getValue("ACE");
  //   });
  //   expect(result.current.getValue).toBe(11);
  // });

  // it("get value", ()=> {
  //   const {result} = renderHook(()=>useGame())
  //   act(()=>{

  //   })
  //   expect().toBe()
  // })
});
