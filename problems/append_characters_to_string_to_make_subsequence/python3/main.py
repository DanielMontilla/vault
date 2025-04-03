import unittest


class Solution:
    def appendCharactersV1(self, s: str, t: str) -> int:
        pointerS = 0
        pointerT = 0

        while pointerS < len(s) and pointerT < len(t):
            if s[pointerS] == t[pointerT]:
                pointerT += 1
            pointerS += 1

        return len(t) - pointerT

    def appendCharacters(self, s: str, t: str) -> int:
        pointerS = 0
        pointerT = 0

        ls = len(s)
        lt = len(t)

        while pointerS < ls and pointerT < lt:
            if s[pointerS] == t[pointerT]:
                pointerT += 1
            pointerS += 1

        return lt - pointerT


solution = Solution()


class Tests(unittest.TestCase):
    def test_a(self):
        s = "coaching"
        t = "coding"
        expected = 4
        self.assertEqual(solution.appendCharactersV1(s, t), expected)
        self.assertEqual(solution.appendCharacters(s, t), expected)

    def test_b(self):
        s = "lbg"
        t = "g"
        expected = 0
        self.assertEqual(solution.appendCharactersV1(s, t), expected)
        self.assertEqual(solution.appendCharacters(s, t), expected)


if __name__ == "__main__":
    unittest.main()
