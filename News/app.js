const axios = require("axios");

const apiKey = "0175fca54aed4d4dad4df436ca33b072";
const apiUrl = "http://newsapi.org/v2/everything";
const q = "india"; // Change this to your desired country code
const pageSize = 5; // Number of news articles to fetch

const requestOptions = {
  params: {
    q,
    pageSize,
    apiKey,
  },
};

axios
  .get(apiUrl, requestOptions)
  .then((response) => {
    const articles = response.data.articles;
    articles.forEach((article, index) => {
      console.log(`#${index + 1}`);
      console.log("Title:", article.title);
      console.log("Description:", article.description);
      console.log("URL:", article.url);
      console.log("Published At:", article.publishedAt);
      console.log("Source:", article.source.name);
      console.log("----------------------");
    });
  })
  .catch((error) => {
    console.error("Error fetching news:", error.message);
  });
