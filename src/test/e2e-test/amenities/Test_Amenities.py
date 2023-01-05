import time
from pathlib import Path
import random as r
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import ElementClickInterceptedException
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.support.ui import Select


def replace_text(element, text):
    #  Quickly replace the text in a field element
    element.send_keys(Keys.CONTROL + "a")
    element.send_keys(Keys.DELETE)
    element.send_keys(text)
    return

class TestAmenities:

    def teardown_method(self):
        self.driver.quit()
        return

    def _sign_in(self, username, password):
        # Handle http authentication for each use case
        httpauth = self.vars['http_auth']
        if username == 'Superadmin':
            self.driver.get(f"https://{httpauth[0]}:{httpauth[1]}@dev2-local.drop-desk.com/sign")
        else:
            self.driver.get(f"https://{httpauth[0]}:{httpauth[1]}@digitalmarketingagency.dev2.drop-desk.com/dashboard"
                            f"/activity")
        self.driver.set_window_size(1265, 1372)
        self.driver.find_element(By.XPATH, "//span[contains(.,\'Sign in by Username and Password\')]").click()
        self.driver.find_element(By.NAME, "password").send_keys(password)
        self.driver.find_element(By.NAME, "username").send_keys(username)

    def _mouseover_click(self, element):
        #  Emulate a user mouseover of a page element and click the element
        actions = ActionChains(self.driver)
        time.sleep(0.25)
        actions.move_to_element(element).click().perform()
        return

    def test_superadmin_AddAmenities(self):
        http_auth = ('rbanala', 'Rdropdesk@123')
        cwd = str(Path('.').cwd())
        self.vars = {'cwd': cwd, 'http_auth': http_auth}
        self.driver = webdriver.Chrome(cwd + '\\chromedriver.exe')
        self.driver.implicitly_wait(10)
        # Create a new brand under the Super Admin Account
        self._sign_in('Superadmin', 'i3dmD74hl&%FdBrT')
        logged_in = 1
        venue_name = 'Test Venue_' + str(r.randint(1, 1e6))
        self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-root").click()
        time.sleep(10)
        self.driver.find_element(By.XPATH, "//*[@id=\"root\"]/section/nav/a[2]").click()
        self.driver.find_element(By.XPATH, "/html/body/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div/div/div/div["
                                           "1]/div[1]/div/div/input").send_keys('Test1/14/22')  # Search for "testvenue"
        time.sleep(4)
        self.driver.find_element(By.XPATH,
                                  "//*[@id=\"root\"]/div[2]/div/div[1]/div/div/div[2]/div/div/div/div/div[2]/div/div[1]/div/div/button[1]").click()
                                  # Click on the venue from the search result
        time.sleep(10)
        # Click on Venue Inventory
        self.driver.find_element(By.XPATH, "//button[text()='Venue Inventory']").click()
        # Select any one and tap on view details
        self.driver.find_element(By.XPATH, "//span[text()='View Details']").click()
        time.sleep(4)
        #Add new amenity
        self.driver.find_element(By.XPATH, "//button[text()='Add new']").click()
        time.sleep(4)
        self.driver.find_element(By.XPATH,"//div[@id='mui-component-select-amenityId']").click()
        time.sleep(2)
        self.driver.find_element(By.XPATH,"//*[@id=\"menu-amenityId\"]/div[3]/ul/li[1]").click()
        time.sleep(2)
        self.driver.find_element(By.XPATH,"/html/body/div[3]/div[3]/div/div/div/div/div[2]/div[1]/div/input").send_keys("Test")
        time.sleep(2)
        self.driver.find_element(By.XPATH,"/html/body/div[3]/div[3]/div/div/div/div/div[3]/div/div/input").send_keys("Test")
        time.sleep(2)
        self.driver.find_element(By.XPATH,"/html/body/div[3]/div[3]/div/div/div/div/div[4]/div/div[1]/div/div").click()
        time.sleep(2)
        self.driver.find_element(By.XPATH,"//*[@id=\"menu-chargeType\"]/div[3]/ul/li").click()
        time.sleep(4)
        price = self.driver.find_element(By.XPATH,"/html/body/div[3]/div[3]/div/div/div/div/div[4]/div/div[2]/div/div/input")
        replace_text(price, "$1.00")
        time.sleep(2)
        salesTax = self.driver.find_element(By.XPATH,"//input[@name='salesTax']")
        replace_text(salesTax, "10")
        time.sleep(2)
        #Add amenity (Tap on Add Amenity Button)
        self.driver.find_element(By.XPATH, "//button[text()='Add Amenity']").click()
        time.sleep(2)
        #log out
        while logged_in:
            try:
                time.sleep(3)
                self.driver.find_element(By.XPATH, "//*[@id=\"root\"]/div[1]/div[1]/div[4]/div/div/div/div").click()
                logout = self.driver.find_element(By.XPATH, "/html/body/div[2]/div[3]/ul/li")
                self._mouseover_click(logout)
                logged_in = 0
            except ElementClickInterceptedException as err:
                print('Waiting for page load...')
        self.driver.quit()
        return     

    def test_superadmin_EditAmenities(self):
        http_auth = ('rbanala', 'Rdropdesk@123')
        cwd = str(Path('.').cwd())
        self.vars = {'cwd': cwd, 'http_auth': http_auth}
        self.driver = webdriver.Chrome(cwd + '\\chromedriver.exe')
        self.driver.implicitly_wait(10)
        # Create a new brand under the Super Admin Account
        self._sign_in('Superadmin', 'i3dmD74hl&%FdBrT')
        logged_in = 1
        venue_name = 'Test Venue_' + str(r.randint(1, 1e6))
        self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-root").click()
        time.sleep(10)
        self.driver.find_element(By.XPATH, "//*[@id=\"root\"]/section/nav/a[2]").click()
        self.driver.find_element(By.XPATH, "/html/body/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div/div/div/div["
                                           "1]/div[1]/div/div/input").send_keys('Test1/14/22')  # Search for "testvenue"
        time.sleep(4)
        self.driver.find_element(By.XPATH,
                                  "//*[@id=\"root\"]/div[2]/div/div[1]/div/div/div[2]/div/div/div/div/div[2]/div/div[1]/div/div/button[1]").click()
                                  # Click on the venue from the search result
        time.sleep(10)
        # Click on Venue Inventory
        self.driver.find_element(By.XPATH, "//button[text()='Venue Inventory']").click()
        # Select any one and tap on view details
        self.driver.find_element(By.XPATH, "//span[text()='View Details']").click()
        time.sleep(4)
        #Add new amenity
        self.driver.find_element(By.XPATH, "/html/body/div[1]/div[2]/div/div[2]/div/div[2]/form/div/div[1]/div[6]/div/div/button[1]").click()
        time.sleep(4)
        self.driver.find_element(By.XPATH,"//div[@id='mui-component-select-amenityId']").click()
        time.sleep(2)
        self.driver.find_element(By.XPATH,"//*[@id=\"menu-amenityId\"]/div[3]/ul/li[1]").click()
        time.sleep(2)
        self.driver.find_element(By.XPATH,"/html/body/div[3]/div[3]/div/div/div/div/div[2]/div[1]/div/input").send_keys("Test")
        time.sleep(2)
        self.driver.find_element(By.XPATH,"/html/body/div[3]/div[3]/div/div/div/div/div[3]/div/div/input").send_keys("Test")
        time.sleep(2)
        self.driver.find_element(By.XPATH,"/html/body/div[3]/div[3]/div/div/div/div/div[4]/div/div[1]/div/div").click()
        time.sleep(2)
        self.driver.find_element(By.XPATH,"//*[@id=\"menu-chargeType\"]/div[3]/ul/li").click()
        time.sleep(4)
        price = self.driver.find_element(By.XPATH,"/html/body/div[3]/div[3]/div/div/div/div/div[4]/div/div[2]/div/div/input")
        replace_text(price, "$1.00")
        time.sleep(2)
        salesTax = self.driver.find_element(By.XPATH,"//input[@name='salesTax']")
        replace_text(salesTax, "10")
        time.sleep(2)
        self.driver.find_element(By.XPATH, "//button[text()='Edit Amenity']").click()
        time.sleep(2)
        #log out
        while logged_in:
            try:
                time.sleep(3)
                self.driver.find_element(By.XPATH, "//*[@id=\"root\"]/div[1]/div[1]/div[4]/div/div/div/div").click()
                logout = self.driver.find_element(By.XPATH, "/html/body/div[2]/div[3]/ul/li")
                self._mouseover_click(logout)
                logged_in = 0
            except ElementClickInterceptedException as err:
                print('Waiting for page load...')
        self.driver.quit()
        return 

    def test_superadmin_DeleteAmenities(self):
        http_auth = ('rbanala', 'Rdropdesk@123')
        cwd = str(Path('.').cwd())
        self.vars = {'cwd': cwd, 'http_auth': http_auth}
        self.driver = webdriver.Chrome(cwd + '\\chromedriver.exe')
        self.driver.implicitly_wait(10)
        # Create a new brand under the Super Admin Account
        self._sign_in('Superadmin', 'i3dmD74hl&%FdBrT')
        logged_in = 1
        venue_name = 'Test Venue_' + str(r.randint(1, 1e6))
        self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-root").click()
        time.sleep(10)
        self.driver.find_element(By.XPATH, "//*[@id=\"root\"]/section/nav/a[2]").click()
        self.driver.find_element(By.XPATH, "/html/body/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div/div/div/div["
                                           "1]/div[1]/div/div/input").send_keys('Test1/14/22')  # Search for "testvenue"
        time.sleep(4)
        self.driver.find_element(By.XPATH,
                                  "//*[@id=\"root\"]/div[2]/div/div[1]/div/div/div[2]/div/div/div/div/div[2]/div/div[1]/div/div/button[1]").click()
                                  # Click on the venue from the search result
        time.sleep(10)
        # Click on Venue Inventory
        self.driver.find_element(By.XPATH, "//button[text()='Venue Inventory']").click()
        # Select any one and tap on view details
        self.driver.find_element(By.XPATH, "//span[text()='View Details']").click()
        time.sleep(4)
        #Delete amenity
        self.driver.find_element(By.XPATH, "/html/body/div[1]/div[2]/div/div[2]/div/div[2]/form/div/div[1]/div[6]/div/div/button[2]").click()
        time.sleep(4)
        self.driver.find_element(By.XPATH, "/html/body/div[3]/div[3]/div/div[2]/button[2]").click()
        time.sleep(2)
        #log out
        while logged_in:
            try:
                time.sleep(3)
                self.driver.find_element(By.XPATH, "//*[@id=\"root\"]/div[1]/div[1]/div[4]/div/div/div/div").click()
                logout = self.driver.find_element(By.XPATH, "/html/body/div[2]/div[3]/ul/li")
                self._mouseover_click(logout)
                logged_in = 0
            except ElementClickInterceptedException as err:
                print('Waiting for page load...')
        self.driver.quit()
        return   