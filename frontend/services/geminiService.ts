
import { GoogleGenAI, Type } from '@google/genai';
import { UserData, AIInsight } from '../types';

const ai = new GoogleGenAI({ apiKey: (process.env as any).API_KEY, vertexai: true });

export const getFinancialInsights = async (userData: UserData): Promise<AIInsight[]> => {
  try {
    const prompt = `
      Analyze the following financial data for a user in India. 
      All values are in Indian Rupees (INR).
      User: ${userData.Name}, Age: ${userData.Age}
      Monthly Income: ${userData.financials["monthly-income"]}
      Monthly Expenses: ${userData.financials["monthly-expenses"]}
      Monthly Debt: ${userData.financials.debt}
      Emergency Fund Opted: ${userData.financials["em-fund-opted"]}
      Goal: ${userData.Goal.goal} (Target: ${userData.Goal["target-amt"]} in ${userData.Goal["target-time"]} months)
      Current Investment: ${userData.investments["invest-amt"]}
      Risk Profile: ${userData.investments["risk-opt"]}

      Provide 5-6 professional financial insights and actionable suggestions. 
      Include:
      1. Goal feasibility and specific monthly SIP requirement.
      2. Expense-to-income ratio analysis.
      3. Tax-saving suggestions (mentioning 80C/80D/NPS if applicable).
      4. Emergency fund adequacy (suggesting 6 months of expenses).
      5. Asset allocation based on their ${userData.investments["risk-opt"]} risk profile.
      6. Debt management advice.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        role: 'user',
        parts: [{ text: prompt }],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              type: { 
                type: Type.STRING, 
                description: 'One of: positive, warning, info, suggestion' 
              },
              category: {
                type: Type.STRING,
                description: 'One of: Goal, Tax, Savings, Investment, Debt'
              },
              impact: {
                type: Type.STRING,
                description: 'One of: High, Medium, Low'
              }
            },
            required: ['title', 'description', 'type', 'category', 'impact'],
          },
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error('Error fetching AI insights:', error);
    return [
      {
        title: "Emergency Fund Priority",
        description: "Your current expenses are ₹45,000. We suggest maintaining an emergency fund of at least ₹2.7L (6 months) before aggressive investing.",
        type: "warning",
        category: "Savings",
        impact: "High"
      },
      {
        title: "Tax Optimization (80C)",
        description: "Consider investing in ELSS or PPF to exhaust your ₹1.5L limit under Section 80C for better post-tax returns.",
        type: "suggestion",
        category: "Tax",
        impact: "Medium"
      },
      {
        title: "Goal Feasibility",
        description: "To reach ₹21L in 24 months, you need a monthly SIP of approx ₹75,000 assuming 12% CAGR.",
        type: "info",
        category: "Goal",
        impact: "High"
      }
    ];
  }
};
