import { createApp } from "./app/create-app";

const app = createApp();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server is running on port ", PORT);
});
