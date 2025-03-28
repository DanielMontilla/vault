import * as Assert from "jsr:@std/assert@1";

function longestCommonPrefix(strs: string[]): string {
  let prefix = "";

  for (let i = 0; i < strs[0].length; i++) {
    const letter = strs[0][i];

    for (let j = 1; j < strs.length; j++) {
      if (strs[j][i] !== letter) return prefix;
    }

    prefix += letter;
  }

  return prefix;
}

Deno.test(function testA() {
  const input = ["flower", "flow", "flight"];
  const expected = "fl";
  Assert.assertEquals(longestCommonPrefix(input), expected);
});
Deno.test(function testB() {
  const input = ["dog", "racecar", "car"];
  const expected = "";
  Assert.assertEquals(longestCommonPrefix(input), expected);
});
