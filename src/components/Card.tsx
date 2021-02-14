import react from "react";
import useGame from "./useGame";

export default function Card(props: any) {
  const game = useGame();
  return (
    <div>
      <img src={props.image} />
    </div>
  );
}
