import * as Assert from "jsr:@std/assert@1";

function lengthOfLastWord(s: string): number {
  let firstLetterIndex: number = -1;

  for (let i = s.length - 1; i >= 0; i--) {
    if (s[i] !== " ") {
      firstLetterIndex = i;
      break;
    }
  }

  let count = 0;

  for (let i = firstLetterIndex; i >= 0; i--) {
    if (s[i] === " ") break;
    count++;
  }

  return count;
}

Deno.test(function testA() {
  const s = "Hello World";
  const expected = 5;
  Assert.assertEquals(lengthOfLastWord(s), expected);
});

Deno.test(function testB() {
  const s = "   fly me   to   the moon  ";
  const expected = 4;
  Assert.assertEquals(lengthOfLastWord(s), expected);
});

Deno.test(function testC() {
  const s = "luffy is still joyboy";
  const expected = 6;
  Assert.assertEquals(lengthOfLastWord(s), expected);
});
