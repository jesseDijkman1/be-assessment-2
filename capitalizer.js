/* jshint esversion: 6 */
/* jshint node: true */

module.exports = (val) => {
  let temp = val.split('');
  temp[0] = temp[0].toUpperCase();
  temp = temp.join('');
  return temp;
};
