/**
 * Rule engine per assignment:
 * - Role relevance: decision maker (+20), influencer (+10), else 0
 * - Industry match: exact ICP (+20), adjacent (+10), else 0
 * - Data completeness: all fields present (+10)
 * Max rule score = 50
 */

export const calculateRuleScore = (lead, offer) => {
  let score = 0;

  const role = (lead.role || '').toLowerCase();

  // Role relevance
  if (/\b(head|chief|director|founder|ceo|co-founder|owner)\b/i.test(role)) score += 20;
  else if (/\b(manager|lead|vp|vice president|principal|influencer)\b/i.test(role)) score += 10;

  // Industry match
  const industry = (lead.industry || '').toLowerCase();
  const icps = (offer.ideal_use_cases || []).map(i => (i || '').toLowerCase());

  const exactMatch = icps.some(icp => industry === icp || industry.includes(icp) || icp.includes(industry));
  if (exactMatch) score += 20;
  else {
    // adjacent: share keyword root
    const adjacent = icps.some(icp => {
      if (!industry || !icp) return false;
      const a = industry.split(' ')[0];
      const b = icp.split(' ')[0];
      return a && b && (a === b || a.includes(b) || b.includes(a));
    });
    if (adjacent) score += 10;
  }

  // Data completeness
  const required = ['name','role','company','industry','location','linkedin_bio'];
  const allFilled = required.every(k => lead[k] && (lead[k]+'').trim() !== '');
  if (allFilled) score += 10;

  if (score > 50) score = 50;
  return score;
};
