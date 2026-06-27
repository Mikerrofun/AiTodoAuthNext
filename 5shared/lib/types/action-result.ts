export type ActionSuccess<T = void> = T extends void
  ? { status: "success" }
  : { status: "success"; data: T };

export type ActionError = {
  status: "error";
  message: string;
};

export type ActionBanned = {
  status: "banned";
};

export type ActionResult<T = void> = ActionSuccess<T> | ActionError | ActionBanned;
