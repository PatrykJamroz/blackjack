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

    expect(result.current.playerName).toBe("patryk");
  });

  it("calc credit", () => {
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.calcCredit(10, "Win");
    });
    expect(result.current.credit).toBe(1015);
  });

  it("start game", () => {
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.startGame();
    });
    expect(result.current.isGameOn).toBe(true);
    expect(result.current.isDealerTurn).toBe(false);
    expect(result.current.credit).toBe(1000);
    expect(result.current.roundHistory).toStrictEqual([]);
    expect(result.current.playerDeck).toStrictEqual([]);
    expect(result.current.dealerDeck).toStrictEqual([]);
    expect(result.current.roundState).toBe("In progress");
    expect(result.current.cardsCountDisplayPlayer).toBe(2);
    expect(result.current.cardsCountDisplayDealer).toBe(1);
    expect(result.current.actionBtnsDisabled).toBe(false);
    expect(result.current.roundNo).toBe(1);
  });

  it("handle hit", () => {
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.handleHit();
    });
    expect(result.current.isDealerTurn).toBe(true);
    expect(result.current.actionBtnsDisabled).toBe(true);
    expect(result.current.cardsCountDisplayPlayer).toBe(3);
    // expect(result.current.cardsCountDisplayDealer).toBe(2);
  });

  it("handle stand", () => {
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.handleStand();
    });
    expect(result.current.isDealerTurn).toBe(true);
    expect(result.current.actionBtnsDisabled).toBe(true);
    // expect(result.current.cardsCountDisplayDealer).toBe(2);
  });

  it("handle double", () => {
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.handleDouble();
    });
    expect(result.current.bet).toBe(400);
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
