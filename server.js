const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Fake DB
let profile = { skills: [], hours: 10 };

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
  return { beginner: 1.2, intermediate: 1, advanced: 0.7 }[level];
}

function analyze(data) {
  const results = data.skills.map(s => {
    const m = market[s.name] || { demand: 50, trend: "stable" };

    const score =
      m.demand *
      trendMultiplier(m.trend) *
      levelWeight(s.level);

    return { ...s, demand: m.demand, trend: m.trend, score };
  });

  const total = results.reduce((a, b) => a + b.score, 0);

  return results.map(r => ({
    ...r,
    allocation: ((r.score / total) * data.hours).toFixed(1),
    recommendation:
      r.score > 80 ? "Invest more" :
      r.score < 50 ? "Reduce focus" : "Maintain"
  }));
}

// API
app.post("/save", (req, res) => {
  profile = req.body;
  res.send({ ok: true });
});

app.get("/analyze", (req, res) => {
  res.send(analyze(profile));
});

app.listen(4000, () => console.log("Running on 4000"));
