import * as Assert from "jsr:@std/assert@1";

const {{problem_name}} = () => {
  return null;
}

Deno.test(function testA() {
  Assert.assertEquals({{problem_name}}(), null);
});
