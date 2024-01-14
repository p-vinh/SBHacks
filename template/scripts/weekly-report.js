const meals = [
    { name: 'Breakfast', calories: 500 },
    { name: 'Lunch', calories: 700 },
    { name: 'Dinner', calories: 600 },
  ];
  
  const totalCalories = meals.reduce((total, meal) => total + meal.calories, 0);
  const totalMeals = meals.length;
  const avgIntakeCalories = totalCalories / totalMeals;
  
  document.getElementById('total-calories').innerText = totalCalories;
  document.getElementById('total-meals').innerText = totalMeals;
  document.getElementById('avg-intake-calories').innerText = avgIntakeCalories.toFixed(2);