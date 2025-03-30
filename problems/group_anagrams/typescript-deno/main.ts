import * as Assert from "jsr:@std/assert@1";

function groupAnagramsV1(strs: string[]): string[][] {
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  const letterLookup = alphabet.reduce(
    (acc, letter, i) => {
      acc[letter] = i;
      return acc;
    },
    {} as Record<string, number>
  );
  const groups: Record<string, string[]> = {};

  for (let i = 0; i < strs.length; i++) {
    const str = strs[i];

    const keyArr = new Uint8Array(26).fill(0);

    for (let j = 0; j < str.length; j++) {
      const letter = str[j];
      keyArr[letterLookup[letter]] += 1;
    }

    let key = "";

    for (let j = 0; j < keyArr.length; j++) {
      key += `${alphabet[j]}${keyArr[j]}`;
    }

    const group = groups[key];

    if (!group) {
      groups[key] = [str];
    } else {
      group.push(str);
    }
  }

  return Object.values(groups);
}

function groupAnagrams(strs: string[]): string[][] {
  const generateKey = (str: string): string => {
    const keyArr = new Array(26).fill(0);

    for (let i = 0; i < str.length; i++) {
      keyArr[str.charCodeAt(i) - 97]++;
    }

    return String.fromCharCode(...keyArr);
  };

  const groups = new Map<string, string[]>();

  for (let i = 0; i < strs.length; i++) {
    const str = strs[i];

    const key = generateKey(str);

    const group = groups.get(key);

    if (!group) {
      groups.set(key, [str]);
    } else {
      group.push(str);
    }
  }

  return [...groups.values()];
}

const sortGroup = (arr: string[][]) => {
  return arr
    .map(group => group.sort())
    .sort((a, b) => {
      if (a.length !== b.length) return a.length - b.length;
      return a[0].localeCompare(b[0]);
    });
};

Deno.test(function testA() {
  const input = ["eat", "tea", "tan", "ate", "nat", "bat"];
  const expected = [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]];
  const actualV1 = groupAnagramsV1(input);
  const actual = groupAnagrams(input);

  Assert.assertEquals(sortGroup(actualV1), sortGroup(expected));
  Assert.assertEquals(sortGroup(actual), sortGroup(expected));
});
Deno.test(function testB() {
  const input = [""];
  const expected = [[""]];
  const actualV1 = groupAnagramsV1(input);
  const actual = groupAnagrams(input);

  Assert.assertEquals(sortGroup(actualV1), sortGroup(expected));
  Assert.assertEquals(sortGroup(actual), sortGroup(expected));
});
Deno.test(function testC() {
  const input = ["a"];
  const expected = [["a"]];
  const actualV1 = groupAnagramsV1(input);
  const actual = groupAnagrams(input);

  Assert.assertEquals(sortGroup(actualV1), sortGroup(expected));
  Assert.assertEquals(sortGroup(actual), sortGroup(expected));
});

Deno.test(function testD() {
  const input = ["bdddddddddd", "bbbbbbbbbbc"];
  const expected = [["bbbbbbbbbbc"], ["bdddddddddd"]];
  const actualV1 = groupAnagramsV1(input);
  const actual = groupAnagrams(input);

  Assert.assertEquals(sortGroup(actualV1), sortGroup(expected));
  Assert.assertEquals(sortGroup(actual), sortGroup(expected));
});
