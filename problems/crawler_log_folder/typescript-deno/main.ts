import * as Assert from "jsr:@std/assert@1";

function minOperations(logs: string[]): number {
  let depth = 0;

  for (let i = 0; i < logs.length; i++) {
    if (logs[i] === "./") continue;
    if (logs[i] === "../") {
      depth = Math.max(depth - 1, 0);
      continue;
    }
    depth++;
  }

  return depth;
}

Deno.test(function testA() {
  const logs = ["d1/", "d2/", "../", "d21/", "./"];
  const expected = 2;
  Assert.assertEquals(minOperations(logs), expected);
});

Deno.test(function testB() {
  const logs = ["d1/", "d2/", "./", "d3/", "../", "d31/"];
  const expected = 3;
  Assert.assertEquals(minOperations(logs), expected);
});

Deno.test(function testC() {
  const logs = ["d1/", "../", "../", "../"];
  const expected = 0;
  Assert.assertEquals(minOperations(logs), expected);
});

Deno.test(function testD() {
  const logs = ["./", "wz4/", "../", "mj2/", "../", "../", "ik0/", "il7/"];
  const expected = 2;
  Assert.assertEquals(minOperations(logs), expected);
});
