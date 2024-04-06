import { app } from "./src/app.mjs"
import dotenv from "dotenv";

// Configure  environment variables using .env file
dotenv.config();

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
