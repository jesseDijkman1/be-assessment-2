/* jshint esversion: 6 */

const filterBtn = document.getElementById('filter-btn');
const filter = document.getElementById('filter-container');

filterBtn.addEventListener('click', () => {
  filter.classList.toggle('hidden');
});
