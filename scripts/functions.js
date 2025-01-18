const parameters = {
  testing: true,
  gclid: "12gai5",
  utm_source: "google",
};

const options = {
  append_all: false,
  overwrite_org: false,
  run_everywhere: false,
};

const whitelistDomains = ["walkerdunlop.com", "walker-dunlop.webflow.io"];

async function run(parameters, options) {
  const currentURL = await getCurrentURL();
  if (options.run_everywhere === false) {
    const currentDomain = new URL(currentURL).hostname;
    if (!whitelistDomains.includes(currentDomain)) {
      throwError("Domain not whitelisted");
    }
    return;
  }
  console.log("You shouldn't be seeing this");
}

async function getCurrentURL() {
  console.log("Getting current URL");
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const currentTab = tabs[0];
  console.log("Current URL: ", currentTab.url);
  console.log(typeof currentTab.url);
  return currentTab.url;
}

function transformURL(url, options, parameters) {
  const newURL = new URL(url);
  console.log("Options.Overwrite: ", options.overwrite_org);
  if (options.overwrite_org === true) {
    newURL.search = "";
  } else {
    for (const [key, value] of Object.entries(parameters)) {
      newURL.searchParams.append(key, value);
    }
  }
  console.log("New URL: ", newURL.href);
  return newURL.href;
}

function updateURL() {
  console.log("Updating URL");
  const targetURL = window.location.href;
  console.log("Current URL: ", targetURL);
}

function throwError(msg) {
    console.error(msg);
}

run(parameters, options);
