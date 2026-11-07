export function generatePassword(length = 10) {
  if (length < 2) throw new Error("Length must be at least 2");
    
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const allChars = letters + numbers;
    
    let result = [];
    
    // Guarantee at least 1 letter and 1 number
    result.push(letters[Math.floor(Math.random() * letters.length)]);
    result.push(numbers[Math.floor(Math.random() * numbers.length)]);
    
    // Fill remaining slots with random characters
    for (let i = 2; i < length; i++) {
        result.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }
    
    // Shuffle using Fisher-Yates algorithm
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    
    return result.join('');
}

export const generateRandomString = (length) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ9512368740";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};
