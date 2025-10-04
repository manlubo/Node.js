export function lengthOfList(list = []) {
  return list.length;
}

export function eq(val1, val2) {
  return val1 === val2;
}

export function dateString (isoString) {
  return new Date(isoString).toLocaleDateString()
}