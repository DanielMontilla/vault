import * as Assert from "jsr:@std/assert@1";

function containsDuplicate(nums: number[]): boolean {
  const existing = new Set<number>();

  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if (existing.has(n)) return true;
    existing.add(n);
  }

  return false;
}

Deno.test(function testA() {
  const nums = [1, 2, 3, 1];
  Assert.assertEquals(containsDuplicate(nums), true);
});

Deno.test(function testB() {
  const nums = [1, 2, 3, 4];
  Assert.assertEquals(containsDuplicate(nums), false);
});

Deno.test(function testC() {
  const nums = [1, 1, 1, 3, 3, 4, 3, 2, 4, 2];
  Assert.assertEquals(containsDuplicate(nums), true);
});
