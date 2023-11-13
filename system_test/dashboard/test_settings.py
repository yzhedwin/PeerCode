from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_settings_dropdown_success():
    driver = webdriver.Chrome()
    driver.get('http://localhost:3000/login')
    wait = WebDriverWait(driver, 10)
    try:
        # Login
        email = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='email']")))
        password = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='password']")))
        login_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[@type='submit']")))

        email.send_keys('test@test.com')
        password.send_keys('tester')
        login_button.click()

        # Wait for the next page to load after login
        WebDriverWait(driver, 10).until(EC.url_to_be('http://localhost:3000/'))
        assert driver.current_url == 'http://localhost:3000/', "Login failed"

        # Find the dropdown menu
        dropdown_button = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[@aria-label="Open settings"]')))
        dropdown_button.click()

    finally:
        driver.quit()

def test_settings_profile_success():
    driver = webdriver.Chrome()
    driver.get('http://localhost:3000/login')
    wait = WebDriverWait(driver, 10)
    try:
        # Login
        email = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='email']")))
        password = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='password']")))
        login_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[@type='submit']")))

        email.send_keys('test@test.com')
        password.send_keys('tester')
        login_button.click()

        # Wait for the next page to load after login
        WebDriverWait(driver, 10).until(EC.url_to_be('http://localhost:3000/'))
        assert driver.current_url == 'http://localhost:3000/', "Login failed"

        # Find the dropdown menu
        dropdown_button = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[@aria-label="Open settings"]')))
        dropdown_button.click()

        # Wait for 'Profile' item within the dropdown to be clickable and click on it
        profile_item = wait.until(EC.element_to_be_clickable((By.XPATH, '//li[.//p[text()="Profile"]]')))
        profile_item.click()
        
        WebDriverWait(driver, 10).until(EC.url_to_be('http://localhost:3000/profile'))
        assert driver.current_url == 'http://localhost:3000/profile', "Navigation to /profile failed"

    finally:
        driver.quit()

def test_settings_get_question_success():
    driver = webdriver.Chrome()
    driver.get('http://localhost:3000/login')
    wait = WebDriverWait(driver, 10)
    try:
        # Login
        email = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='email']")))
        password = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='password']")))
        login_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[@type='submit']")))

        email.send_keys('test@test.com')
        password.send_keys('tester')
        login_button.click()

        # Wait for the next page to load after login
        WebDriverWait(driver, 10).until(EC.url_to_be('http://localhost:3000/'))
        assert driver.current_url == 'http://localhost:3000/', "Login failed"

        # Find the dropdown menu
        dropdown_button = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[@aria-label="Open settings"]')))
        dropdown_button.click()

        # Wait for 'Profile' item within the dropdown to be clickable and click on it
        get_question_item = wait.until(EC.element_to_be_clickable((By.XPATH, '//li[.//p[text()="Get Question"]]')))
        get_question_item.click()

        # Wait for the Snackbar message to appear
        snackbar = wait.until(EC.visibility_of_element_located((By.XPATH, "//div[@class='MuiSnackbar-root MuiSnackbar-anchorOriginTopCenter css-zzms1-MuiSnackbar-root']")))
        snackbar_text = wait.until(EC.visibility_of_element_located((By.CLASS_NAME, 'MuiAlert-message')))
        
        assert snackbar_text.text == 'Retrieve question from Leetcode', "Get Question failed"

    finally:
        driver.quit()


def test_settings_logout_success():
    driver = webdriver.Chrome()
    driver.get('http://localhost:3000/login')
    wait = WebDriverWait(driver, 10)
    try:
        # Login
        email = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='email']")))
        password = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='password']")))
        login_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[@type='submit']")))

        email.send_keys('test@test.com')
        password.send_keys('tester')
        login_button.click()

        # Wait for the next page to load after login
        WebDriverWait(driver, 10).until(EC.url_to_be('http://localhost:3000/'))
        assert driver.current_url == 'http://localhost:3000/', "Login failed"

        # Find the dropdown menu
        dropdown_button = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[@aria-label="Open settings"]')))
        dropdown_button.click()

        # Wait for 'Logout' item within the dropdown to be clickable and click on it
        logout_item = wait.until(EC.element_to_be_clickable((By.XPATH, '//li[.//p[text()="Logout"]]')))
        logout_item.click()

        WebDriverWait(driver, 10).until(EC.url_to_be('http://localhost:3000/login'))
        assert driver.current_url == 'http://localhost:3000/login', "Logout failed"

    finally:
        driver.quit()
