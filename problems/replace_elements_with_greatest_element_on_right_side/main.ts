import * as Assert from "jsr:@std/assert@1";

// Time: O(n)
// Space: O(N)
function replaceElementsV1(arr: number[]): number[] {
  const result = Array<number>(arr.length);

  result[arr.length - 1] = -1;

  if (arr.length >= 2) {
    result[arr.length - 2] = arr[arr.length - 1];
  }

  for (let i = arr.length - 3; i >= 0; i--) {
    const j = i + 1;
    result[i] = Math.max(arr[j], result[j]);
  }

  return result;
}

// Time: O(n)
// Space: O(1)
function replaceElements(arr: number[]): number[] {
  let currentMax = -1;

  for (let i = arr.length - 1; i >= 0; i--) {
    // deno-lint-ignore prefer-const
    let currentValue = arr[i];
    arr[i] = currentMax;
    currentMax = Math.max(currentMax, currentValue);
  }

  return arr;
}

Deno.test(function testA() {
  const arr = [17, 18, 5, 4, 6, 1];
  const expected = [18, 6, 6, 6, 1, -1];
  Assert.assertEquals(replaceElementsV1(arr), expected);
  Assert.assertEquals(replaceElements(arr), expected);
});
Deno.test(function testB() {
  const arr = [400];
  const expected = [-1];
  Assert.assertEquals(replaceElementsV1(arr), expected);
  Assert.assertEquals(replaceElements(arr), expected);
});
Deno.test(function testC() {
  const arr = [10, 1];
  const expected = [1, -1];
  Assert.assertEquals(replaceElementsV1(arr), expected);
  Assert.assertEquals(replaceElements(arr), expected);
});
