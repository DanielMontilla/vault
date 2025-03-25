from typing import List
import unittest


def twoSum(nums: List[int], target: int) -> List[int]:
    hashmap: dict[int, int] = {}

    for j, n in enumerate(nums):
        hashmap[n] = j

    for i, n in enumerate(nums):
        j = hashmap.get(target - n)

        if j is None or j == i:
            continue

        return [i, j]


class Tests(unittest.TestCase):

    def test_a(self):
        nums = [2, 7, 11, 15]
        target = 9
        expected = [0, 1]
        self.assertEqual(twoSum(nums, target), expected)

    def test_b(self):
        nums = [3, 2, 4]
        target = 6
        expected = [1, 2]
        self.assertEqual(twoSum(nums, target), expected)

    def test_c(self):
        nums = [3, 3]
        target = 6
        expected = [0, 1]
        self.assertEqual(twoSum(nums, target), expected)


if __name__ == "__main__":
    unittest.main()
