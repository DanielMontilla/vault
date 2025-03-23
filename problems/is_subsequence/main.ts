import * as Assert from "jsr:@std/assert@1";

// Time: O(s + t) => O(n)
// Space: O(s) => O(n)
function isSubsequenceV1(s: string, t: string): boolean {
  type Letter = string;
  type Count = number;

  const set = new Map<Letter, Count>();

  for (let i = 0; i < s.length; i++) {
    const letter = s[i];
    const count = set.get(letter);

    if (count === undefined) {
      set.set(letter, 1);
      continue;
    }

    set.set(letter, count + 1);
  }

  let pointer = 0;

  for (let i = 0; i < t.length; i++) {
    const currentS = s[i];
    const currentCount = set.get(currentS);

    if (!currentCount) continue;

    for (let j = pointer; j < t.length; j++) {
      const currentT = t[j];
      if (currentS === currentT) {
        const targetCount = currentCount - 1;
        if (targetCount <= 0) {
          set.delete(currentT);
        } else {
          set.set(currentT, targetCount);
        }
        pointer = j + 1;
        break;
      }
    }
  }

  return set.size <= 0;
}

// Time: O(n)
// Space: O(1)
function isSubsequence(s: string, t: string): boolean {
  let pointerS = 0;
  let pointerT = 0;

  while (pointerT < t.length && pointerS < s.length) {
    if (s[pointerS] === t[pointerT]) {
      pointerS++;
    }
    pointerT++;
  }

  return pointerS === s.length;
}

Deno.test(function testA() {
  const s = "abc";
  const t = "ahbgdc";
  Assert.assertEquals(isSubsequence(s, t), true);
  Assert.assertEquals(isSubsequenceV1(s, t), true);
});

Deno.test(function testB() {
  const s = "axc";
  const t = "ahbgdc";
  Assert.assertEquals(isSubsequence(s, t), false);
  Assert.assertEquals(isSubsequenceV1(s, t), false);
});

Deno.test(function testC() {
  const s = "danielmontilla";
  const t = "danielmontilla";
  Assert.assertEquals(isSubsequence(s, t), true);
  Assert.assertEquals(isSubsequenceV1(s, t), true);
});

Deno.test(function testD() {
  const s = "llll";
  const t = "bleltltelr";
  Assert.assertEquals(isSubsequence(s, t), true);
  Assert.assertEquals(isSubsequenceV1(s, t), true);
});

Deno.test(function testE() {
  const s = "lllll";
  const t = "llll";
  Assert.assertEquals(isSubsequence(s, t), false);
  Assert.assertEquals(isSubsequenceV1(s, t), false);
});

Deno.test(function testF() {
  const s = "";
  const t = "";
  Assert.assertEquals(isSubsequence(s, t), true);
  Assert.assertEquals(isSubsequenceV1(s, t), true);
});

Deno.test(function testG() {
  const s = "a";
  const t = "";
  Assert.assertEquals(isSubsequence(s, t), false);
  Assert.assertEquals(isSubsequenceV1(s, t), false);
});
