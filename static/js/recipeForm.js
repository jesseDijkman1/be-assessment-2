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

  newField.children[1].value = null;
  newField.children[2].value = null;

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
const steps = document.getElementsByClassName('step');

let amtSteps = steps.length;
const maxSteps = 5;
console.log(amtSteps)
if (moreSteps) {
  moreSteps.addEventListener('click', addStep);
}

function addStep() {
  amtSteps++;

  let newField = step.cloneNode(true);

  newField.classList.add('removeable');

  let removeBtn = newField.children[0];

  newField.children[1].textContent = amtSteps;

  newField.children[2].value = null;

  removeBtn.addEventListener('click', () => {

    let parent = removeBtn.parentNode;

    parent.parentNode.removeChild(parent);

    amtSteps--;

    if (amtSteps < maxSteps) {

      moreSteps.addEventListener('click', addStep);

      moreSteps.style.opacity = '1';
    }

  });

  stepsCont.appendChild(newField);

  if (amtSteps == maxSteps) {

    moreSteps.removeEventListener('click', addStep);

    moreSteps.style.opacity = '.3';
  }

}

if (amtSteps == maxSteps) {

  moreSteps.removeEventListener('click', addStep);

  moreSteps.style.opacity = '.3';
}

var test = document.querySelectorAll('.removeable > span');

function test1() {

  for (let i = 0; i < test.length; i++) {

    test[i].addEventListener('click', () => {

      test[i].parentNode.parentNode.removeChild(test[i].parentNode);

      amtSteps--;

      if (amtSteps < maxSteps) {

        moreSteps.addEventListener('click', addStep);

        moreSteps.style.opacity = '1';
      }
    })
  }
}

test1();
