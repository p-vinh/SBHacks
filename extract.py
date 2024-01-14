import cv2
from pytesseract import image_to_string

import pytesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'


image_path = 'scanned_image.jpg'
image = cv2.imread(image_path)

gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

text = image_to_string(gray_image, lang='eng')

print(text)

cv2.imshow('Image', gray_image)
cv2.waitKey(0)
cv2.destroyAllWindows()
