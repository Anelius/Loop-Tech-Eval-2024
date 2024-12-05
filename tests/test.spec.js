// @ts-check
const { test, expect } = require('@playwright/test');

// URL to Demo App
const url = "https://animated-gingersnap-8cf7f2.netlify.app/";

// Login credentials provided by Loop in tech eval instructions here: https://docs.google.com/document/d/1Kza7YxxI9nfIQA29g2J8_HDNynmtx6KcCp2Do2vE5SQ/edit?tab=t.0
const username = "admin";
const password = "password123";

const testCases = [
  {
    "testId": 1,
    "sidebarNav": "Web Application",
    "cardTitle": "Implement user authentication",
    "cardColumn": "To Do",
    "cardTags": ["Feature", "High Priority"]
  },
  {
    "testId": 2,
    "sidebarNav": "Web Application",
    "cardTitle": "Fix navigation bug",
    "cardColumn": "To do",
    "cardTags": ["Bug"]
  },
  {
    "testId": 3,
    "sidebarNav": "Web Application",
    "cardTitle": "Design system updates",
    "cardColumn": "In Progress",
    "cardTags": ["Design"]
  },
  {
    "testId": 4,
    "sidebarNav": "Mobile Application",
    "cardTitle": "Push notification system",
    "cardColumn": "To Do",
    "cardTags": ["Feature"]
  },
  {
    "testId": 5,
    "sidebarNav": "Mobile Application",
    "cardTitle": "Offline mode",
    "cardColumn": "In Progress",
    "cardTags": ["Feature", "High Priority"]
  },
  {
    "testId": 6,
    "sidebarNav": "Mobile Application",
    "cardTitle": "App icon design",
    "cardColumn": "Done",
    "cardTags": ["Design"]
  }
];

testCases.forEach(testCase => {
  test("Test Case "+testCase.testId, async ({ page }) => {
    await login(page);
    await navigateTo(page, testCase);
    await verify(page, testCase);
  });
});

// Login to the Demo App using the provided credentials
const login = async (page) => {
  await page.goto(url);
  await page.fill('input[id="username"]', username);
  await page.fill('input[id="password"]', password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();

  // Verify successful login
  await expect(page.getByRole('button', { name: 'Logout', exact: true })).toBeVisible();
}

// Make selection from the "Projects" left side nav bar
const navigateTo = async (page, testCase) => {
  await page.getByRole('button', { name: testCase.sidebarNav }).click();
  await expect(page.getByRole('banner').getByRole('heading', { name: testCase.sidebarNav })).toBeVisible();
}

// Verify that a card exists in the defined column and check the card for the expected tags
const verify = async (page, testCase) => {
  // await page.locator('.h-full div div:has-text("To Do")').locator('div div:has-text("Implement user authentication")').locator('.flex').first().locator('span').all();
  const column = await page.locator(`.h-full div div:has-text("${testCase.cardColumn}")`);
  await expect(column).toBeVisible();

  const card = await column.locator(`div div:has-text("${ testCase.cardTitle }")`);
  await expect(card).toBeVisible();
  
  // Verify card found in column
  await expect(card).toHaveCount(1);

  const pageTags = await card.locator(`.flex`).first().locator(`span`).allInnerTexts();

  pageTags.forEach(async (pageTag) => {
    await console.log("Tag: "+pageTag+" is in "+testCase["cardTags"]);
    await expect(testCase["cardTags"].includes(pageTag)).toBe(true);
  });
}
