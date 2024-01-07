const { GoogleGenerativeAI } = require("@google/generative-ai");
const fetch = require("node-fetch");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyDtTyPWO56Ml8tzhxxJfALz3JtW3Ev0348");

// Converts local file information to a GoogleGenerativeAI.Part object.
async function fileToGenerativePart(imageUrl, mimeType) {
  const res = await fetch(imageUrl);
  const blob = await res.blob();
  const arrayBuffer = await blob.arrayBuffer();
  return {
    inlineData: {
      data: Buffer.from(arrayBuffer).toString("base64"),
      mimeType,
    },
  };
}

async function run(imageUrl) {
  // For text-and-image input (multimodal), use the gemini-pro-vision model
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  const prompt =
    "What are the approximate dimensions of this bed? Give single word answer in format LxWxH inches";

  const imageParts = [await fileToGenerativePart(imageUrl, "image/jpeg")];

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();
  return text;
}

module.exports = run;
