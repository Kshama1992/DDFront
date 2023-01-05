import time
from pathlib import Path
import random as r
import unittest
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

class TestRoles(unittest.TestCase):

    def _sign_in(self, username, password):
        # Handle http authentication for each use case
        httpauth = self.vars['http_auth']
        if username == 'Superadmin':
            self.driver.get(f"https://{httpauth[0]}:{httpauth[1]}@dev.dropdesk.net/sign")
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
        
    def test_viewRolesBySuperadmin(self):
        http_auth = ('rbanala', 'Rdropdesk@123')
        cwd = str(Path('.').cwd())
        self.vars = {'cwd': cwd, 'http_auth': http_auth}
        self.driver = webdriver.Chrome(cwd + '\\chromedriver.exe')
        self.driver.implicitly_wait(10)
        
        self._sign_in('Superadmin', 'TbcLM8qeSMb9yyNkDxI6GKdK0EDVN')
        logged_in = 1
        rand_name = 'vteams' + str(r.randint(1, 1e6))
        self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-root").click()  # Log in button
        time.sleep(2)
        acc_element = self.driver.find_element(By.XPATH, "//div[@id='root']//div[contains(@class,'MuiAvatar-circular')]/img")  # Account (upper right icon)
        time.sleep(1)
        self._mouseover_click(acc_element)
        self.driver.find_element(By.LINK_TEXT, "Roles").click()  # Navigate to the Roles page from acc. dropdown
        time.sleep(1)
        elementLength = len(self.driver.find_elements(By.XPATH,"//*[@id='root']/div[2]/div/div[2]/div/div[1]/div/div[1]/h1/b[contains(text(),'Roles')]"))
        print(elementLength)
        self.assertEqual(elementLength,1)

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

    def test_newRolesBySuperadmin(self):
        http_auth = ('rbanala', 'Rdropdesk@123')
        cwd = str(Path('.').cwd())
        self.vars = {'cwd': cwd, 'http_auth': http_auth}
        self.driver = webdriver.Chrome(cwd + '\\chromedriver.exe')
        self.driver.implicitly_wait(10)
        # Create a new Role under the Super Admin Account
        self._sign_in('Superadmin', 'TbcLM8qeSMb9yyNkDxI6GKdK0EDVN')
        self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-root").click()  # Log in button
        time.sleep(5)
        acc_element = self.driver.find_element(By.XPATH, "//div[@id='root']//div[contains(@class,'MuiAvatar-circular')]/img")  # Account (upper right icon)
        time.sleep(5)
        self._mouseover_click(acc_element)
        self.driver.find_element(By.LINK_TEXT, "Roles").click()  # Navigate to the Roles page from acc. dropdown
        time.sleep(1)
        Role_name = 'newtestRole'
        # Create a new role
        self.driver.find_element(By.XPATH, "//a[text()='Add Role']").click()
        time.sleep(1)
        self.driver.find_element(By.NAME, "name").send_keys(Role_name)  # Set name and domain to newTestRole (to find and
        # # edit more easily)
        self.driver.find_element(By.XPATH, "//input [@id= 'select-brand-async'] ").click()
        self.driver.find_element(By.XPATH, "//input [@id= 'select-brand-async'] ").send_keys("ThinkSynergy")
        self.driver.find_element(By.XPATH,"//*[@id='mui-component-select-roleType']").click()
        time.sleep(1)
        self.driver.find_element(By.XPATH,"//*[@id='menu-roleType']/div[3]/ul/li[1]").click()
        time.sleep(4)

        self.driver.find_element(By.XPATH,"//*[@id='root']/div[2]/div/div/div/div[2]/form/div/div[2]/div[4]/div/div[1]/ul/div[1]/div[1]/span/input").click()
        
        time.sleep(6)     
        self.driver.find_element(By.XPATH,"//button[text() = 'Save role']").click()
        time.sleep(10)  
        self.driver.find_element(By.XPATH,"/html/body/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div/div/div/div/div[1]/div/div/input").click()
        self.driver.find_element(By.XPATH,"/html/body/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div/div/div/div/div[1]/div/div/input").send_keys(Role_name)
        time.sleep(6) 
        elementLength= len(self.driver.find_elements(By.XPATH,"//*[contains(text(),'newtestRole')]"))
        print(elementLength)
        self.assertGreaterEqual(elementLength,1)

        # Save the role and then log out
        time.sleep(2)
        acc_element = self.driver.find_element(By.XPATH, "//div[@id='root']//div[contains(@class,'MuiAvatar-circular')]/img")
        time.sleep(0.5)
        self._mouseover_click(acc_element)
        self.driver.find_element(By.XPATH, '//li[contains(.,\'Logout\')]').click()
        self.driver.quit()
        return

    def test_editRoleBySuperadmin(self):
        http_auth = ('rbanala', 'Rdropdesk@123')
        cwd = str(Path('.').cwd())
        self.vars = {'cwd': cwd, 'http_auth': http_auth}
        self.driver = webdriver.Chrome(cwd + '\\chromedriver.exe')
        self.driver.implicitly_wait(10)
        #under the Super Admin Account
        self._sign_in('Superadmin', 'TbcLM8qeSMb9yyNkDxI6GKdK0EDVN')
        self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-root").click()  # Log in button
        time.sleep(5)
        acc_element = self.driver.find_element(By.XPATH, "//div[@id='root']//div[contains(@class,'MuiAvatar-circular')]/img")  # Account (upper right icon)
        time.sleep(5)
        self._mouseover_click(acc_element)
        self.driver.find_element(By.LINK_TEXT, "Roles").click()  # Navigate to the Roles page from acc. dropdown
        time.sleep(1)
        Role_name = 'EditedtestRole'
        self.driver.find_element(By.XPATH,"/html/body/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div/div/div/div/div[1]/div/div/input").click()
        self.driver.find_element(By.XPATH,"/html/body/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div/div/div/div/div[1]/div/div/input").send_keys(Role_name)
        time.sleep(18)     
        # Edit a role
        self.driver.find_element(By.XPATH, "//*[@id='root']/div[2]/div/div[2]/div/div[2]/div/div/div[2]/div[2]/div/div/div/div[1]/div[5]/p/a").click()
        time.sleep(1)
        role_ele = self.driver.find_element(By.NAME, "name")  # Set name and domain to newTestRole (to find and edit more easily)
        replace_text(role_ele, Role_name)
        self.driver.find_element(By.XPATH, "//input [@id= 'select-brand-async'] ").click()
        self.driver.find_element(By.XPATH, "//input [@id= 'select-brand-async'] ").send_keys("ThinkSynergy")
        self.driver.find_element(By.XPATH,"//*[@id='mui-component-select-roleType']").click()
        # time.sleep(1)
        self.driver.find_element(By.XPATH,"//*[@id='menu-roleType']/div[3]/ul/li[1]").click()
        time.sleep(4)

        self.driver.find_element(By.XPATH,"//*[@id='root']/div[2]/div/div/div/div[2]/form/div/div[2]/div[4]/div/div[1]/ul/div[1]/div[1]/span/input").click()
        
        time.sleep(6)     
        self.driver.find_element(By.XPATH,"//button[text() = 'Save role']").click()
        time.sleep(10)  
        self.driver.find_element(By.XPATH,"/html/body/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div/div/div/div/div[1]/div/div/input").click()
        self.driver.find_element(By.XPATH,"/html/body/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div/div/div/div/div[1]/div/div/input").send_keys(Role_name)
        time.sleep(6)     
        elementLength= len(self.driver.find_elements(By.XPATH,"//*[contains(text(),'EditedtestRole')]"))
        print(elementLength)
        self.assertGreaterEqual(elementLength,1)
       
        # edit the role and then log out
        time.sleep(2)
        acc_element = self.driver.find_element(By.XPATH, "//div[@id='root']//div[contains(@class,'MuiAvatar-circular')]/img")
        time.sleep(0.5)
        self._mouseover_click(acc_element)
        self.driver.find_element(By.XPATH, '//li[contains(.,\'Logout\')]').click()
        self.driver.quit()
        return
    
    def test_deleteRoleBySuperadmin(self):
        http_auth = ('rbanala', 'Rdropdesk@123')
        cwd = str(Path('.').cwd())
        self.vars = {'cwd': cwd, 'http_auth': http_auth}
        self.driver = webdriver.Chrome(cwd + '\\chromedriver.exe')
        self.driver.implicitly_wait(10)
        # delete a role under the Super Admin Account
        self._sign_in('Superadmin', 'TbcLM8qeSMb9yyNkDxI6GKdK0EDVN')
        self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-root").click()  # Log in button
        time.sleep(5)
        acc_element = self.driver.find_element(By.XPATH, "//div[@id='root']//div[contains(@class,'MuiAvatar-circular')]/img")  # Account (upper right icon)
        time.sleep(5)
        self._mouseover_click(acc_element)
        self.driver.find_element(By.LINK_TEXT, "Roles").click()  # Navigate to the Roles page from acc. dropdown
        time.sleep(1)
        Role_name = 'EditedtestRole'
        self.driver.find_element(By.XPATH,"/html/body/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div/div/div/div/div[1]/div/div/input").click()
        self.driver.find_element(By.XPATH,"/html/body/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div/div/div/div/div[1]/div/div/input").send_keys(Role_name)
        time.sleep(15)     
        # Delete role
        self.driver.find_element(By.XPATH, "//*[@id='root']/div[2]/div/div[2]/div/div[2]/div/div/div[2]/div[2]/div/div/div/div[1]/div[5]/p/button").click()
        time.sleep(1)
        self.driver.find_element(By.XPATH,"/html/body/div[3]/div[3]/div/div/button[2]").click()
        time.sleep(10)  
        self.driver.find_element(By.XPATH,"/html/body/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div/div/div/div/div[1]/div/div/input").click()
        self.driver.find_element(By.XPATH,"/html/body/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div/div/div/div/div[1]/div/div/input").send_keys(Role_name)
        time.sleep(6)     
        elementLength= len(self.driver.find_elements(By.XPATH("//*[contains(text(),'EditedtestRole')]")))
        print(elementLength)
        self.assertEqual(elementLength,0)
       
        # delete the role and then log out
        time.sleep(2)
        acc_element = self.driver.find_element(By.XPATH, "//div[@id='root']//div[contains(@class,'MuiAvatar-circular')]/img")
        time.sleep(0.5)
        self._mouseover_click(acc_element)
        self.driver.find_element(By.XPATH, '//li[contains(.,\'Logout\')]').click()
        self.driver.quit()
        return



      
    



