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
const apiUrl = "http://newsapi.org/v2/top-headlines";
var category = "general"; // Change this to your desired country code
const pageSize = 12; // Number of news articles to fetch
const country = "in";
const language = "en";
const requestOptions = {
  params: {
    country,
    category,
    pageSize,
    apiKey,
    language,
  },
};
var articles = [];

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(); // Customize this formatting as needed
}

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(apiUrl, requestOptions);
    const articles = response.data.articles;
    res.render("News", { articles, formatDate });
  } catch (error) {
    console.error("Error fetching employee data:", error);
    res.status(500).send("Error fetching employee data");
  }
});

app.get("/news/:category", async (req, res) => {
  try {
    const selectedCategory = req.params.category;
    const requestOptions = {
      params: {
        category: selectedCategory,
        pageSize,
        apiKey,
        language,
        country,
      },
    };
    const response = await axios.get(apiUrl, requestOptions);
    const articles = response.data.articles;
    res.render("News", { articles, formatDate });
  } catch (error) {
    console.error("Error fetching news:", error.message);
    res.status(500).send("Error fetching news");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
