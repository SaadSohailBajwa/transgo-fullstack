const { GoogleGenerativeAI } = require("@google/generative-ai");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyBRdPLg-18gf9UR-x4IqrVrdzQ1wQfkK0w");

// Converts local file information to a GoogleGenerativeAI.Part object.
async function fileToGenerativePart(imageUrl, mimeType) {
  const res = await axios.get(imageUrl);
  const blob = await res.blob();
  const arrayBuffer = await blob.arrayBuffer();
  return {
    inlineData: {
      data: Buffer.from(arrayBuffer).toString("base64"),
      mimeType,
    },
  };
}












const cleanAndParseJson = (str) => {
  // Step 1: Remove anything before and after the JSON object
  const jsonStartIndex = str.indexOf("{");
  const jsonEndIndex = str.lastIndexOf("}");

  if (
    jsonStartIndex === -1 ||
    jsonEndIndex === -1 ||
    jsonStartIndex > jsonEndIndex
  ) {
    // Invalid JSON format
    return null;
  }

  const cleanedJsonString = str.substring(jsonStartIndex, jsonEndIndex + 1);

  // Step 2: Parse the cleaned JSON string
  try {
    const jsonObject = JSON.parse(cleanedJsonString);
    return jsonObject;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
};

// Example usage:
// const responseString =
//   "{dimensions: {length: 3.5, width: 3.5, height: 7},weight: 0.4}";
// const jsonObject = cleanAndParseJson(responseString);

// if (jsonObject) {
//   console.log("Parsed JSON:", jsonObject);
// } else {
//   console.log("Invalid JSON format.");
// }


























async function run(imageUrl) {
  // For text-and-image input (multimodal), use the gemini-pro-vision model
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  const prompt =
    "What are the approximate dimensions and weight of the object in the center of this image? Give answer as JSON string and only the JSON which i can parse in nodejs and use it in my code. dimensions in inches and weight in kilograms. the answer should be exactly this format and do not include anything else in the response: {dimensions: {length:,width:,height:},weight: ";

  const imageParts = [await fileToGenerativePart(imageUrl, "image/jpeg")];

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();
  console.log(cleanAndParseJson(text));
  return text;
}

module.exports = run;
