const express = require("express");
const bodyParser = require("body-parser");

const path = require("path");

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname + "/views"));

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
var articles = [];
axios
  .get(apiUrl, requestOptions)
  .then((response) => {
    articles = response.data.articles;

    // articles.forEach((article, index) => {
    //   console.log(`#${index + 1}`);
    //   console.log("Title:", article.title);
    //   console.log("Description:", article.description);
    //   console.log("URL:", article.url);
    //   console.log("Published At:", article.publishedAt);
    //   console.log("Source:", article.source.name);
    //   console.log("----------------------");
    // });
  })
  .catch((error) => {
    console.error("Error fetching news:", error.message);
  });
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(); // Customize this formatting as needed
}

app.get("/news", async (req, res) => {
  try {
    res.render("News", { articles, formatDate });
  } catch (error) {
    console.error("Error fetching employee data:", error);
    res.status(500).send("Error fetching employee data");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
