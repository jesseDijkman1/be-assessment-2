/* jshint esversion: 6 */

const moreIngredients = document.getElementById('more-ingredients');
const ingredientsCont = document.getElementById('ingredients');
const ingredient = document.getElementById('ingredient-template');

let amtIngredients = 1;
const maxIngredients = 5;

if (moreIngredients) {
  moreIngredients.addEventListener('click', addIngredient);
}

function addIngredient() {
  amtIngredients++;

  let newField = ingredient.cloneNode(true);
  newField.classList.add('removeable');
  let removeBtn = newField.children[0];

  removeBtn.addEventListener('click', () => {
    let parent = removeBtn.parentNode;
    parent.parentNode.removeChild(parent);
    if (amtIngredients == maxIngredients) {
      moreIngredients.addEventListener('click', addIngredient);
      moreIngredients.style.opacity = '1';
    }
    amtIngredients--;
  });

  ingredientsCont.appendChild(newField);

  if (amtIngredients == maxIngredients) {
    moreIngredients.removeEventListener('click', addIngredient);
    moreIngredients.style.opacity = '.3';
  }
}


// Add more step fields
const moreSteps = document.getElementById('more-steps');
const stepsCont = document.getElementById('steps');
const step = document.getElementById('step-template');


let amtSteps = 1;
const maxSteps = 5;

if (moreSteps) {
  moreSteps.addEventListener('click', addStep);
}

function addStep() {
  amtSteps++;
  let newField = step.cloneNode(true);
  newField.classList.add('removeable');
  let removeBtn = newField.children[0];
  let stepNr = newField.children[1];
  stepNr.textContent = amtSteps;
  removeBtn.addEventListener('click', () => {
    let parent = removeBtn.parentNode;
    parent.parentNode.removeChild(parent);
    if (amtSteps == maxSteps) {
      moreSteps.addEventListener('click', addStep);
      moreSteps.style.opacity = '1';
    }
    amtSteps--;
  });

  stepsCont.appendChild(newField);

  if (amtSteps == maxSteps) {
    moreSteps.removeEventListener('click', addStep);
    moreSteps.style.opacity = '.3';
  }
}
