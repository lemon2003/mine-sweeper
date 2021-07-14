export interface DispStateBase {
  type: string;
}

export interface Actual extends DispStateBase {
  type: "actual";
}

export interface Flag extends DispStateBase {
  type: "flag";
}

export type DispState = "actual" | "flag" | "hidden";
