import { configureStore } from "@reduxjs/toolkit";
import pianoReducer from "./pianoSlice";
import midiReducer from "./midiSlice";
// ...

export const store = configureStore({
  reducer: {
    piano: pianoReducer,
    midi: midiReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
