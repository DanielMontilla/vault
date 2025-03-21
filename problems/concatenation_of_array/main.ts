import * as Assert from "jsr:@std/assert@1";
function getConcatenation(nums: number[]): number[] {
  const ans: number[] = [];

  for (let i = 0; i < nums.length; i++) {
    ans[i] = nums[i];
    ans[i + nums.length] = nums[i];
  }

  return ans;
}

Deno.test(function test_a() {
  const test = [1, 2, 1];
  const expected = [1, 2, 1, 1, 2, 1];
  Assert.assertEquals(getConcatenation(test), expected);
});
Deno.test(function test_b() {
  const test = [1, 3, 2, 1];
  const expected = [1, 3, 2, 1, 1, 3, 2, 1];
  Assert.assertEquals(getConcatenation(test), expected);
});
