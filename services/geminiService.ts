
import { GoogleGenAI, Type } from "@google/genai";
import { QuizResult, Question } from "../types";

// Standard initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIFeedback = async (result: QuizResult, questions: Question[]): Promise<string> => {
  try {
    const maxPossibleScore = result.totalQuestions * 2;
    const prompt = `
      Phân tích kết quả bài thi Sinh học của học sinh:
      Tên: ${result.studentName}
      Số câu đúng: ${result.correctCount}/${result.totalQuestions}
      Tổng điểm đạt được: ${result.score} (Quy tắc: Đúng +2đ, Sai -0.5đ. Điểm tối đa: ${maxPossibleScore})
      
      Chi tiết các câu trả lời:
      ${questions.map((q, idx) => {
        const studentAns = result.answers[q.id];
        const isCorrect = studentAns === q.correctAnswer;
        return `Q${idx + 1}: ${q.question}. Học sinh chọn: ${q.options[studentAns]}, Đáp án đúng: ${q.options[q.correctAnswer]} (${isCorrect ? 'ĐÚNG' : 'SAI'})`;
      }).join('\n')}
      
      Hãy đưa ra lời nhận xét ngắn gọn (3 câu), khích lệ và chỉ ra một chủ đề học sinh cần ôn tập kỹ hơn dựa trên các câu bị sai.
    `;

    // Calling generateContent with model and prompt as required
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Directly access .text property
    return response.text || "Chúc mừng bạn đã hoàn thành bài thi! Hãy tiếp tục cố gắng ở các bài thi tiếp theo nhé.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Nỗ lực tuyệt vời! Kết quả của bạn đã được ghi nhận vào hệ thống.";
  }
};

export const generateQuestions = async (topic: string): Promise<Question[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create 5 challenging multiple choice questions about "${topic}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.INTEGER, description: "Index of the correct answer (0-3)" },
              explanation: { type: Type.STRING }
            },
            required: ["id", "question", "options", "correctAnswer"]
          }
        }
      }
    });

    // Extract text from response and parse as JSON
    const text = response.text;
    if (!text) return [];
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return [];
  }
};
