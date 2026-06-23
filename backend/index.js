const express = require("express");
const CORS = require("cors");
const app = express();

const PORT = 8000 || process.env.PORT;

app.use(CORS({
    origin : "http://localhost:5173",
    credentials : true
}))

app.listen(PORT , ()=>{console.log(`Server started on port ${PORT}`)});