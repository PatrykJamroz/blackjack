import { act, renderHook } from "@testing-library/react-hooks";
import useGame from "../components/useGame";

it("change player name", () => {
  const { result } = renderHook(() => useGame());
  act(() => {
    result.current.handlePlayerNameChange({
      currentTarget: { value: "kozol" },
    } as any);
  });

  expect(result.current.playerName).toBe("kozol");
});
