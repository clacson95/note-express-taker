const express = require("express");
const path = require("path");
const {
    readFromFile,
    readAndAppend,
    writeToFile,
  } = require("./helpers/fsUtils.js");

const app = express();
const PORT = process.env.PORT || 3001;


// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static("./public"));


app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);


// GET /api/notes should read the db.json file and return all saved notes as JSON
app.get("/api/notes", (req, res) => {
  readFromFile("db/db.json").then((data) => res.json(JSON.parse(data)));
});

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you)
app.post("/api/notes", (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
    };

    readAndAppend(newNote, "./db/db.json");
    res.json(`Notes added successfully 🚀`);
  } else {
    res.error("Error in adding notes");
  }
});

// Wildcard route
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);