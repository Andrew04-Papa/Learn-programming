import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "work",
  password: "hoangduy2k4",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET home page
app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT country_code FROM visited_countries");
    let countries = [];
    result.rows.forEach((country) => {
      countries.push(country.country_code);
    });
    console.log(result.rows);
    res.render("index.ejs", { countries: countries, total: countries.length });
  } catch (err) {
    console.error("Error fetching visited countries:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Function to check visited countries
async function checkVisited() {
  try {
    const result = await db.query("SELECT country_code FROM visited_countries");
    let countries = [];
    result.rows.forEach((country) => {
      countries.push(country.country_code);
    });
    return countries;
  } catch (err) {
    console.error("Error in checkVisited:", err);
    throw err;
  }
}

// POST add new country
app.post("/add", async (req, res) => {
  const input = req.body["country"].trim();

  if (!input) {
    const countries = await checkVisited();
    return res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      error: "Please enter a valid country name.",
    });
  }

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    if (result.rows.length === 0) {
      console.log(`Country name "${input}" does not exist in the database.`);
      const countries = await checkVisited();
      return res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: `Country name "${input}" does not exist, please try again.`,
      });
    }

    const countryCode = result.rows[0].country_code;

    const checkVisitedResult = await db.query(
      "SELECT * FROM visited_countries WHERE country_code = $1",
      [countryCode]
    );

    if (checkVisitedResult.rows.length > 0) {
      console.log(`Country "${countryCode}" has already been added.`);
      const countries = await checkVisited();
      return res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: `Country "${input}" has already been added, try again.`,
      });
    }

    await db.query(
      "INSERT INTO visited_countries (country_code) VALUES ($1)",
      [countryCode]
    );
    console.log(`Added country: ${countryCode}`);

    const countries = await checkVisited();
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      success: `Country "${input}" has been added successfully.`,
    });
  } catch (err) {
    console.error("Error adding country:", err);
    const countries = await checkVisited();
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      error: "An error occurred, please try again.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});