import { parameters, options, whitelistDomains } from "./settings.js";

function throwError(msg) {
    console.error(msg);
    return;
  }

async function run(parameters, options) {
  const currentTab = await getCurrentTab();
  const currentURL = currentTab.url;
  console.log("Current URL: ", currentURL);

  // Check whitelisted domains
  if (options.run_everywhere === false) {
    const currentDomain = new URL(currentURL).hostname;
    if (!whitelistDomains.includes(currentDomain)) {
      throwError("Domain not whitelisted");
      return;
    }
  }
  reloadTab(currentTab, transformURL(currentURL, options, parameters));
}

// Get active tab, returns object
async function getCurrentTab() {
  console.log("Getting current tab");
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log("Tabs: ", tabs);
  const currentTab = tabs[0];
  console.log("Current tab: ", currentTab);
  return currentTab;
}

// Adds parameters to passed URL
function transformURL(url, options, parameters) {
  const newURL = new URL(url);

  // Check if overwrite is true, if so, clear URL.search
  if (options.overwrite_org === true) {
    newURL.search = "";
  }
  for (const [key, value] of Object.entries(parameters)) {
    newURL.searchParams.append(key, value);
  }
  console.log("New URL: ", newURL.href);
  return newURL.href;
}

function updateURL() {
  console.log("Updating URL");
  const targetURL = window.location.href;
  console.log("Current URL: ", targetURL);
}

function reloadTab(currentTab, url) {
    console.log("Reloading window");
    chrome.tabs.update(currentTab.id, { url: url });
}

run(parameters, options);
