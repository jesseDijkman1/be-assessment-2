/* jshint esversion: 6 */


// -------------------
//     List.ejs JS
// -------------------

const radioButtons = document.querySelectorAll('#sorting input[type="radio"]');
const likeButtons = document.querySelectorAll('#recipe-list article footer ul li form button');
const sortButton = document.getElementById('sort-btn');
const sortingForm = document.getElementById('sorting');

sortButton.addEventListener('click', (ev) => {
  sortingForm.classList.toggle('hidden');
});

(function() {
  for (let i = 0; i < radioButtons.length; i++) {
    radioButtons[i].addEventListener('click', () => {

      for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked == true) {
          radioButtons[i].parentElement.classList.add('check');
        } else {
          radioButtons[i].parentElement.classList.remove('check');
        }
      }
    });
  }
})();

(function() {
  for (let i = 0; i < likeButtons.length; i++) {
    likeButtons[i].addEventListener('click', () => {
      likeButtons[i].classList.toggle('liked');
    });
  }
})();
