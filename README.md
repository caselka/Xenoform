
# Xenoform - Procedural Life-Form Generator

Xenoform is a web-based application that uses Google's Gemini AI to procedurally generate and visualize unique alien species. It serves as a digital codex, creating detailed entries for each life-form, complete with its biology, habitat, evolutionary history, and a photorealistic illustration.

![Xenoform Screenshot](https://imgur.com/0cDPRXk) 

## About The Project

This project showcases the creative potential of large language models (LLMs) and image generation models. By providing structured prompts and leveraging JSON schema responses, Xenoform creates a consistent and immersive experience, allowing users to explore a universe of creatures limited only by imagination.

## Features

-   **Procedural Species Generation:** Creates unique alien species with detailed descriptions at the click of a button.
-   **AI-Powered Imagery:** Utilizes Imagen to generate high-quality, photorealistic images of each species in its natural habitat.
-   **Ecosystem Simulation:** Can generate a small, interconnected ecosystem of 5 species with coherent relationships.
-   **Mutation Mode:** Evolve new creatures based on the currently viewed species, creating evolutionary descendants.
-   **Save Favorites:** Persists your favorite discoveries to your browser's local storage.
-   **Export Data:** Export the generated data for any species as a JSON file.
-   **Sci-Fi UI:** A retro-futuristic, holographic interface inspired by classic science fiction codices.

## Tech Stack

-   **Frontend:** React, TypeScript, Tailwind CSS
-   **AI Models:**
    -   Google Gemini 2.5 Pro (for data generation)
    -   Google Imagen 4 (for image generation)
-   **API:** `@google/genai` SDK

## Getting Started

To run this project, you need a Google Gemini API key.

### Prerequisites

1.  Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  The application is designed to be run in an environment where the API key is provided as an environment variable named `API_KEY`.

### Installation & Running

1.  Clone the repository:
    ```sh
    git clone https://github.com/caselka/xenoform.git
    ```
2.  Set up the `API_KEY`:
    -   How you set the environment variable depends on your hosting or development environment. For example, you might use a `.env` file with a tool like Vite or Next.js, or configure it directly in your deployment service (e.g., Vercel, Netlify).
3.  Serve the `index.html` file using a local web server. A simple way to do this is with the `serve` package:
    ```sh
    npm install -g serve
    serve .
    ```
4.  Open the provided URL in your browser. If the API key is configured correctly, the application will be ready to use.
