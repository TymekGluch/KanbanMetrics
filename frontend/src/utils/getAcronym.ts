export function getAcronym(name: string) {
  const words = name.split(" ");
  const acronym = words.map((word) => word[0].toUpperCase()).join("");

  return acronym;
}
