import requests

barcode = '888849003860'  #place holder where extracted barcode will go from the scanner 
url = f'https://world.openfoodfacts.org/api/v0/product/{barcode}.json' #API endpoint

response = requests.get(url)
data = response.json() #response will be formatted in json format 

#if connection with API is successful and if the food item is within the database then continue 
if data['status'] == 1:
    product = data['product']
    nutrients = product.get('nutriments', {})
    
    product_name = product.get('product_name_en')
    
    # Macronutrient list
    #Grab macronutrient name, value, and unit 
    calories = nutrients.get('energy-kcal_serving')
    carbs = (nutrients.get('carbohydrates_100g'), nutrients.get('carbohydrates_unit'))
    protein = (nutrients.get('proteins_100g'), nutrients.get('proteins_unit'))
    fat = (nutrients.get('fat_100g'), nutrients.get('fat_unit'))
    sodium = (nutrients.get('sodium_100g'), nutrients.get('sodium_unit'))
    saturated_fat = (nutrients.get('saturated-fat_100g'), nutrients.get('saturated-fat_unit'))
    fiber = (nutrients.get('fiber_100g'), nutrients.get('fiber_unit'))

    #Micronutrient list
    #Grab micronutrient name, value, and unit
    vitamin_a = (nutrients.get('vitamin-a_100g'), 'IU')  
    vitamin_c = (nutrients.get('vitamin-c_100g'), 'mg')
    vitamin_d = (nutrients.get('vitamin-d_100g'), 'IU')  
    calcium = (nutrients.get('calcium_100g'), 'mg')
    iron = (nutrients.get('iron_100g'), 'mg')
    potassium = (nutrients.get('potassium_100g'), 'mg')
    zinc = (nutrients.get('zinc_100g'), 'mg') 
    
    print('Product name: ', product_name)
    
    # Print the macronutrients
    print("Macronutrients:")
    for nutrient_name, value in [('Calories', calories), ('Carbs', carbs), ('Protein', protein), ('Fat', fat), ('Sodium', sodium), ('Saturated Fat', saturated_fat), ('Fiber', fiber)]:
        if value is not None:
            print(f"{nutrient_name}: {value}")

    print("\nMicronutrients:")
    for nutrient_name, nutrient_info in [('Vitamin A', vitamin_a), ('Vitamin C', vitamin_c), 
                                         ('Vitamin D', vitamin_d), ('Calcium', calcium), 
                                         ('Iron', iron), ('Potassium', potassium), 
                                         ('Zinc', zinc)]:
        nutrient_value, nutrient_unit = nutrient_info
        if nutrient_value is not None:
            print(f"{nutrient_name}: {nutrient_value} {nutrient_unit if nutrient_unit else ''}")

#if nothing is found then no data will be printed or sent
else:
    print("Product not found.")
