// Use global test functions without importing vitest
test("basic math", () => {
  expect(2 + 2).toBe(4);
});

test("string equality", () => {
  expect("hello").toBe("hello");
});
