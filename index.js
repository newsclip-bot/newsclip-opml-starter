const https = require("https");

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => resolve({ status: res.statusCode, body: data }));
    }).on("error", reject);
  });
}

function extractHrefs(html) {
  const out = [];
  const re = /href="([^"]+)"/g;
  let m = null;
  while ((m = re.exec(html)) !== null) {
    const href = m[1] || "";
    if (!href) continue;
    if (href.startsWith("#")) continue;
    out.push(href);
    if (out.length >= 25) break;
  }
  return out;
}

async function main() {
  const url = process.argv[2] || "https://newsclip.com/";
  const res = await fetchText(url);

  const hrefs = extractHrefs(res.body || "");
  console.log(JSON.stringify({
    url,
    status: res.status,
    found: hrefs.length,
    hrefs
  }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
