from typing import List
import unittest


class Solution:
    def numUniqueEmails(self, emails: List[str]) -> int:
        emails_out = set()

        for email in emails:
            local_raw, domain = email.split("@")

            local, *_ = local_raw.split("+")

            local = local.replace(".", "")

            emails_out.add(local + "@" + domain)

        return len(emails_out)


solution = Solution()


class Tests(unittest.TestCase):
    def test_a(self):
        emails = [
            "test.email+alex@leetcode.com",
            "test.e.mail+bob.cathy@leetcode.com",
            "testemail+david@lee.tcode.com",
        ]
        expected = 2
        self.assertEqual(solution.numUniqueEmails(emails), expected)

    def test_b(self):
        emails = ["a@leetcode.com", "b@leetcode.com", "c@leetcode.com"]
        expected = 3
        self.assertEqual(solution.numUniqueEmails(emails), expected)


if __name__ == "__main__":
    unittest.main()
