from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

driver = webdriver.Chrome()
form_url = "https://www.cognitoforms.com/magnumsoftwareservices"  
driver.get(form_url)

time.sleep(3)

try:
    name_field = driver.find_element(By.NAME, "Name") 
    name_field.send_keys("John Doe")

    email_field = driver.find_element(By.NAME, "Email")
    email_field.send_keys("john.doe@example.com")

    phone_field = driver.find_element(By.NAME, "Phone") 
    phone_field.send_keys("1234567890")

    message_field = driver.find_element(By.NAME, "Message")  
    message_field.send_keys("This is a test message.")

    submit_button = driver.find_element(By.XPATH, "//button[contains(text(),'Submit')]")
    submit_button.click()

    time.sleep(5)

    success_message = driver.find_element(By.CLASS_NAME, "cognito-confirmation-message")
    assert "Thank you" in success_message.text, "Form submission failed!"

    print("success")
    
except Exception as e:
    print(f"fail, error: {e}")

driver.quit()
