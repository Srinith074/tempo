export default function handler(req, res) {
  const data = req.method === "POST" ? req.body : { skills: [], hours: 10 };

  const market = {
    React: { demand: 85, trend: "rising" },
    Node: { demand: 80, trend: "stable" },
    Python: { demand: 90, trend: "rising" },
    Java: { demand: 70, trend: "declining" },
  };

  function trendMultiplier(trend) {
    return trend === "rising" ? 1.2 : trend === "declining" ? 0.8 : 1;
  }

  function levelWeight(level) {
    return {
      beginner: 1.2,
      intermediate: 1,
      advanced: 0.7,
    }[level];
  }

  const results = data.skills.map((s) => {
    const m = market[s.name] || { demand: 50, trend: "stable" };

    const score =
      m.demand *
      trendMultiplier(m.trend) *
      levelWeight(s.level);

    return { ...s, demand: m.demand, trend: m.trend, score };
  });

  const total = results.reduce((a, b) => a + b.score, 0);

  const output = results.map((r) => ({
    ...r,
    allocation: ((r.score / total) * data.hours).toFixed(1),
    recommendation:
      r.score > 80
        ? "Invest more"
        : r.score < 50
        ? "Reduce focus"
        : "Maintain",
    reason: `Demand ${r.demand} with ${r.trend} trend`,
  }));

  res.status(200).json(output);
}
