
import { GoogleGenAI } from "@google/genai";
import { LogEntry } from "../types";

export const getHealthInsights = async (entries: LogEntry[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const historyString = entries.slice(-10).map(e => 
    `日期: ${e.date}, 量: ${e.volume}, 颜色: ${e.color}, 质地: ${e.texture}, 症状: ${e.symptoms?.join(',') || '无'}, 心情: ${e.moods?.join(',') || '无'}, 疼痛: ${e.painLevel}`
  ).join('\n');

  const latest = entries[entries.length - 1];

  const prompt = `
    你现在是 My Menstruation 应用里的暖心守护者——一个穿着粉色羽绒服、戴着毛茸茸白帽子、懂事又温柔的“贴心姐妹”形象。
    请根据以下月经记录，以一个贴心闺蜜的口吻提供简短、极具治愈感的健康建议。
    应用整体采用粉、蓝、绿的清新配色，氛围软萌且温馨。

    ${historyString}

    要求：
    1. 语气：像亲密无间的闺蜜在耳边轻声细语。多用关心和鼓励的词汇（如：宝贝、抱抱、咱们、乖哦）。
    2. 内容：关注颜色、质地、症状和心情。如果最新记录显示有不适（${latest?.symptoms?.join(',') || '无'}）或者心情不好（${latest?.moods?.join(',') || '无'}），一定要给予最温暖的安抚。
    3. 建议：提供非常具体的“保暖”和“爱自己”的建议（如：一定要穿厚袜子、喝温热的燕麦奶、用热水袋敷敷小肚子）。
    4. 字数：150字以内，使用中文回复。

    在这个充满粉蓝绿色彩的小天地里，让主人感受到被极致宠爱的感觉。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "哎呀，信号好像断掉了，但我一直都在你身边呢。记得多喝热水，穿暖和一点，乖乖休息哦！";
  }
};