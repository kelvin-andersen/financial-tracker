import express from "express";
import cors from "cors";
import blogs from "./routes/blogs.js";
import fund_sources from "./routes/fund_sources.js";

const PORT = process.env.PORT || 8000;
const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use("/blogs", blogs);
app.use("/fund_sources", fund_sources);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});