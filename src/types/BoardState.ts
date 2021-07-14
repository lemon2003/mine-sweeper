export interface BoardStateBase {
  type: string;
}

export interface Nothing extends BoardStateBase {
  type: "nothing";
  minesAround: number;
}

export interface Mine extends BoardStateBase {
  type: "mine";
}

export const isNothing = (boardState: BoardState): boardState is Nothing =>
  boardState.type === "nothing";

export const isMine = (boardState: BoardState): boardState is Mine =>
  boardState.type === "mine";

export type BoardState = Nothing | Mine;
