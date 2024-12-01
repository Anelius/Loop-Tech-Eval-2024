// @ts-check
const { test, expect } = require('@playwright/test');

// URL to test website "Asana"
const url = "https://app.asana.com/-/login";

// Login credentials provided by Loop in tech eval instructions here: https://docs.google.com/document/d/1oGwPbnNImNIlEkwdMcBCUhgQEPclkDss8iFZP2A8AQ0/edit?tab=t.0
const email = "ben+pose@workwithloop.com";
const password = "Password123";

const testCases = [
  {
    "testId": 1,
    "sidebarNav": "Cross-functional project plan, Project",
    "cardTitle": "Draft project brief",
    "cardColumn": "To do",
    "cardTags": ["Non-Priority", "On track"]
  },
  {
    "testId": 2,
    "sidebarNav": "Cross-functional project plan, Project",
    "cardTitle": "Schedule kickoff meeting",
    "cardColumn": "To do",
    "cardTags": ["Medium", "At risk"]
  },
  {
    "testId": 3,
    "sidebarNav": "Cross-functional project plan, Project",
    "cardTitle": "Share timeline with teammates",
    "cardColumn": "To do",
    "cardTags": ["High", "Off track"]
  },
  {
    "testId": 4,
    "sidebarNav": "Work Requests",
    "cardTitle": "[Example] Laptop setup for new hire",
    "cardColumn": "New Requests",
    "cardTags": ["Medium priority", "Low effort", "New hardware", "Not Started"]
  },
  {
    "testId": 5,
    "sidebarNav": "Work Requests",
    "cardTitle": "[Example] Password not working",
    "cardColumn": "In Progress",
    "cardTags": ["Low effirt", "Low priority", "Password reset", "Waiting"]
  },
  {
    "testId": 6,
    "sidebarNav": "Work Requests",
    "cardTitle": "[Example] New keycard for Daniela V",
    "cardColumn": "Completed",
    "cardTags": ["Low effort", "New hardware", "High Priority", "Done"]
  },
];

testCases.forEach(testCase => {
  test("Test Case "+testCase.testId, async ({ page }) => {
    await login(page);
    await navigateTo(page, testCase);
    await verify(page, testCase);
  });
});

const login = async (page) => {
  await page.goto(url);
  await page.fill('input[type="email"]', email);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.fill('input[type="password"]', password);
  await page.getByRole('button', { name: 'Log in', exact: true }).click();

  await expect(page.locator(".HomePageContent-greeting")).toBeVisible();
}

const navigateTo = async (page, testCase) => {
  await page.getByRole('SidebarNavigationLinkCard', { name: testCase.sidebarNav, exact: true });
}

const verify = async (page, testCase) => {
  const column = await page.locator(`.CommentOnlyBoardColumn:has(h3:text("${ testCase.cardColumn }"))`);
  const card = await column.locator(`.CommentOnlyBoardColumnCardsContainer-itemContainer:has(span:text("${ testCase.cardTitle }"))`);
  
  const verifyHTML = await card.innerHTML();
  console.log("_____________________ HERE: "+verifyHTML);

  await expect(card).toHaveCount(1);

  const pageTags = await card.locator('.BoardCardCustomPropertiesAndTags > div').all();
  pageTags.forEach(async (pageTag) => {
    const tagName = await pageTag.innerText();
    await expect(testCase["cardTags"].includes(tagName)).toBe(true);
  });
}