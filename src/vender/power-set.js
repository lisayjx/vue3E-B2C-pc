/**
 * 算法库
 * js算法库 https://github.com/trekhleb/javascript-algorithms
 * 幂集算法 https://raw.githubusercontent.com/trekhleb/javascript-algorithms/master/src/algorithms/sets/power-set/bwPowerSet.js
 * 幂集算法
 * 把数组传进来就能得到子集
 * 这个代码风格 后面有;如果不去配置.eslintgnore里的/src/vender 就会报错
 * @param {*[]} originalSet
 * @return {*[][]}
 */
export default function bwPowerSet(originalSet) {
    const subSets = [];
  
    // We will have 2^n possible combinations (where n is a length of original set).
    // It is because for every element of original set we will decide whether to include
    // it or not (2 options for each set element).
    const numberOfCombinations = 2 ** originalSet.length;
  
    // Each number in binary representation in a range from 0 to 2^n does exactly what we need:
    // it shows by its bits (0 or 1) whether to include related element from the set or not.
    // For example, for the set {1, 2, 3} the binary number of 0b010 would mean that we need to
    // include only "2" to the current set.
    for (let combinationIndex = 0; combinationIndex < numberOfCombinations; combinationIndex += 1) {
      const subSet = [];
  
      for (let setElementIndex = 0; setElementIndex < originalSet.length; setElementIndex += 1) {
        // Decide whether we need to include current element into the subset or not.
        if (combinationIndex & (1 << setElementIndex)) {
          subSet.push(originalSet[setElementIndex]);
        }
      }
  
      // Add current subset to the list of all subsets.
      subSets.push(subSet);
    }
  
    return subSets;
  }