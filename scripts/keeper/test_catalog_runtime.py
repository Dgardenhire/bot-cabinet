import unittest
from catalog_runtime import zero_price_model


class PriceGuardTests(unittest.TestCase):
    def test_requires_both_explicit_zero_prices(self):
        self.assertTrue(zero_price_model([{"id": "m", "pricing": {"prompt": "0", "completion": "0"}}], "m"))
        for pricing in ({}, {"prompt": 0}, {"prompt": 0, "completion": .001}, {"prompt": None, "completion": 0}):
            self.assertFalse(zero_price_model([{"id": "m", "pricing": pricing}], "m"))

    def test_free_name_or_different_model_is_not_evidence(self):
        self.assertFalse(zero_price_model([{"id": "m:free"}], "m:free"))
        self.assertFalse(zero_price_model([{"id": "other", "pricing": {"prompt": 0, "completion": 0}}], "m"))


if __name__ == "__main__":
    unittest.main()
