import { calculateRuleScore } from '../src/services/ruleEngine.service.js';

test('Head role + matching industry + complete fields gives 50', () => {
  const lead = {
    name: 'Ava Patel',
    role: 'Head of Growth',
    company: 'FlowMetrics',
    industry: 'B2B SaaS mid-market',
    location: 'Mumbai',
    linkedin_bio: 'Growth leader'
  };
  const offer = { ideal_use_cases: ['B2B SaaS mid-market'] };
  const score = calculateRuleScore(lead, offer);
  expect(score).toBe(50);
});
