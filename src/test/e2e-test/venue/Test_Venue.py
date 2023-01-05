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


class TestVenue:
    
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
        
    def test_Superadmin_editvenue(self):
        http_auth = ('rbanala', 'Rdropdesk@123')
        cwd = str(Path('.').cwd())
        self.vars = {'cwd': cwd, 'http_auth': http_auth}
        self.driver = webdriver.Chrome(cwd + '\\chromedriver.exe')
        self.driver.implicitly_wait(10)

        self._sign_in('Superadmin', 'i3dmD74hl&%FdBrT')
        logged_in = 1
        venue_name = 'Test Venue_' + str(r.randint(1, 1e6))
        self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-root").click()
        time.sleep(1)
        self.driver.find_element(By.XPATH, "//*[@id=\"root\"]/section/nav/a[2]").click()
        self.driver.find_element(By.XPATH, "/html/body/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div/div/div/div["
                                           "1]/div[1]/div/div/input").send_keys('Bridgeworks')  # Search for "testvenue"
        time.sleep(4)
        self.driver.find_element(By.XPATH,
                                  "//*[@id=\"root\"]/div[2]/div/div[1]/div/div/div[2]/div/div/div/div/div[2]/div/div[1]/div/div/button[1]").click()
                                  # Click on the venue from the search result

        self.driver.find_element(By.ID, "new-item-avatar").send_keys(self.vars['cwd'] + "\\logo.png")
        self.driver.find_element(By.XPATH, "/html/body/div[3]/div[3]/div/div/div/button[6]").click()  # Save image
        time.sleep(1)
        name_element = self.driver.find_element(By.NAME, "name")
        replace_text(name_element, venue_name)
        add_select = self.driver.find_element(By.XPATH,
                                              "/html/body/div[1]/div[2]/div/div[2]/div/div[2]/div[2]/div/form/div/div["
                                              "1]/div[1]/div/div[2]/div[1]/div/div/input")
        replace_text(add_select, "1016 Walsh Avenue, Woodmere, NY, USA")
        add_select_mui = add_select.get_attribute('id')
        time.sleep(0.5)
        self.driver.find_element(By.XPATH, f"//*[@id=\"{add_select_mui}-option-0\"]").click()

        element = self.driver.find_element(By.NAME, "address2")
        replace_text(element, "Suite 200")

        self.driver.find_element(By.XPATH, "//*[@id=\"wrapped-tabpanel-info\"]/div/form/div/div[1]/div[1]/div/div["
                                           "6]/div/div/textarea").send_keys("Test description")
        self.driver.find_element(By.NAME, "specialInstructions").send_keys("Special instructions test")
        phone = self.driver.find_element(By.XPATH,
                                         "//*[@id=\"wrapped-tabpanel-info\"]/div/form/div/div[1]/div[1]/div/div["
                                         "8]/div/div/input")
        replace_text(phone, "+1 (516) 888-8888")
        time.sleep(0.25)
        replace_text(phone, "+1 (516) 888-8888")  # running command twice to make sure text is replaced properly
        element = self.driver.find_element(By.NAME, "email")
        replace_text(element, "test2@gmail.com")
        self.driver.find_element(By.XPATH, "//*[@id=\"mui-component-select-status\"]").click()  # Status dropdown
        self.driver.find_element(By.XPATH,"//*[@id=\"menu-status\"]/div[3]/ul/li[1]").click()
        #self.driver.find_element(By.XPATH, "//*[@id=\"menu-status\"]/div[3]/ul/li[1]").click()  # Set to published
        self.driver.find_element(By.XPATH,
                                 "//*[@id=\"select-venueType-async\"]").click()
        self.driver.find_element(By.XPATH,
                                 "//*[@id=\"select-venueType-async-option-0\"]").click()  # Select first type in menu
        self.driver.find_element(By.ID, "new-item-pic").send_keys(self.vars['cwd'] + "\\bg.png")
        self.driver.find_element(By.XPATH, "/html/body/div[3]/div[3]/div/div/div/button[6]").click()  # Save image

        self.driver.find_element(By.XPATH, "//*[@id=\"wrapped-tabpanel-info\"]/div/form/div/div[2]/div/div/div["
                                           "4]/label/span[1]/input").click()  # Set different open/close times per day

        # Set to closed on Saturday/Sunday
        time.sleep(0.5)
        self.driver.find_element(By.XPATH,"//*[@id=\"wrapped-tabpanel-info\"]/div/form/div/div[2]/div/div/div[4]/label").click()
        time.sleep(0.5)
        self.driver.find_element(By.XPATH,"//*[@id=\"wrapped-tabpanel-info\"]/div/form/div/div[2]/div/div/div[4]/label").click()
        for i in range(2, 7): # Edit each open and close time
            open_time = f'06:0{i - 2} AM'
            close_time = f'06:1{i - 2} PM'
            #rowpath = f"/html/body/div[1]/div[2]/div/div[2]/div/div[2]/div[2]/div/form/div/div[3]/div[{i}]/div[1]/"
            #opentime_field = self.driver.find_element(By.XPATH, rowpath + "div[2]/div/div/input")
            #closetime_field = self.driver.find_element(By.XPATH, rowpath + "div[3]/div/div/input")
            opentime_field = self.driver.find_element(By.XPATH,"/html/body/div[1]/div[2]/div/div[2]/div/div[2]/div[2]/div/form/div/div[2]/div/div/div[2]/div/div/input")
            closetime_field = self.driver.find_element(By.XPATH, "/html/body/div[1]/div[2]/div/div[2]/div/div[2]/div[2]/div/form/div/div[2]/div/div/div[3]/div/div/input")
            replace_text(opentime_field, open_time)
            time.sleep(0.25)
            replace_text(closetime_field, close_time)
            time.sleep(0.25)

        self.driver.find_element(By.XPATH,
                                 "//*[@id=\"wrapped-tabpanel-info\"]/div/form/div/div[3]/div/button[3]").click()
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
    
    def test_Superadmin_newvenue(self):
        http_auth = ('rbanala', 'Rdropdesk@123')
        cwd = str(Path('.').cwd())
        self.vars = {'cwd': cwd, 'http_auth': http_auth}
        self.driver = webdriver.Chrome(cwd + '\\chromedriver.exe')
        self.driver.implicitly_wait(10)
        # Create a new venue as a brand admin
        #self._sign_in('DigitalMarketingAdmin', 'DigitalMarketingAdmin1!')
        self._sign_in('Superadmin', 'i3dmD74hl&%FdBrT')
        logged_in = 1
        self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-root").click()  # Log in button
        time.sleep(4)
        self.driver.find_element(By.XPATH, "//*[@id=\"root\"]/section/nav/a[2]").click()  # Spaces page

        self.driver.find_element(By.ID, "new-item-avatar").send_keys(self.vars['cwd'] + "\\logo.png")
        self.driver.find_element(By.XPATH, "/html/body/div[3]/div[3]/div/div/div/button[6]").click()  # Save image
        time.sleep(1)
        self.driver.find_element(By.NAME, "name").send_keys("testvenue")
        add_select = self.driver.find_element(By.XPATH,
                                              "/html/body/div[1]/div[2]/div/div[2]/div/div[2]/div[2]/div/form/div/div["
                                              "1]/div[1]/div/div[2]/div[1]/div/div/input")  # Address box
        add_select.send_keys("1015 Walsh Avenue, Woodmere, NY, USA")
        add_select_mui = add_select.get_attribute('id')
        time.sleep(0.5)
        self.driver.find_element(By.XPATH, f"//*[@id=\"{add_select_mui}-option-0\"]").click()  # Choose first
        # autocomplete

        self.driver.find_element(By.NAME, "address2").send_keys("Suite 100")
        self.driver.find_element(By.XPATH, "//*[@id=\"wrapped-tabpanel-info\"]/div/form/div/div[1]/div[1]/div/div["
                                           "6]/div/div/textarea").send_keys("Test description")
        self.driver.find_element(By.NAME, "specialInstructions").send_keys("Special instructions test")
        phone = self.driver.find_element(By.XPATH,
                                         "//*[@id=\"wrapped-tabpanel-info\"]/div/form/div/div[1]/div[1]/div/div["
                                         "8]/div/div/input")  # Phone textbox
        replace_text(phone, "+1 (516) 555-5555")
        time.sleep(0.25)
        replace_text(phone, "+1 (516) 555-5555")  # running command twice to make sure text is replaced properly
        self.driver.find_element(By.NAME, "email").send_keys("test@gmail.com")
        self.driver.find_element(By.XPATH, "//*[@id=\"mui-component-select-status\"]").click()  # Status dropdown
        self.driver.find_element(By.XPATH, "//*[@id=\"menu-status\"]/div[3]/ul/li[2]").click()  # Set unpublished
        self.driver.find_element(By.ID, "new-item-pic").send_keys(self.vars['cwd'] + "\\bg.png")
        self.driver.find_element(By.XPATH, "/html/body/div[3]/div[3]/div/div/div/button[6]").click()  # Save image
        opentime_field = self.driver.find_element(By.XPATH, "/html/body/div[1]/div[2]/div/div[2]/div/div[2]/div[2]/div/form/div/div[2]/div/div/div[2]/div/div/input")  # Open time box
        replace_text(opentime_field, '06:05 AM')

        closetime_field = self.driver.find_element(By.XPATH, "/html/body/div[1]/div[2]/div/div[2]/div/div[2]/div[2]/div/form/div/div[2]/div/div/div[3]/div/div/input")  # Close time box
        replace_text(closetime_field, '06:15 PM')
        time.sleep(1.5)
        self.driver.find_element(By.XPATH,"//*[@id=\"select-brand-async\"]")  #Open Brand type dropdown

        #self.driver.find_element(By.XPATH,"//*[@id=\"select-brand-async-option-0\"]").click()
        self.driver.find_element(By.XPATH,"//*[@id=\"select-brand-async\"]").send_keys("Bridgeworks",Keys.ENTER)

        self.driver.find_element(By.XPATH,"//*[@id=\"select-venueType-async\"]")  #Open venue type dropdown

        #self.driver.find_element(By.XPATH,"//*[@id=\"select-venueType-async-option-0\"]").click()
        self.driver.find_element(By.XPATH,"//*[@id=\"select-venueType-async\"]").send_keys("Coworking Space",Keys.ENTER)
        
        self.driver.find_element(By.XPATH,"//button[text()='Publish']").click()

        while logged_in:  # Wait for venue to publish and then log out
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

    def test_Superadmin_DeleteVenue(self):
        http_auth = ('rbanala', 'Rdropdesk@123')
        cwd = str(Path('.').cwd())
        self.vars = {'cwd': cwd, 'http_auth': http_auth}
        self.driver = webdriver.Chrome(cwd + '\\chromedriver.exe')
        self.driver.implicitly_wait(10)
        #  Repeating the same steps as the new venue, but locating the newly created "testvenue"/editing the fields
        #self._sign_in('DigitalMarketingAdmin', 'DigitalMarketingAdmin1!')
        self._sign_in('Superadmin', 'i3dmD74hl&%FdBrT')
        logged_in = 1
        venue_name = 'Test Venue_' + str(r.randint(1, 1e6))
        self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-root").click()
        time.sleep(1)
        self.driver.find_element(By.XPATH, "//*[@id=\"root\"]/section/nav/a[2]").click()
        self.driver.find_element(By.XPATH, "/html/body/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div/div/div/div["
                                           "1]/div[1]/div/div/input").send_keys('Test1/14/22')  # Search for "testvenue"
        time.sleep(2)
        self.driver.find_element(By.XPATH,
                                  "//*[@id=\"root\"]/div[2]/div/div[1]/div/div/div[2]/div/div/div/div/div[2]/div/div[1]/div/div/button[1]").click()
                                  # Click on the venue from the search result
        self.driver.find_element(By.XPATH, "//button[text()='Delete venue']").click()
        self.driver.find_element(By.XPATH, "//button[text()='Delete']").click()


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

    
