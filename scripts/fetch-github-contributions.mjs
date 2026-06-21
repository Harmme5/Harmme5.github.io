const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const userName = process.env.GITHUB_USER || "Harmme5";
const outputPath = new URL("../static/data/github-contributions.json", import.meta.url);

if (!token) {
  throw new Error("Missing GITHUB_TOKEN. Create a token or use GitHub Actions github.token.");
}

const now = new Date();
const to = now.toISOString();
const fromDate = new Date(now);
fromDate.setUTCDate(fromDate.getUTCDate() - 370);
const from = fromDate.toISOString();

const query = `
query($userName: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $userName) {
    login
    name
    createdAt
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            color
            contributionCount
            date
            weekday
          }
        }
      }
    }
  }
}
`;

const response = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: {
    authorization: `Bearer ${token}`,
    "content-type": "application/json",
    "user-agent": "hugo-blog-github-contributions"
  },
  body: JSON.stringify({
    query,
    variables: { userName, from, to }
  })
});

if (!response.ok) {
  throw new Error(`GitHub GraphQL request failed: ${response.status} ${response.statusText}`);
}

const payload = await response.json();
if (payload.errors?.length) {
  throw new Error(payload.errors.map((error) => error.message).join("; "));
}

const user = payload.data?.user;
if (!user) {
  throw new Error(`GitHub user not found: ${userName}`);
}

const calendar = user.contributionsCollection.contributionCalendar;
const days = calendar.weeks.flatMap((week) => week.contributionDays);
const latestContribution = [...days]
  .reverse()
  .find((day) => day.contributionCount > 0);

const createdAt = new Date(user.createdAt);
const daysOnline = Math.max(0, Math.floor((now - createdAt) / 86400000));

const result = {
  user: {
    login: user.login,
    name: user.name,
    createdAt: user.createdAt
  },
  generatedAt: now.toISOString(),
  from,
  to,
  totalContributions: calendar.totalContributions,
  daysOnline,
  lastContributionDate: latestContribution?.date || null,
  colors: ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"],
  weeks: calendar.weeks.map((week) => ({
    contributionDays: week.contributionDays.map((day) => ({
      date: day.date,
      count: day.contributionCount,
      color: day.color,
      weekday: day.weekday
    }))
  }))
};

await import("node:fs/promises").then(async ({ mkdir, writeFile }) => {
  await mkdir(new URL("../static/data/", import.meta.url), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
});

console.log(`Updated ${outputPath.pathname} for ${user.login}`);
