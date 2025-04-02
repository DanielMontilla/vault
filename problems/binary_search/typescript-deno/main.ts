import * as Assert from "jsr:@std/assert@1";

function search(nums: number[], target: number): number {
  let l = 0;
  let r = nums.length - 1;

  while (l <= r) {
    const mid = Math.floor((r - l) / 2) + l;
    const n = nums[mid];

    if (target === n) {
      return mid;
    }

    if (target < n) {
      r = mid - 1;
    } else {
      l = mid + 1;
    }
  }

  return -1;
}

Deno.test(function testA() {
  const nums = [-1, 0, 3, 5, 9, 12];
  const target = 9;

  const expected = 4;

  Assert.assertEquals(search(nums, target), expected);
});
Deno.test(function testB() {
  const nums = [-1, 0, 3, 5, 9, 12];
  const target = 2;

  const expected = -1;

  Assert.assertEquals(search(nums, target), expected);
});
Deno.test(function testC() {
  const nums = [5];
  const target = 5;

  const expected = 0;

  Assert.assertEquals(search(nums, target), expected);
});
Deno.test(function testD() {
  const nums = [2, 5];
  const target = 2;

  const expected = 0;

  Assert.assertEquals(search(nums, target), expected);
});
Deno.test(function testE() {
  const nums = [2, 5];
  const target = 5;

  const expected = 1;

  Assert.assertEquals(search(nums, target), expected);
});
