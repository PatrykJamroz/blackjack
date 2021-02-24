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
});
