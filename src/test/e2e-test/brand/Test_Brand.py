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

class TestBrand:
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

    def test_superadmin_newbrand(self):
        http_auth = ('rbanala', 'Rdropdesk@123')
        cwd = str(Path('.').cwd())
        self.vars = {'cwd': cwd, 'http_auth': http_auth}
        self.driver = webdriver.Chrome(cwd + '\\chromedriver.exe')
        self.driver.implicitly_wait(10)
        # Create a new brand under the Super Admin Account
        self._sign_in('Superadmin', 'i3dmD74hl&%FdBrT')
        self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-root").click()  # Log in button
        time.sleep(2)
        acc_element = self.driver.find_element(By.XPATH, "//div[@id='root']//div[contains(@class,'MuiAvatar-circular')]/img")  # Account (upper right icon)
        time.sleep(1)
        self._mouseover_click(acc_element)
        self.driver.find_element(By.LINK_TEXT, "Brands").click()  # Navigate to the brands page from acc. dropdown
        time.sleep(1)
        # Create a new brand
        self.driver.find_element(By.XPATH, "//a[text()='Add Brand']").click()
        self.driver.find_element(By.ID, "new-item-bg").send_keys(self.vars['cwd'] + "\\bg.png")  # Upload bg image
        self.driver.find_element(By.XPATH, "//button[text()='Save']").click()  # save image
        time.sleep(1)
        self.driver.find_element(By.ID, "new-item-avatar").send_keys(
            self.vars['cwd'] + "\\logo.png")  # Upload logo image
        self.driver.find_element(By.XPATH, "//button[text()='Save']").click()  # save image
        time.sleep(1)

        self.driver.find_element(By.NAME, "name").send_keys("newtestbrand")  # Set name and domain to newtestbrand (to find and
        # edit more easily)
        self.driver.find_element(By.NAME, "domain").send_keys("newtestbrand")

        time.sleep(1)
        self.driver.find_element(By.XPATH,
                                 "//*[@id=\"root\"]/div[2]/div/div/div/div[2]/form/div/div[3]/div/button[2]").click()
        # Save the brand and then log out
        time.sleep(2)
        acc_element = self.driver.find_element(By.XPATH, "//div[@id='root']//div[contains(@class,'MuiAvatar-circular')]/img")
        time.sleep(0.5)
        self._mouseover_click(acc_element)
        self.driver.find_element(By.XPATH, '//li[contains(.,\'Logout\')]').click()
        self.driver.quit()
        return

    def test_superadmin_editnewbrand(self):
        http_auth = ('rbanala', 'Rdropdesk@123')
        cwd = str(Path('.').cwd())
        self.vars = {'cwd': cwd, 'http_auth': http_auth}
        self.driver = webdriver.Chrome(cwd + '\\chromedriver.exe')
        self.driver.implicitly_wait(10)

        self._sign_in('Superadmin', 'i3dmD74hl&%FdBrT')
        rand_name = 'bname' + str(r.randint(1, 1e6))
        self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-root").click()
        time.sleep(2)
        acc_element = self.driver.find_element(By.XPATH, "//div[@id='root']//div[contains(@class,'MuiAvatar-circular')]/img")  # Account (upper right icon)
        time.sleep(0.5)
        self._mouseover_click(acc_element)
        self.driver.find_element(By.LINK_TEXT, "Brands").click()  # Navigate to the brands page from acc. dropdown
        time.sleep(1)
        # Search for the "newtestbrand" brand that was just created and then edit it...
        self.driver.find_element(By.XPATH,  # Brand search textbox
                                 "/html/body/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div/div/div/div/div["
                                 "1]/div/div/input").send_keys('TestBrand')
        time.sleep(2)
        self.driver.find_element(By.CSS_SELECTOR, ".MuiIconButton-colorPrimary .MuiSvgIcon-root").click()
        self.driver.find_element(By.ID, "new-item-bg").send_keys(self.vars['cwd'] + "\\bg.png")  # Upload bg image
        self.driver.find_element(By.XPATH, "/html/body/div[3]/div[3]/div/div/div/button[6]").click()  # Save image
        self.driver.find_element(By.ID, "new-item-avatar").send_keys(
            self.vars['cwd'] + "\\logo.png")  # Upload logo image
        self.driver.find_element(By.XPATH, "/html/body/div[3]/div[3]/div/div/div/button[6]").click()  # Save image
        name_element = self.driver.find_element(By.NAME, "name")
        domain_element = self.driver.find_element(By.NAME, "domain")
        replace_text(name_element, rand_name)
        replace_text(domain_element, rand_name)
        time.sleep(1)
        # Check charge customer
        self.driver.find_element(By.XPATH,
                                 "//*[@id=\"root\"]/div[2]/div/div/div/div[2]/form/div/div[2]/div[7]/label/span["
                                 "1]/input").click()
        time.sleep(2)
        # Save and log out
        self.driver.find_element(By.XPATH,
                                 "//*[@id=\"root\"]/div[2]/div/div/div/div[2]/form/div/div[3]/div/button[3]").click()
        time.sleep(3)
        acc_element = self.driver.find_element(By.XPATH, "//div[@id='root']//div[contains(@class,'MuiAvatar-circular')]/img")
        time.sleep(0.5)
        self._mouseover_click(acc_element)
        self.driver.find_element(By.XPATH, '//li[contains(.,\'Logout\')]').click()
        time.sleep(3)
        self.driver.quit()
        return

    def test_superadmin_Searchbrand(self):
        http_auth = ('rbanala', 'Rdropdesk@123')
        cwd = str(Path('.').cwd())
        self.vars = {'cwd': cwd, 'http_auth': http_auth}
        self.driver = webdriver.Chrome(cwd + '\\chromedriver.exe')
        self.driver.implicitly_wait(10)

        self._sign_in('Superadmin', 'i3dmD74hl&%FdBrT')
        rand_name = 'bname' + str(r.randint(1, 1e6))
        self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-root").click()
        time.sleep(2)
        acc_element = self.driver.find_element(By.XPATH, "//div[@id='root']//div[contains(@class,'MuiAvatar-circular')]/img")  # Account (upper right icon)
        time.sleep(0.5)
        self._mouseover_click(acc_element)
        self.driver.find_element(By.LINK_TEXT, "Brands").click()  # Navigate to the brands page from acc. dropdown
        time.sleep(1)
        # Search for the "newtestbrand" brand that was just created and then edit it...
        self.driver.find_element(By.XPATH,  # Brand search textbox
                                 "/html/body/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div/div/div/div/div["
                                 "1]/div/div/input").send_keys('TestBrand')
        time.sleep(3)
        acc_element = self.driver.find_element(By.XPATH, "//div[@id='root']//div[contains(@class,'MuiAvatar-circular')]/img")
        time.sleep(0.5)
        self._mouseover_click(acc_element)
        self.driver.find_element(By.XPATH, '//li[contains(.,\'Logout\')]').click()
        time.sleep(3)
        self.driver.quit()
        return

    def test_superadmin_Deletebrand(self):
        http_auth = ('rbanala', 'Rdropdesk@123')
        cwd = str(Path('.').cwd())
        self.vars = {'cwd': cwd, 'http_auth': http_auth}
        self.driver = webdriver.Chrome(cwd + '\\chromedriver.exe')
        self.driver.implicitly_wait(10)

        self._sign_in('Superadmin', 'i3dmD74hl&%FdBrT')
        rand_name = 'bname' + str(r.randint(1, 1e6))
        self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-root").click()
        time.sleep(2)
        acc_element = self.driver.find_element(By.XPATH, "//div[@id='root']//div[contains(@class,'MuiAvatar-circular')]/img")  # Account (upper right icon)
        time.sleep(0.5)
        self._mouseover_click(acc_element)
        self.driver.find_element(By.LINK_TEXT, "Brands").click()  # Navigate to the brands page from acc. dropdown
        time.sleep(1)
        # Search for the "newtestbrand" brand that was just created and then edit it...
        self.driver.find_element(By.XPATH,  # Brand search textbox
                                 "/html/body/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div/div/div/div/div["
                                 "1]/div/div/input").send_keys('TestBrand')
        time.sleep(2)
        self.driver.find_element(By.XPATH, "//button[@class='MuiButtonBase-root MuiIconButton-root MuiIconButton-colorSecondary MuiIconButton-sizeSmall css-1qj0iwx-MuiButtonBase-root-MuiIconButton-root']").click()
        time.sleep(3)
        self.driver.find_element(By.XPATH, "//button[text()='Delete']").click()
        time.sleep(3)
        acc_element = self.driver.find_element(By.XPATH, "//div[@id='root']//div[contains(@class,'MuiAvatar-circular')]/img")
        time.sleep(0.5)
        self._mouseover_click(acc_element)
        self.driver.find_element(By.XPATH, '//li[contains(.,\'Logout\')]').click()
        time.sleep(3)
        self.driver.quit()
        return
