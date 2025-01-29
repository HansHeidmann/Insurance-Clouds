from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

driver = webdriver.Chrome()

driver.get("http://localhost:3000/login")

email_input = driver.find_element(By.NAME, "email")
password_input = driver.find_element(By.NAME, "password")
login_button = driver.find_element(By.XPATH, "//button[contains(text(),'Login')]")

email_input.send_keys("test@gmail.com")
password_input.send_keys("Test123")
login_button.click()


time.sleep(3)
assert "Dashboard" in driver.title, "fail"

print("Pass")

driver.quit()