
const arrayEqual = (arr1, arr2) => {

  if (arr1.length !== arr2.length) return false

  let difference = arr1.filter(x => arr2.includes(x));

  return difference.length === arr1.length
}



module.exports = {
  arrayEqual
}