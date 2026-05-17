require("dotenv").config();

const express = require("express");
const app = express();

// import the Genkit and Google AI plugin libraries
const { googleAI } = require("@genkit-ai/googleai");
const { genkit } = require("genkit");

// configure a Genkit instance
const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })],
  model: googleAI.model("gemma-3-27b-it"),
});

const PORT = 3002;

app.get("/", async (req, res) => {
  try {
    const tripRequest =
      req.query.trip || "Make a 20-day trip itinerary from India to Japan";
    
      const itineraryText = await travelItineraryFlow(tripRequest);

      res.type("text/plain").send(itineraryText);
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message || "Failed to generate itinerary",
    });
  }
});

const travelItineraryFlow = ai.defineFlow(
  "travelItineraryFlow",
  async (tripRequest) => {
    const prompt = `Create a simple travel itinerary in plain text.
                                    Use short headings and bullet points.
                                    Keep it easy for students to read.
                                    Include Day-wise plan, local food, and budget tips.
                                    Trip request: ${tripRequest}`;

    const { text } = await ai.generate(prompt);

    if (!text) throw new Error("Failed to generate itinerary text");
    return text;
  },
);

app.listen(PORT, () => console.log("Backend is Running"));