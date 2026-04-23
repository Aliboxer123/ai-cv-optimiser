import "@testing-library/jest-dom";

declare global {
  const describe: typeof import("jest").describe;
  const it: typeof import("jest").it;
  const expect: typeof import("jest").expect;
  const test: typeof import("jest").test;
}