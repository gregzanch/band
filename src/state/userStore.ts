import create, { SetState, GetState, Mutate, StoreApi } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

type UserState = {
  firstName: string;
  lastName: string;
  userId: string;
  email: string;
  avatarUrl: string | null;
};

type UserReducers = {
  uploadAvatar: () => Promise<string>;
  set: SetState<UserStore>;
};

type UserStore = UserState & UserReducers;

// TODO change
const initialState: UserState = {
  firstName: "Greg",
  lastName: "Zanchelli",
  userId: "124fhuf14124f",
  email: "zanchelli.greg@gmail.com",
  avatarUrl: null,
};

export const useUserStore = create<
  UserStore,
  SetState<UserStore>,
  GetState<UserStore>,
  Mutate<StoreApi<UserStore>, [["zustand/subscribeWithSelector", never]]>
>(
  subscribeWithSelector((set) => ({
    ...initialState,
    uploadAvatar: async () => {
      console.log("upload avatar");
      return Promise.resolve("todo");
    },
    set,
  }))
);

export default useUserStore;
