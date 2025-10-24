# Jeopardy Game

Easy set up Jeopardy game for fun times!

You can configure with your own questions, categories, and media (images, videos, audio).

## Features

- Fully customizable board size (set column and row number)
- Support for multiple question types: text, image, video, and audio
- Customizable theme colors
- Responsive design for different screen sizes
- Easy JSON-based configuration

## Quick Start

1. **Copy the example config file**

   ```bash
   cp config.example.json config.json
   ```

2. **Open the game**

   - Open `index.html` in your web browser
   - Or use a local server (recommended):

     ```bash
     # Using Python 3
     python -m http.server 8000

     # Using Python 2
     python -m SimpleHTTPServer 8000

     # Using Node.js (if you have http-server installed)
     npx http-server
     ```

   - Navigate to `http://localhost:8000`

3. **Customize your game** by editing `config.json` (see Configuration section below)

## Configuration

The game is configured through a `config.json` file. Here's what you can customize:

### Theme

```json
"theme": {
  "primaryColor": "#060CE9",
  "textColor": "#FFFFFF",
  "backgroundColor": "#000000",
  "answerBoxColor": "#21ff76",
  "answerAccentColor": "#ffffff"
}
```

- `primaryColor`: The main color for the board (default is Jeopardy blue)
- `textColor`: Text color for questions and UI
- `backgroundColor`: Background color of the page
- `answerBoxColor`: Background color of the answer container
- `answerAccentColor`: Color for answer borders, labels, and accent elements

### Board Structure

```json
"board": {
  "columns": 5,
  "rows": 5
}
```

- `columns`: Number of categories (default: 5)
- `rows`: Number of questions per category (default: 5)

### Categories and Questions

Each category contains a name and an array of questions:

```json
"categories": [
  {
    "name": "History",
    "questions": [
      {
        "value": 200,
        "type": "text",
        "question": "This ancient wonder is the only one still standing.",
        "answer": "What is the Great Pyramid of Giza?"
      },
      {
        "value": 400,
        "type": "image",
        "question": "Identify this figure.",
        "media": "media/important_figures.jpg",
        "answer": "Who is Ava Lovalace?"
      }
    ]
  }
]
```

### Question Types

**Text Question:**

```json
{
  "value": 200,
  "type": "text",
  "question": "Your question text here",
  "answer": "What is the answer?"
}
```

**Image Question:**

```json
{
  "value": 400,
  "type": "image",
  "question": "Identify this image",
  "media": "media/image.jpg",
  "answer": "What is it?"
}
```

**Video Question:**

```json
{
  "value": 600,
  "type": "video",
  "question": "What movie is this from?",
  "media": "media/video.mp4",
  "answer": "What is The Matrix?"
}
```

**Audio Question:**

```json
{
  "value": 800,
  "type": "audio",
  "question": "Name this song",
  "media": "media/song.mp3",
  "answer": "What is Bohemian Rhapsody?"
}
```

### Optional Fields

**Hint Image:**

Add an optional `hint` field to any question type to provide a hint image that players can reveal:

```json
{
  "value": 400,
  "type": "image",
  "question": "Name this famous movie character.",
  "media": "media/movie_character.jpg",
  "hint": "media/movie_character_hint.jpg",
  "answer": "Who is Darth Vader?"
}
```

**Answer Image:**

Add an optional `answerImage` field to display an image along with the text answer:

```json
{
  "value": 200,
  "type": "text",
  "question": "This ancient wonder of the world is the only one still standing today.",
  "answer": "What is the Great Pyramid of Giza?",
  "answerImage": "media/great_pyramid_answer.jpg"
}
```

**Combined Example:**

You can use both hint and answer images together:

```json
{
  "value": 400,
  "type": "image",
  "question": "Name this famous movie character.",
  "media": "media/movie_character.jpg",
  "hint": "media/movie_character_hint.jpg",
  "answer": "Who is Darth Vader?",
  "answerImage": "media/movie_character_answer.jpg"
}
```

When hint or answer images are present, the modal will automatically scroll to show them, making it easy to view all content even with multiple images.

## Adding Media Files

1. Create a `media` folder in the project root (if it doesn't exist)
2. Add your media files (images, videos, audio) to this folder
3. Reference them in your config.json using relative paths like `"media/your_file.jpg"`

Supported formats:

- Images: JPG, PNG, GIF, WebP
- Video: MP4, WebM, OGG
- Audio: MP3, WAV, OGG

## File Structure

```
jeopardy/
├── index.html              # Main HTML file
├── config.json             # Your custom configuration
├── config.example.json     # Example configuration
├── src/
│   ├── game.ts            # Game logic
│   └── styles.css         # Styling
├── media/                 # Your media files (not tracked in git)
│   └── examples/          # Example media references
└── README.md
```

## How to Play

1. Click on any dollar amount to reveal the question
2. Read/view the question and media (if any)
3. (Optional) Click "Show Hint" to reveal a hint image if available
4. Click "Show Answer" to reveal the answer
5. Click "Close" to return to the board
6. Used questions will be grayed out and cannot be clicked again

**Note:** Questions are only marked as answered if you click "Show Answer". If you close the modal without viewing the answer, you can come back to that question later.

## Tips

- Keep question text concise for better display
- Test media files before using them in your game
- Use a local server for better media loading performance
- Recommended image size: max 800px width for best display
- The game automatically falls back to `config.example.json` if `config.json` is not found

## Browser Compatibility

Works on all modern browsers:

- Chrome/Edge
- Firefox
- Safari
- Opera

## Troubleshooting

**Media files not loading?**

- Make sure you're using a local server (not just opening the HTML file)
- Check that file paths in config.json match actual file locations
- Verify file formats are supported

**Config not loading?**

- Ensure your JSON is valid (use a JSON validator)
- Check browser console for error messages
- Make sure the file is named `config.json` exactly
