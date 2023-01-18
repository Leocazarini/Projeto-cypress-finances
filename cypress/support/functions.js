export const format = (value) => {
  let numValue;

  numValue = value.replace(",", ".");
  numValue = Number(numValue.split("$")[1].trim());
  numValue = String(value).includes("-") ? -numValue : numValue;
  return numValue;
};
