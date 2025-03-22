import * as Assert from "jsr:@std/assert@1";

function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  type Letter = string;
  type Count = number;

  const letters = new Map<Letter, Count>();

  for (let i = 0; i < s.length; i++) {
    const letter = s[i];
    const count = letters.get(letter);

    if (count === undefined) {
      letters.set(letter, 1);
      continue;
    }

    letters.set(letter, count + 1);
  }

  for (let i = 0; i < t.length; i++) {
    const letter = t[i];
    const count = letters.get(letter);

    if (!count) return false;

    letters.set(letter, count - 1);
  }

  return true;
}

Deno.test(function testA() {
  const s = "anagram";
  const t = "nagaram";
  Assert.assertEquals(isAnagram(s, t), true);
});

Deno.test(function testB() {
  const s = "rat";
  const t = "car";
  Assert.assertEquals(isAnagram(s, t), false);
});

Deno.test(function testC() {
  const s = "daniel";
  const t = "daniell";
  Assert.assertEquals(isAnagram(s, t), false);
});
Deno.test(function testC() {
  const s = "daniell";
  const t = "daniel";
  Assert.assertEquals(isAnagram(s, t), false);
});
