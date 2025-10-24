// Jeopardy Game Logic
class JeopardyGame {
  constructor() {
    this.config = null;
    this.answeredQuestions = new Set();
    this.currentQuestion = null;
    this.answerWasShown = false;
    this.hintWasShown = false;
    this.init();
  }

  async init() {
    try {
      await this.loadConfig();
      this.setTitle();
      this.applyTheme();
      this.renderBoard();
      this.setupEventListeners();
    } catch (error) {
      console.error("Error initializing game:", error);
      alert(
        "Error loading game configuration. Please make sure config.json exists and is valid."
      );
    }
  }

  setTitle() {
    const titleElement = document.getElementById("game-title");
    if (titleElement && this.config.title) {
      titleElement.textContent = this.config.title;
    }
  }

  async loadConfig() {
    try {
      // Try to load config.json first
      const response = await fetch("config.json");
      if (!response.ok) {
        // Fallback to config.example.json
        const exampleResponse = await fetch("config.example.json");
        if (!exampleResponse.ok) {
          throw new Error("No configuration file found");
        }
        this.config = await exampleResponse.json();
        console.log("Loaded example configuration");
      } else {
        this.config = await response.json();
        console.log("Loaded custom configuration");
      }
    } catch (error) {
      throw new Error("Failed to load configuration: " + error.message);
    }
  }

  applyTheme() {
    const theme = this.config.theme;
    document.documentElement.style.setProperty(
      "--primary-color",
      theme.primaryColor
    );
    document.documentElement.style.setProperty("--text-color", theme.textColor);
    document.documentElement.style.setProperty(
      "--background-color",
      theme.backgroundColor
    );

    // Apply answer colors if specified
    if (theme.answerBoxColor) {
      document.documentElement.style.setProperty(
        "--answer-box-color",
        theme.answerBoxColor
      );
    }
    if (theme.answerAccentColor) {
      document.documentElement.style.setProperty(
        "--answer-accent-color",
        theme.answerAccentColor
      );
    }
  }

  renderBoard() {
    const board = document.getElementById("game-board");
    const { columns, rows } = this.config.board;

    // Set up grid layout
    board.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    // Validate that we have the right number of categories
    if (this.config.categories.length !== columns) {
      console.warn(
        `Expected ${columns} categories but found ${this.config.categories.length}`
      );
    }

    // Clear existing board
    board.innerHTML = "";

    // Render category headers
    this.config.categories.forEach((category) => {
      const header = document.createElement("div");
      header.className = "category-header";
      header.textContent = category.name;
      board.appendChild(header);
    });

    // Render question cells
    for (let row = 0; row < rows; row++) {
      this.config.categories.forEach((category, colIndex) => {
        const cell = document.createElement("div");
        cell.className = "question-cell";

        if (category.questions && category.questions[row]) {
          const question = category.questions[row];
          cell.textContent = `$${question.value}`;
          cell.dataset.categoryIndex = colIndex;
          cell.dataset.questionIndex = row;

          cell.addEventListener("click", () => {
            this.handleQuestionClick(colIndex, row);
          });
        } else {
          cell.textContent = "";
          cell.classList.add("answered");
        }

        board.appendChild(cell);
      });
    }
  }

  handleQuestionClick(categoryIndex, questionIndex) {
    const key = `${categoryIndex}-${questionIndex}`;

    // Check if already answered
    if (this.answeredQuestions.has(key)) {
      return;
    }

    const category = this.config.categories[categoryIndex];
    const question = category.questions[questionIndex];

    this.currentQuestion = {
      categoryIndex,
      questionIndex,
      data: question,
    };

    this.showQuestionModal(question);
  }

  showQuestionModal(question) {
    const modal = document.getElementById("question-modal");
    const valueElement = document.getElementById("question-value");
    const questionElement = document.getElementById("question-text");
    const mediaContainer = document.getElementById("media-container");
    const answerContainer = document.getElementById("answer-container");
    const answerMediaContainer = document.getElementById(
      "answer-media-container"
    );
    const showAnswerBtn = document.getElementById("show-answer-btn");
    const showHintBtn = document.getElementById("show-hint-btn");

    // Set question value and text
    valueElement.textContent = `$${question.value}`;
    questionElement.textContent = question.question;

    // Clear previous media
    mediaContainer.innerHTML = "";
    if (answerMediaContainer) {
      answerMediaContainer.innerHTML = "";
    }

    // Reset state for new question
    this.answerWasShown = false;
    this.hintWasShown = false;
    showAnswerBtn.style.display = "inline-block";

    // Show hint button only if hint is available
    if (question.hint) {
      showHintBtn.style.display = "inline-block";
    } else {
      showHintBtn.style.display = "none";
    }

    // Handle different question types
    if (question.type === "image" && question.media) {
      const img = document.createElement("img");
      img.src = question.media;
      img.alt = "Question image";
      img.onerror = () => {
        img.alt =
          "Image not found. Please add your media files to the media folder.";
        img.style.display = "none";
        const errorMsg = document.createElement("p");
        errorMsg.textContent =
          "Image not found. Please add your media files to the media folder.";
        errorMsg.style.color = "#FFD700";
        mediaContainer.appendChild(errorMsg);
      };
      mediaContainer.appendChild(img);
    } else if (question.type === "video" && question.media) {
      const video = document.createElement("video");
      video.src = question.media;
      video.controls = true;
      video.autoplay = false;
      video.onerror = () => {
        const errorMsg = document.createElement("p");
        errorMsg.textContent =
          "Video not found. Please add your media files to the media folder.";
        errorMsg.style.color = "#FFD700";
        mediaContainer.appendChild(errorMsg);
      };
      mediaContainer.appendChild(video);
    } else if (question.type === "audio" && question.media) {
      const audio = document.createElement("audio");
      audio.src = question.media;
      audio.controls = true;
      audio.onerror = () => {
        const errorMsg = document.createElement("p");
        errorMsg.textContent =
          "Audio not found. Please add your media files to the media folder.";
        errorMsg.style.color = "#FFD700";
        mediaContainer.appendChild(errorMsg);
      };
      mediaContainer.appendChild(audio);
    }

    // Hide answer initially
    answerContainer.style.display = "none";

    // Show modal
    modal.classList.add("active");
  }

