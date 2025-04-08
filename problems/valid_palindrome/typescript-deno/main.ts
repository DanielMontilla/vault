import * as Assert from "jsr:@std/assert@1";

function isPalindromeV1(s: string): boolean {
  let leftPointer = 0;
  let rightPointer = s.length - 1;

  const isAlphanumeric = (char: string) => /^[a-zA-Z0-9]$/.test(char);

  while (s[leftPointer] && !isAlphanumeric(s[leftPointer])) {
    leftPointer += 1;
  }

  while (s[rightPointer] && !isAlphanumeric(s[rightPointer])) {
    rightPointer -= 1;
  }

  while (leftPointer < rightPointer) {
    if (s[leftPointer].toLowerCase() !== s[rightPointer].toLowerCase()) {
      return false;
    }

    leftPointer += 1;
    rightPointer -= 1;

    while (!isAlphanumeric(s[leftPointer])) {
      leftPointer += 1;
    }

    while (!isAlphanumeric(s[rightPointer])) {
      rightPointer -= 1;
    }
  }

  return true;
}

function isPalindrome(s: string): boolean {
  const word = s.toLowerCase().replace(/[^a-z0-9]/g, "");

  let l = 0;
  let r = word.length - 1;

  while (l < r) {
    if (word.charAt(l).toLowerCase() != word.charAt(r).toLowerCase()) {
      return false;
    }

    l++;
    r--;
  }

  return true;
}

Deno.test(function testppA() {
  const input = "A man, a plan, a canal: Panama";
  const expected = true;
  Assert.assertEquals(isPalindromeV1(input), expected);
  Assert.assertEquals(isPalindrome(input), expected);
});

Deno.test(function testB() {
  const input = "race a car";
  const expected = false;
  Assert.assertEquals(isPalindromeV1(input), expected);
  Assert.assertEquals(isPalindrome(input), expected);
});

Deno.test(function testC() {
  const input = " ";
  const expected = true;
  Assert.assertEquals(isPalindromeV1(input), expected);
  Assert.assertEquals(isPalindrome(input), expected);
});

Deno.test(function testD() {
  const input = "";
  const expected = true;
  Assert.assertEquals(isPalindromeV1(input), expected);
  Assert.assertEquals(isPalindrome(input), expected);
});
Deno.test(function testE() {
  const input = "0P";
  const expected = false;
  Assert.assertEquals(isPalindromeV1(input), expected);
  Assert.assertEquals(isPalindrome(input), expected);
});
Deno.test(function testF() {
  const input = "ab_a";
  const expected = true;
  Assert.assertEquals(isPalindromeV1(input), expected);
  Assert.assertEquals(isPalindrome(input), expected);
});
