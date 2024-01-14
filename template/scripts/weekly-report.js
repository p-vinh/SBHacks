
  
  const totalCalories = data.current.calories;
  const totalMeals = data.meals.length;
  const avgIntakeCalories = totalCalories / totalMeals;
  
  document.getElementById('total-calories').innerText = totalCalories;
  document.getElementById('total-meals').innerText = totalMeals;
  document.getElementById('avg-intake-calories').innerText = avgIntakeCalories.toFixed(2);