function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomDataId(numberOfClassesByCategory: number[], forbiddenBuildDataIds: string[]) {
  let randomBuildDataId: string;

  do {
    let indexStart = 0;
    const randomDataIdArray: number[] = [];

    numberOfClassesByCategory.forEach((numberOfElements) => {
      randomDataIdArray.push(getRandomInt(indexStart, indexStart + numberOfElements - 1));
      indexStart += numberOfElements;
    });

    randomBuildDataId = randomDataIdArray.join("-");
  } while (forbiddenBuildDataIds.includes(randomBuildDataId));

  return randomBuildDataId;
}
