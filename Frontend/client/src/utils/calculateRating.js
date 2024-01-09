export const calculateRating = (inputString) => {
  if(!inputString){
    return 
  }
  const parts = inputString.split("-");
  const numerator = parseInt(parts[0], 10);
  const denominator = parseInt(parts[1], 10);

  if (denominator !== 0) {
    const result = (numerator / denominator).toFixed(1); // Limit to one decimal place
    return result;
  } else {
    console.log("Invalid denominator:", denominator);
    return null;
  }
};
