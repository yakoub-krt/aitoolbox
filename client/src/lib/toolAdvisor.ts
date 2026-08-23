export type AdvisorTool = { id: number; name: string; slug: string; category: "writing" | "images" | "video" | "productivity" | "research"; priceModel: "free" | "freemium" | "paid"; arabicSupport: "yes" | "partial" | "unknown"; bestFor: string; shortDescription: string; websiteUrl: string };
export type AdvisorPreferences = { goal: AdvisorTool["category"]; budget: "free" | "flexible"; arabic: "required" | "preferred" | "any" };

export function explainRecommendation(tool: AdvisorTool, preferences: AdvisorPreferences) {
  const reasons: string[] = [];
  if (tool.category === preferences.goal) reasons.push("يناسب الهدف الذي اخترته");
  if (preferences.budget === "free" && (tool.priceModel === "free" || tool.priceModel === "freemium")) reasons.push("يتضمن خياراً مجانياً أو خطة بداية");
  if (preferences.arabic === "required" && tool.arabicSupport === "yes") reasons.push("مدرج بدعم العربية في الدليل");
  else if (preferences.arabic === "preferred" && tool.arabicSupport !== "unknown") reasons.push("يناسب تفضيلك للغة العربية بدرجات مختلفة");
  if (!reasons.length) reasons.push("خيار قريب من تفضيلاتك؛ راجع تفاصيله قبل البدء");
  return reasons;
}

export function recommendTools(tools: AdvisorTool[], preferences: AdvisorPreferences) {
  return [...tools].map(tool => {
    let score = 0;
    if (tool.category === preferences.goal) score += 10;
    if (preferences.budget === "free") score += tool.priceModel === "free" ? 4 : tool.priceModel === "freemium" ? 3 : 0;
    else score += tool.priceModel === "freemium" ? 2 : 1;
    if (preferences.arabic === "required") score += tool.arabicSupport === "yes" ? 4 : tool.arabicSupport === "partial" ? 1 : 0;
    if (preferences.arabic === "preferred") score += tool.arabicSupport === "yes" ? 2 : tool.arabicSupport === "partial" ? 1 : 0;
    return { tool, score, reasons: explainRecommendation(tool, preferences) };
  }).sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name)).slice(0, 3);
}
