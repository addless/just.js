import os
import unittest
from selenium import webdriver

BASE_DIR = os.path.dirname(os.path.realpath(__file__))
print BASE_DIR

class TestOne(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.set_window_size(1120, 550)

    def test_simple(self):
        print BASE_DIR
        self.driver.get('file://{path}/simple_fixture.html'.format(path=BASE_DIR))
        # self.driver.find_element_by_id('name-field').send_keys("just bindings...")
        value = self.driver.find_element_by_id('name-field').get_attribute('value')
        self.assertEqual(value, 'This is the data for the name field.')

    def tearDown(self):
        self.driver.quit()

if __name__ == '__main__':
    unittest.main()