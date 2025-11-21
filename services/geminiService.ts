import { GoogleGenAI } from "@google/genai";
import { Course } from "../types";

// Initialize Gemini Client
// NOTE: We assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCourseSyllabus = async (title: string, category: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are an expert curriculum designer.
      Create a concise but attractive course description (max 50 words) and a 4-week high-level syllabus (bullet points) for a course titled "${title}" in the category of "${category}".
      Format the output as a simple text block with the description first, followed by "---" and then the syllabus.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Course details could not be generated at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate syllabus. Please try again manually.";
  }
};

export const getAIChatResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  availableCourses: Course[]
): Promise<string> => {
  try {
    const courseContext = availableCourses.map(c =>
      `ID: ${c.id}, Code: ${c.code}, Title: ${c.title}, Instructor: ${c.instructorName}, Schedule: ${c.schedule}, Seats: ${c.capacity - c.enrolledIds.length}`
    ).join('\n');

    const systemInstruction = `
      You are "CourseBot", a helpful academic advisor for the CourseConnect platform.
      Your goal is to help students choose courses and answer questions about the schedule.
      
      Here is the current list of available courses:
      ${courseContext}

      Rules:
      1. Be friendly and concise.
      2. If a student asks for recommendations, ask about their interests first if not provided.
      3. Only recommend courses from the list provided.
      4. If a course is full (Seats <= 0), mention that.
    `;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I'm sorry, I didn't catch that.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm having trouble connecting to the server right now.";
  }
};