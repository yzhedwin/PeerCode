from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_qotd_success():
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

        # QOTD Button Click
        qotd_button = wait.until(EC.element_to_be_clickable((By.CLASS_NAME, 'MuiButton-containedQuestion_OTD')))
        qotd_button.click()

        #TODO (Update behavior if there are any redirections in the future)

    finally:
        driver.quit()
