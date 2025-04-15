
fun assertEquals(name: String, output: Any, expected: Any) {
  val result = if (output == expected) "PASSED" else "FAILED"
  println("[$result] $name")
  println("   Expected: $expected")
  println("   Actual:   $output\n")
}


fun mergeAlternately(word1: String, word2: String): String {
  var str = "";

  var ptr = 0;
  val count = maxOf(word1.length, word2.length)

  while (ptr < count) {
    val w1 = word1.getOrNull(ptr);
    val w2 = word2.getOrNull(ptr);

    if (w1 != null) str += w1
    if (w2 != null) str += w2

    ptr++;
  }

  return str;
}

assertEquals(
  "Equal lengths", 
  mergeAlternately("ab", "12"), 
  "a1b2"
)
  
assertEquals(
  "Uneven lengths", 
  mergeAlternately("abc", "1"), 
  "a1bc"
)
  
assertEquals(
  "Empty strings", 
  mergeAlternately("", ""), 
  ""
)