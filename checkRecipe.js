/* jshint esversion: 6 */
/* jshint node: true */



module.exports = (data, cb) => {
  let result = {
    error: null,
    data: {
      r_name: data.recipe_name,
      r_desc: data.recipe_description,
      r_step: data.recipe_step,
      r_costs: data.recipe_costs,
      r_diff: data.recipe_difficulty,
      i_name: data.ingredient_name,
      i_amt: data.ingredient_amount,
      i_unit: data.ingredient_unit
    }
  };

  console.log(result.data.i_unit);
  if (typeof result.data.r_step == 'string') {
    result.data.r_step = [result.data.r_step];
  }

  // Get's rid of empty values in the steps array
  result.data.r_step = result.data.r_step.filter(function(str) {
    return /\S/.test(str);
  });

  if (typeof result.data.i_name == 'string') {
    result.data.i_name = [result.data.i_name];
  }

  result.data.i_name = result.data.i_name.filter(function(str) {
    return /\S/.test(str);
  });

  if (typeof result.data.i_amt == 'string') {
    result.data.i_amt = [result.data.i_amt];
  }

  if (typeof result.data.i_unit == 'string') {
    result.data.i_unit = [result.data.i_unit];
  }

  if (result.data.i_unit == undefined) {
    result.data.i_unit = [false];
  }


  if (!data.recipe_name) {
    console.log('Recipe name missing');
    result.error = 'Missing Recipe Name';

    return cb(result, null);
  }
  if (!data.recipe_description) {
    console.log('Description missing');
    result.error = 'Missing Recipe Description';
    return cb(result, null);
  }
  if (!data.ingredient_name) {
    console.log('Ingredient name missing');
    result.error = 'Missing Ingredient';
    return cb(result, null);
  }
  // Or ingredient.amount.length == ingredient_name.length
  if (!data.ingredient_amount) {
    console.log('Ingredient amount missing');
    result.error = 'Missing Ingredient Amount';
    return cb(result, null);
  }
  if (!data.ingredient_unit) {
    console.log('Ingredient unit missing');
    result.error = 'Missing Ingredient Unit';
    return cb(result, null);
  }
  if (!data.recipe_costs) {
    console.log('Costs are missing');
    result.error = 'Missing Recipe Costs';
    return cb(result, null);
  }
  if (!data.recipe_difficulty) {
    console.log('Diffulty is missing');
    result.error = 'Missing Recipe Difficulty';
    return cb(result, null);
  }

  return cb(null, result.data);
};
