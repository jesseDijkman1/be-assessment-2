/* jshint esversion: 6 */

// ----------------------
//     Account.ejs JS
// ----------------------

const accMenuItms = document.getElementsByClassName('acc-menu-itm');

accMenuItms[0].addEventListener('click', () => {
  document.body.classList.add('sec-1');
  document.body.classList.remove('sec-2');
});

accMenuItms[1].addEventListener('click', () => {
  document.body.classList.add('sec-2');
  document.body.classList.remove('sec-1');
});
