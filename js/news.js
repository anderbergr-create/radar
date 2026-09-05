// ======================================
// Nyhetsradar
// news.js
// Version 18.0
// ======================================

async function getNews(stock) {

  let q =
  encodeURIComponent(stock.search);

  let rss =
  "https://news.google.com/rss/search?q=" + q;

  let api =
  "https://api.rss2json.com/v1/api.json?rss_url="
  + encodeURIComponent(rss);

  try {

    let res =
    await fetch(api);

    let data =
    await res.json();

    if (
      !data.items ||
      data.items.length === 0
    ) {

      return fallback(q);

    }

    let items = data.items;

    items = items.filter(n => {

  let text = (
    (n.title || "") + " " +
    (n.author || "") + " " +
    (n.description || "")
  ).toLowerCase();

  return !BLOCKED_SOURCES.some(source =>
    text.includes(source.toLowerCase())
  );

});
    
// Ta bort uppenbara och mycket lika dubbletter
let seen = [];

items = items.filter(n => {

  let words = (n.title || "")
    .toLowerCase()
    .replace(/[^a-z0-9åäö\s]/g, "")
    .split(/\s+/)
    .filter(word =>
      word.length > 3 &&
      ![
        "with",
        "from",
        "that",
        "this",
        "have",
        "has",
        "will",
        "into",
        "over",
        "after",
        "says",
        "said",
        "new"
      ].includes(word)
    );

  let isDuplicate = seen.some(oldWords => {

    let common = words.filter(word =>
      oldWords.includes(word)
    );

    return (
      words.length >= 4 &&
      common.length / words.length >= 0.75
    );

  });

  if (isDuplicate) {
    return false;
  }

  seen.push(words);
  return true;

});
    
    items.sort((a, b) =>

      new Date(b.pubDate)
      -
      new Date(a.pubDate)

    );

    let now =
    new Date();

    items =
    items.filter(n => {

      let d =
      new Date(n.pubDate);

      let diff =
      (now - d) /
      (1000 * 60 * 60 * 24);

      return diff <= 21;

    });

    if (
      items.length === 0
    ) {

      return fallback(q);

    }

    let html = "";

    items
    .slice(0, 10)
    .forEach(n => {

      let desc =
      n.description
      .replace(/<[^>]*>/g, "")
      .slice(0, 140);

      let d =
      new Date(n.pubDate);

      let diff =
      (now - d) /
      (1000 * 60 * 60);

      let fresh =
      diff < 24;

      let date =
      d.toLocaleDateString(
        "sv-SE"
      );

      html += `

      <div class="card ${fresh ? "fresh" : ""}">

        <a href="${n.link}"
        target="_blank">

          ${n.title}

        </a>

        <div class="date">

          ${date}

        </div>

        <div class="desc">

          ${desc}...

        </div>

      </div>

      `;

    });

    return html;

  }

  catch (e) {

    return fallback(q);

  }

}

function fallback(q) {

  return `

  <a class="fallback"
  href="https://news.google.com/search?q=${q}"
  target="_blank">

    🔗 Öppna senaste nyheter

  </a>

  `;

}
