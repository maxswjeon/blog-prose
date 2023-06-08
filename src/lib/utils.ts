export function equals(objA: object, objB: object): boolean {
  if (Object.is(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  return keysA.every((key) => {
    if (!(key in objA) || !(key in objB)) {
      return false;
    }

    const typeKeyA = key as keyof typeof objA;
    const typeKeyB = key as keyof typeof objB;

    return equals(objA[typeKeyA], objB[typeKeyB]);
  });
}
