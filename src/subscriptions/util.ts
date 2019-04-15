function intersection(arr1: Array<string | number>, arr2: Array<string | number>): Array<string | number> {
  return arr1.filter(value => arr2.indexOf(value) !== -1);
}

export { intersection };
