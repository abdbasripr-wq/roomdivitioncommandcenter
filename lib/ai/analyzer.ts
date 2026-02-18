import { AnalyticsMetrics } from '@/lib/analytics/engine';

export interface AIAnalysis {
  executiveSummary: string;
  keyInsights: string[];
  risks: string[];
  opportunities: string[];
  recommendedActions: string[];
}

/**
 * Generate mock AI analysis (default when no API configured)
 */
export function generateMockAnalysis(metrics: AnalyticsMetrics): AIAnalysis {
  const occupancyRate = metrics.occupancy.rate.toFixed(1);
  const revenue = metrics.revenue.total.toFixed(0);
  const adr = metrics.adr.toFixed(0);

  return {
    executiveSummary: `Current hotel performance shows an occupancy rate of ${occupancyRate}% with total revenue of $${revenue}. The average daily rate (ADR) is $${adr}. Market is primarily driven by ${Object.entries(metrics.marketSegment).sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown'} segment.`,
    
    keyInsights: [
      `Occupancy rate is ${occupancyRate}%${Number(occupancyRate) > 70 ? ', indicating strong demand' : ', suggesting opportunities for optimization'}`,
      `Room revenue breakdown shows highest performance in ${Object.entries(metrics.roomTypePerformance).sort((a, b) => b[1].revenue - a[1].revenue)[0]?.[0] || 'standard'} rooms`,
      `Market segment analysis reveals ${Object.entries(metrics.marketSegment).length} distinct guest segments`,
      `Average daily rate of $${adr} is ${Number(adr) > 150 ? 'competitive' : 'moderate'} for the market`,
    ],
    
    risks: [
      Number(occupancyRate) < 50 ? 'Low occupancy rate may impact revenue targets' : 'Monitor for seasonal fluctuations',
      'Competition from nearby properties may pressure rates',
      'Guest satisfaction dependency on housekeeping performance',
    ],
    
    opportunities: [
      `Increase ADR through ${Number(occupancyRate) > 80 ? 'premium positioning' : 'targeted marketing'}`,
      'Expand loyalty program to capture repeat business',
      'Develop package deals for low-demand periods',
      'Implement dynamic pricing strategy',
    ],
    
    recommendedActions: [
      `${Number(occupancyRate) > 80 ? 'Increase rates and focus on high-value segments' : 'Launch targeted campaigns to boost occupancy'}`,
      'Monitor competitor pricing weekly',
      'Enhance guest experience in high-revenue periods',
      'Implement predictive analytics for demand forecasting',
    ],
  };
}

/**
 * Call real AI API (OpenAI)
 */
export async function callAIAPI(
  metrics: AnalyticsMetrics,
  apiKey: string
): Promise<AIAnalysis> {
  try {
    const prompt = `
You are a hotel analytics expert. Analyze the following hotel performance metrics and provide actionable insights.

Metrics:
- Occupancy Rate: ${metrics.occupancy.rate.toFixed(1)}%
- Total Revenue: $${metrics.revenue.total.toFixed(0)}
- Average Daily Rate: $${metrics.adr.toFixed(0)}
- RevPAR: $${metrics.revpar.toFixed(0)}
- Guest Count: ${metrics.guests.total}

Market Segments: ${Object.entries(metrics.marketSegment).map(([k, v]) => `${k}: ${v}`).join(', ')}

Room Type Performance: ${Object.entries(metrics.roomTypePerformance).map(([k, v]) => `${k}: $${v.revenue} revenue, ${v.occupancy} rooms`).join(', ')}

Provide a JSON response with the following structure:
{
  "executiveSummary": "string",
  "keyInsights": ["string"],
  "risks": ["string"],
  "opportunities": ["string"],
  "recommendedActions": ["string"]
}
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);

    return parsed as AIAnalysis;
  } catch (error) {
    console.error('[AI] API call failed:', error);
    // Fallback to mock analysis
    return generateMockAnalysis(metrics);
  }
}

/**
 * Get AI analysis (uses configured provider)
 */
export async function getAIAnalysis(metrics: AnalyticsMetrics): Promise<AIAnalysis> {
  const provider = process.env.NEXT_PUBLIC_AI_PROVIDER || 'mock';
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  if (provider === 'openai' && apiKey) {
    return callAIAPI(metrics, apiKey);
  }

  return generateMockAnalysis(metrics);
}
