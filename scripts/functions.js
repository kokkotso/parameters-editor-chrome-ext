import { parameters, options, whitelistDomains } from "./settings.js";

async function run(parameters, options) {
  init();
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
  displayParams();
}

function init() {
  // add form functionality
  let form = document.getElementById("param_form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    addParam();
  });
  // clear param display table
  let table = document.getElementById("param_table");
  for (let i = table.rows.length - 1; i > 0; i--) {
    table.deleteRow(i);
  }
}

// Get active tab, returns object
async function getCurrentTab() {
  // console.log("Getting current tab");
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  // console.log("Tabs: ", tabs);
  const currentTab = tabs[0];
  // console.log("Current tab: ", currentTab);
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
    newURL.searchParams.set(key, value);
  }
  console.log("New URL: ", newURL.href);
  return newURL.href;
}

async function reloadTab(currentTab, url) {
  console.log("Reloading window");
  await chrome.tabs.update(currentTab.id, { url: url });
}

async function displayParams() {
  const currentTab = await getCurrentTab();
  const currentURL = currentTab.url;
  console.log("Current URL: ", currentURL);
  const params = new URL(currentURL).searchParams;
  console.log(params);

  for (const [key, value] of params) {
    // console.log(`${key}: ${value}`);
    let table = document.getElementById("param_table");
    let newRow = table.insertRow();
    newRow.insertCell(0).innerHTML = key;
    newRow.insertCell(1).innerHTML = value;
    newRow.insertCell(2).innerHTML =
      "<button onclick='deleteParam()'>Delete</button>";
  }
}

function addParam() {
  console.log("Adding parameter");
  let key = document.getElementById("param_key").value;
  let value = document.getElementById("param_val").value;
  if (parameters[key]) {
    throwError("Parameter key already exists, please edit the existing value");
  } else {
    parameters[key] = value;
  }
  console.log(parameters);
  run(parameters, options);
}

function throwError(msg) {
  console.error(msg);
  return;
}

run(parameters, options);
