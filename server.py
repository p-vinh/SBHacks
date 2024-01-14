import http.server
import socketserver
import os
from http import HTTPStatus
import cgi
import cv2
from pyzbar.pyzbar import decode
import requests
import json
import sys

class ServerHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        print('POST Request recieved')
        if self.path == '/upload':
            form = cgi.FieldStorage(
                fp=self.rfile, 
                headers=self.headers,
                environ={'REQUEST_METHOD': 'POST', 'CONTENT_TYPE': self.headers['Content-Type']}
            )
            
        # Get the file from the form
        file_item = form['file']
        
        # Check if the file has been uploaded
        if file_item.filename:
            # It's assumed here that the uploaded file is an image
            file_data = file_item.file.read()
            file_path = 'uploaded_image.jpg'  # You might want to save it with a unique name or location
            
            with open(file_path, 'wb') as f:
                f.write(file_data)
            
            # Process the image to get the barcode
            barcode_number = BarcodeReader(file_path)
            
            # Now, use the barcode to get the nutrition info
            nutrition_info = get_nutrition_info(barcode_number)
            
            if nutrition_info is not None:
                # Respond with the nutrition info as JSON
                self.send_response(HTTPStatus.OK)
                self.send_header("Content-type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps(nutrition_info).encode())
            else:
                # Handle the case where no product is found
                self.send_response(HTTPStatus.NOT_FOUND)
                self.send_header("Content-type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Product not found'}).encode())
        else:
            self.send_response(HTTPStatus.BAD_REQUEST)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'No file uploaded'}).encode())

def BarcodeReader(image):
    
    barcode_number = ''
    
    # read the image in numpy array using cv2
    img = cv2.imread(image)
    
    # Decode the barcode image
    detectedBarcodes = decode(img)
    
    # If not detected then print the message
    if not detectedBarcodes:
        print("Barcode Not Detected or your barcode is blank/corrupted!")
    
    else:
        # Traverse through all the detected barcodes in image
        for barcode in detectedBarcodes:
            
            # Locate the barcode position in image
            (x, y, w, h) = barcode.rect
            
            # Put the rectangle in image using 
            # cv2 to highlight the barcode
            cv2.rectangle(img, (x-10, y-10),
                          (x + w+10, y + h+10), 
                          (255, 0, 0), 2)
            
            if barcode.data!="":
                
            # Print the barcode data
             #print(barcode.data)
             #print(barcode.type)
             barcode_number = (barcode.data.decode('utf-8'))
    
    return barcode_number

def get_nutrition_info(barcode):
    url = f'https://world.openfoodfacts.org/api/v0/product/{barcode}.json'
    response = requests.get(url)
    data = response.json()

    # Check if the product was found
    if data['status'] == 1:
        product = data['product']
        nutrients = product.get('nutriments', {})
        
        # Extract product name
        product_name = product.get('product_name_en', 'Unknown Product')

        # Extract macronutrients
        macronutrients = {
            'Calories': nutrients.get('energy-kcal_serving', 'Unknown'),
            'Carbs': (nutrients.get('carbohydrates_100g', 'Unknown'), nutrients.get('carbohydrates_unit', '')),
            'Protein': (nutrients.get('proteins_100g', 'Unknown'), nutrients.get('proteins_unit', '')),
            'Fat': (nutrients.get('fat_100g', 'Unknown'), nutrients.get('fat_unit', '')),
            'Sodium': (nutrients.get('sodium_100g', 'Unknown'), nutrients.get('sodium_unit', '')),
            'Saturated Fat': (nutrients.get('saturated-fat_100g', 'Unknown'), nutrients.get('saturated-fat_unit', '')),
            'Fiber': (nutrients.get('fiber_100g', 'Unknown'), nutrients.get('fiber_unit', ''))
        }

        # Extract micronutrients
        micronutrients = {
            'Vitamin A': (nutrients.get('vitamin-a_100g', 'Unknown'), 'IU'),
            'Vitamin C': (nutrients.get('vitamin-c_100g', 'Unknown'), 'mg'),
            'Vitamin D': (nutrients.get('vitamin-d_100g', 'Unknown'), 'IU'),
            'Calcium': (nutrients.get('calcium_100g', 'Unknown'), 'mg'),
            'Iron': (nutrients.get('iron_100g', 'Unknown'), 'mg'),
            'Potassium': (nutrients.get('potassium_100g', 'Unknown'), 'mg'),
            'Zinc': (nutrients.get('zinc_100g', 'Unknown'), 'mg')
        }

        # Create a dictionary to return
        nutrition_info = {
            'product_name': product_name,
            'macronutrients': macronutrients,
            'micronutrients': micronutrients
        }

        return nutrition_info
    else:
        # Return None or an empty dict if product not found
        return None


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Error: No image file path provided.")
        sys.exit(1)
        
    image_path = sys.argv[1]
    barcode = BarcodeReader(image_path)
    if barcode: 
        nutrition_info = get_nutrition_info(barcode)
        if nutrition_info:
            print(json.dumps(nutrition_info))
        else: 
            print(json.dumps({'error': 'Nutrition info not found for the given barcode. '}))
    else: 
        print(json.dumps({'error': 'Barcode not deteced in the image.'}))
    
    
    

