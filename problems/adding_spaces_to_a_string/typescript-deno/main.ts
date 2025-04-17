import * as Assert from "jsr:@std/assert@1";

function addSpacesV1(s: string, spaces: number[]): string {
  let result = "";

  let last = 0;
  for (let i = 0; i <= spaces.length; i++) {
    result += s.substring(last, spaces[i]) + " ";
    last = spaces[i];
  }

  return result.trimEnd();
}

function addSpacesV2(s: string, spaces: number[]): string {
  let result = "";
  let last = 0;

  for (let i = 0; i < spaces.length; i++) {
    const ptr = spaces[i];
    result += s.substring(last, ptr) + " ";
    last = ptr;
  }

  return result + s.substring(last);
}

function addSpaces(s: string, spaces: number[]): string {
  const words: string[] = [];

  let last = 0;

  for (let i = 0; i < spaces.length; i++) {
    words.push(s.substring(last, spaces[i]));
    last = spaces[i];
  }

  words.push(s.substring(last));

  return words.join(" ");
}

Deno.test(function testA() {
  const s = "LeetcodeHelpsMeLearn";
  const spaces = [8, 13, 15];
  const expected = "Leetcode Helps Me Learn";

  Assert.assertEquals(addSpacesV1(s, spaces), expected);
  Assert.assertEquals(addSpacesV2(s, spaces), expected);
  Assert.assertEquals(addSpaces(s, spaces), expected);
});
