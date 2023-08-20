import { reduceNotes } from "./chords";
import { test, expect } from "@jest/globals";

test("Notes an octave apart are removed", () => {
  expect(reduceNotes([36, 40, 43, 48, 52, 55])).toStrictEqual([36, 40, 43]);
  expect(reduceNotes([0, 4, 7, 12])).toStrictEqual([0, 4, 7]);
  expect(reduceNotes([0, 4, 7, 16])).toStrictEqual([0, 4, 7]);
  expect(reduceNotes([0, 4, 7, 19])).toStrictEqual([0, 4, 7]);
  expect(reduceNotes([0, 4, 7, 12, 19])).toStrictEqual([0, 4, 7]);
});

test("Correctly identify first inversion major chord", () => {
  expect(reduceNotes([40, 43, 48, 52])).toStrictEqual([40, 43, 48]);
});

test("should ", () => {
  expect(reduceNotes([40, 48, 52, 55, 60, 64])).toStrictEqual([40, 43, 48]);
});