  showHint() {
    if (!this.currentQuestion || !this.currentQuestion.data.hint) return;

    const mediaContainer = document.getElementById("media-container");
    const showHintBtn = document.getElementById("show-hint-btn");

    // Create hint image
    const hintImg = document.createElement("img");
    hintImg.src = this.currentQuestion.data.hint;
    hintImg.alt = "Hint image";
    hintImg.style.marginTop = "20px";
    hintImg.style.maxWidth = "100%";
    hintImg.style.maxHeight = "400px";
    hintImg.style.border = "3px solid var(--answer-accent-color)";
    hintImg.onerror = () => {
      const errorMsg = document.createElement("p");
      errorMsg.textContent = "Hint image not found.";
      errorMsg.style.color = "#FFD700";
      errorMsg.style.marginTop = "20px";
      mediaContainer.appendChild(errorMsg);
    };
    mediaContainer.appendChild(hintImg);

    showHintBtn.style.display = "none";
    this.hintWasShown = true;

    // Auto-scroll to hint after a brief delay
    setTimeout(() => {
      hintImg.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  }

  showAnswer() {
    if (!this.currentQuestion) return;

    const answerContainer = document.getElementById("answer-container");
    const answerText = document.getElementById("answer-text");
    const answerMediaContainer = document.getElementById(
      "answer-media-container"
    );
    const showAnswerBtn = document.getElementById("show-answer-btn");
    const showHintBtn = document.getElementById("show-hint-btn");
    const modalContent = document.querySelector(".modal-content");

    answerText.textContent = this.currentQuestion.data.answer;

    // Show answer image if available
    if (this.currentQuestion.data.answerImage && answerMediaContainer) {
      const answerImg = document.createElement("img");
      answerImg.src = this.currentQuestion.data.answerImage;
      answerImg.alt = "Answer image";
      answerImg.style.marginTop = "20px";
      answerImg.style.maxWidth = "100%";
      answerImg.style.maxHeight = "400px";
      answerImg.style.border = "3px solid var(--answer-accent-color)";
      answerImg.onerror = () => {
        const errorMsg = document.createElement("p");
        errorMsg.textContent = "Answer image not found.";
        errorMsg.style.color = "#FFD700";
        errorMsg.style.marginTop = "20px";
        answerMediaContainer.appendChild(errorMsg);
      };
      answerMediaContainer.appendChild(answerImg);
    }

    answerContainer.style.display = "block";
    showAnswerBtn.style.display = "none";
    showHintBtn.style.display = "none";
    this.answerWasShown = true;

    // Auto-scroll to answer after a brief delay to let content render
    setTimeout(() => {
      if (modalContent) {
        answerContainer.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, 100);
  }

  closeModal() {
    const modal = document.getElementById("question-modal");
    modal.classList.remove("active");

    // Only mark question as answered if the answer was shown
    if (this.currentQuestion && this.answerWasShown) {
      const key = `${this.currentQuestion.categoryIndex}-${this.currentQuestion.questionIndex}`;
      this.answeredQuestions.add(key);

      // Update the cell appearance
      const cells = document.querySelectorAll(".question-cell");
      const { columns } = this.config.board;
      // Calculate index: skip category headers (columns) + row offset + column
      const cellIndex =
        this.currentQuestion.questionIndex * columns +
        this.currentQuestion.categoryIndex;

      if (cells[cellIndex]) {
        cells[cellIndex].classList.add("answered");
      }
    }

    this.currentQuestion = null;
    this.answerWasShown = false;
    this.hintWasShown = false;
  }

  setupEventListeners() {
    const showAnswerBtn = document.getElementById("show-answer-btn");
    const showHintBtn = document.getElementById("show-hint-btn");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const modal = document.getElementById("question-modal");

    showAnswerBtn.addEventListener("click", () => this.showAnswer());
    showHintBtn.addEventListener("click", () => this.showHint());
    closeModalBtn.addEventListener("click", () => this.closeModal());

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        this.closeModal();
      }
    });

    // Close modal with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("active")) {
        this.closeModal();
      }
    });
  }
}

// Initialize game when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new JeopardyGame();
});
