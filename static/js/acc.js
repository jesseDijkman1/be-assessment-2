/* jshint esversion: 6 */

const accMenuItms = document.getElementsByClassName('acc-menu-itm');
const likedRecipes = document.querySelectorAll('#acc-container section:last-of-type article .liked');

if (accMenuItms[0]) {
  accMenuItms[0].addEventListener('click', () => {
    window.scrollTo(0, 0);
    document.body.classList.add('sec-1');
    document.body.classList.remove('sec-2');
  });
}
if (accMenuItms[1]) {
  accMenuItms[1].addEventListener('click', () => {
    window.scrollTo(0, 0);
    document.body.classList.add('sec-2');
    document.body.classList.remove('sec-1');
  });
}


(function() {
  for (let i = 0; i < likedRecipes.length; i++) {
    likedRecipes[i].addEventListener('click', () => {
      likedRecipes[i].classList.toggle('liked');
    });
  }
})();
