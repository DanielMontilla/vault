import * as Assert from "jsr:@std/assert@1";

function generate(numRows: number): number[][] {
  const output: number[][] = [];

  for (let i = 0; i < numRows; i++) {
    const row = Array<number>(i);

    for (let j = 0; j < i + 1; j++) {
      if (j === 0 || j === i) {
        row[j] = 1;
        continue;
      }

      const prevRow = output[i - 1];
      const left = prevRow[j - 1];
      const right = prevRow[j];

      row[j] = left + right;
    }

    output.push(row);
  }

  return output;
}

Deno.test(function testA() {
  const numRows = 5;
  const expected = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]];
  Assert.assertEquals(generate(numRows), expected);
});
Deno.test(function testB() {
  const numRows = 1;
  const expected = [[1]];
  Assert.assertEquals(generate(numRows), expected);
});
