import * as Assert from "jsr:@std/assert@1";

function reverseString(s: string[]): void {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    const l = s[left];
    const r = s[right];

    s[left] = r;
    s[right] = l;

    left++;
    right--;
  }
}

Deno.test(function testA() {
  const s = ["h", "e", "l", "l", "o"];
  const expected = ["o", "l", "l", "e", "h"];

  reverseString(s);

  Assert.assertEquals(s, expected);
});
