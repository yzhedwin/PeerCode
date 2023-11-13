from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_question_two_sum_redirect_success():
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

        # Find and click the 'Two Sum' element
        two_sum_element = wait.until(EC.element_to_be_clickable((By.XPATH, "//div[@class='title-div' and text()='Two Sum']")))
        two_sum_element.click()

        # Wait for redirection to /problem
        WebDriverWait(driver, 10).until(EC.url_to_be('http://localhost:3000/problem'))
        assert driver.current_url == 'http://localhost:3000/problem', "Navigation to /problem failed"

    finally:
        driver.quit()

def test_question_next_page_success():
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

        # Find and click the 'Two Sum' element (Purpose to add delay due to dynamic loading of content)
        two_sum_element = wait.until(EC.element_to_be_clickable((By.XPATH, "//div[@class='title-div' and text()='Two Sum']")))

        # Wait for the element and assert its value
        current_page_element = wait.until(EC.presence_of_element_located((By.XPATH, "//span[@ref='lbCurrent']")))
        current_page_number = current_page_element.text

        assert current_page_number == '1', "The current page number is not 1"

        # Find the 'Next Page' element using the class name
        next_page_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//div[@ref='btNext']")))
        next_page_button.click()

        # Wait for the element and assert its value
        current_page_element = wait.until(EC.presence_of_element_located((By.XPATH, "//span[@ref='lbCurrent']")))
        current_page_number = current_page_element.text

        assert current_page_number == '2', "The current page number is not 2"

    finally:
        driver.quit()
