export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://react-flashcards.herokuapp.com"
    : "https://localhost:8080";
