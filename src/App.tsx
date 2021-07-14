import React, { useState } from "react";
import * as BoardState from "./types/BoardState";
import * as DispState from "./types/DispState";
import "./styles.css";

type Coord = [number, number];

const dx8 = [0, 1, 1, 1, 0, -1, -1, -1];
const dy8 = [-1, -1, 0, 1, 1, 1, 0, -1];

const gen2d = <T extends any>(w: number, h: number, v: () => T) =>
  [...new Array(h)].map(() => [...new Array(w)].map(() => v()));

const choose = (n: number, r: number): number[] => {
  const arr: number[] = [...new Array(n).keys()].map(Number);
  const ret: number[] = [];

  for (let i = 0; i < r; ++i) {
    const rand = Math.floor(Math.random() * (n - i));
    ret.push(arr.splice(rand, 1)[0]);
  }

  return ret;
};

const coordValidator = (w: number, h: number) => ([x, y]: Coord) =>
  0 <= x && x < w && 0 <= y && y < h;

const MineSweeper: React.FC = () => {
  const w = 10;
  const h = 10;
  const allMinesCount = 10;

  const isValidCoord = coordValidator(w, h);

  const [boardState, setBoardState] = useState(() => {
    const board = gen2d<BoardState.BoardState>(w, h, () => ({
      type: "nothing",
      minesAround: 0
    }));
    const mines: Coord[] = choose(w * h, allMinesCount).map((m) => {
      const x = m % w;
      const y = (m - x) / w;
      return [x, y];
    });

    mines.forEach(([x, y]) => {
      board[y][x] = { type: "mine" };

      for (let d = 0; d < 8; ++d) {
        const nx = x + dx8[d];
        const ny = y + dy8[d];

        if (!isValidCoord([nx, ny])) continue;

        const nb = board[ny][nx];
        if (BoardState.isMine(nb)) continue;
        nb.minesAround++;
      }
    });

    return board;
  });

  const [dispState, setDispState] = useState(() =>
    gen2d<DispState.DispState>(w, h, () => "hidden")
  );

  const dig = ([x, y]: Coord) => {
    if (BoardState.isMine(boardState[y][x])) alert("gameover");

    const que: Coord[] = [[x, y]];
    while (que.length) {
      const [cx, cy] = que.pop()!;

      dispState[cy][cx] = "actual";

      const b = boardState[cy][cx];
      if (BoardState.isMine(b) || (BoardState.isNothing(b) && b.minesAround))
        continue;

      for (let d = 0; d < 8; ++d) {
        const nx = cx + dx8[d];
        const ny = cy + dy8[d];

        if (!isValidCoord([nx, ny])) continue;
        if (dispState[ny][nx] === "actual") continue;
        que.push([nx, ny]);
      }
    }

    setDispState(dispState.map((row) => row.map((cell) => cell)));
  };

  return (
    <main>
      <div className="boardContainer">
        <table className="boardTable">
          <tbody>
            {dispState.map((row, y) => {
              return (
                <tr key={y}>
                  {row.map((cell, x) => {
                    const CustomTd = (props: any) => (
                      <td
                        onClick={() => dig([x, y])}
                        className="boardTd"
                        {...props}
                      />
                    );

                    const b = boardState[y][x];

                    if (cell === "hidden") {
                      return <CustomTd key={x}></CustomTd>;
                    }
                    if (cell === "actual") {
                      if (BoardState.isNothing(b)) {
                        return <CustomTd key={x}>{b.minesAround}</CustomTd>;
                      }
                      if (BoardState.isMine(b)) {
                        return <CustomTd key={x}>{"b"}</CustomTd>;
                      }
                    }
                    if (cell === "flag") {
                      return (
                        <CustomTd key={x}>
                          <span>f</span>
                        </CustomTd>
                      );
                    }

                    return <CustomTd key={x} />;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default MineSweeper;
