import cv2
from pytesseract import image_to_string

image_path = 'scanned_image.jpg'
image = cv2.imread(image_path)

gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

text = image_to_string(gray_image, lang='eng')

print(text)

cv2.imshow('Image', gray)
cv2.waitKey(0)
cv2.destroyAllWindows()


