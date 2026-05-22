const categories = [
  {
    id: "puhekieli",
    title: "Spoken Finnish (puhekieli)",
    description: "100 common spoken Finnish words for everyday life.",
    badge: "Active lesson",
    dataUrl: "data/puhekieli.json",
    enabled: true
  },
    {
    id: "puhekieli_2",
    title: "Spoken Finnish 2 (puhekieli)",
    description: "85 common spoken Finnish words for everyday life.",
    badge: "Active lesson",
    dataUrl: "data/puhekieli_2.json",
    enabled: true
  },
  {
    id: "helsinki-slang",
    title: "Helsinki Slang",
    description: "131 local words and expressions used around Helsinki.",
    badge: "Active lesson",
    dataUrl: "data/helsinki_slang.json",
    enabled: true
  },
  {
    id: "workplace-finnish",
    title: "Workplace Finnish",
    description: "Useful Finnish for jobs, meetings, and messages.",
    badge: "Coming soon",
    enabled: false
  }
];

const correctAnswerDelayMs = 650;

const state = {
  activeCategory: null,
  allWords: [],
  words: [],
  languageNotes: null,
  practiceLimit: 10,
  currentIndex: 0,
  score: 0,
  answered: false,
  timerId: null
};

const screens = {
  home: document.querySelector("#homeScreen"),
  setup: document.querySelector("#setupScreen"),
  study: document.querySelector("#studyScreen"),
  practice: document.querySelector("#practiceScreen"),
  result: document.querySelector("#resultScreen")
};

const els = {
  screenTitle: document.querySelector("#screenTitle"),
  backButton: document.querySelector("#backButton"),
  whyButton: document.querySelector("#whyButton"),
  notesDialog: document.querySelector("#notesDialog"),
  closeNotesButton: document.querySelector("#closeNotesButton"),
  notesList: document.querySelector("#notesList"),
  shareButtons: document.querySelectorAll("[data-share-platform]"),
  shareFeedbacks: document.querySelectorAll("[data-share-feedback]"),
  categoryList: document.querySelector("#categoryList"),
  bestScoreCard: document.querySelector("#bestScoreCard"),
  bestScoreText: document.querySelector("#bestScoreText"),
  availableCount: document.querySelector("#availableCount"),
  setupForm: document.querySelector("#setupForm"),
  wordAmountInput: document.querySelector("#wordAmountInput"),
  setupFeedback: document.querySelector("#setupFeedback"),
  chooseWordsButton: document.querySelector("#chooseWordsButton"),
  learnedCount: document.querySelector("#learnedCount"),
  learnedTableBody: document.querySelector("#learnedTableBody"),
  studyCount: document.querySelector("#studyCount"),
  wordList: document.querySelector("#wordList"),
  startPracticeButton: document.querySelector("#startPracticeButton"),
  progressText: document.querySelector("#progressText"),
  scoreText: document.querySelector("#scoreText"),
  progressBar: document.querySelector("#progressBar"),
  practiceTitle: document.querySelector("#practiceTitle"),
  englishHint: document.querySelector("#englishHint"),
  answerForm: document.querySelector("#answerForm"),
  answerInput: document.querySelector("#answerInput"),
  feedbackText: document.querySelector("#feedbackText"),
  submitButton: document.querySelector("#submitButton"),
  nextButton: document.querySelector("#nextButton"),
  finalScore: document.querySelector("#finalScore"),
  resultMessage: document.querySelector("#resultMessage"),
  playAgainButton: document.querySelector("#playAgainButton"),
  homeButton: document.querySelector("#homeButton")
};

function init() {
  renderCategories();
  renderBestScore();
  bindEvents();
  showScreen("home");
}

function bindEvents() {
  els.backButton.addEventListener("click", handleBack);
  els.whyButton.addEventListener("click", openLanguageNotes);
  els.closeNotesButton.addEventListener("click", () => els.notesDialog.close());
  els.notesDialog.addEventListener("click", handleDialogBackdropClick);
  els.shareButtons.forEach((button) => {
    button.addEventListener("click", handleShareClick);
  });
  els.setupForm.addEventListener("submit", handleSetupSubmit);
  els.startPracticeButton.addEventListener("click", startPractice);
  els.answerForm.addEventListener("submit", handleSubmit);
  els.nextButton.addEventListener("click", goToNextWord);
  els.playAgainButton.addEventListener("click", showSetup);
  els.homeButton.addEventListener("click", () => showScreen("home"));
}

async function openLanguageNotes() {
  els.notesList.innerHTML = `
    <article class="note-card">
      <p>Loading notes...</p>
    </article>
  `;
  els.notesDialog.showModal();

  try {
    if (!state.languageNotes) {
      const response = await fetch("data/language-notes.json");
      if (!response.ok) throw new Error("Could not load language notes.");
      state.languageNotes = await response.json();
    }

    renderLanguageNotes(state.languageNotes);
  } catch (error) {
    els.notesList.innerHTML = `
      <article class="note-card">
        <h3>Notes could not be loaded.</h3>
        <p>Please check data/language-notes.json and refresh the page.</p>
      </article>
    `;
    console.error(error);
  }
}

function renderLanguageNotes(notes) {
  els.notesList.innerHTML = "";

  notes.forEach((note) => {
    const item = document.createElement("article");
    item.className = "note-card";
    item.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.body}</p>
      <p><strong>Example:</strong> <code>${note.example}</code></p>
      <a href="${note.sourceUrl}" target="_blank" rel="noreferrer">Source: ${note.sourceName}</a>
    `;
    els.notesList.append(item);
  });
}

function handleDialogBackdropClick(event) {
  if (event.target instanceof HTMLDialogElement) {
    event.target.close();
  }
}

function renderCategories() {
  els.categoryList.innerHTML = "";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = "category-card";
    button.type = "button";
    button.disabled = !category.enabled;
    button.innerHTML = `
      <h3>${category.title}</h3>
      <p>${category.description}</p>
      <span class="pill">${category.badge}</span>
    `;

    if (category.enabled) {
      button.addEventListener("click", () => loadCategory(category.id));
    }

    els.categoryList.append(button);
  });
}

async function loadCategory(categoryId) {
  const category = categories.find((item) => item.id === categoryId);
  if (!category || !category.enabled) return;

  state.activeCategory = category;
  els.screenTitle.textContent = category.title;

  try {
    const response = await fetch(category.dataUrl);
    if (!response.ok) throw new Error(`Could not load ${category.dataUrl}`);

    state.allWords = await response.json();
    state.words = [];
    renderSetup();
    showScreen("setup");
  } catch (error) {
    els.wordList.innerHTML = `
      <div class="word-card">
        <strong>Lesson could not be loaded.</strong>
        <span>Please open this folder through a local server or GitHub Pages.</span>
      </div>
    `;
    showScreen("study");
    console.error(error);
  }
}

function renderSetup() {
  const availableWords = getAvailableWords();
  const learnedWords = readLearnedWords(state.activeCategory.id);
  const availableTotal = availableWords.length;
  const defaultAmount = clampNumber(state.practiceLimit, 1, Math.max(availableTotal, 1));

  els.availableCount.textContent = `${availableTotal} words available`;
  els.wordAmountInput.max = String(Math.max(availableTotal, 1));
  els.wordAmountInput.value = String(defaultAmount);
  els.wordAmountInput.disabled = availableTotal === 0;
  els.chooseWordsButton.disabled = availableTotal === 0;
  els.setupFeedback.textContent =
    availableTotal === 0
      ? "All words in this lesson are learned. Add more words to the JSON file to continue."
      : "";
  els.setupFeedback.className = availableTotal === 0 ? "feedback is-correct" : "feedback";

  renderLearnedTable(learnedWords);
}

function handleSetupSubmit(event) {
  event.preventDefault();

  const availableWords = getAvailableWords();
  const availableTotal = availableWords.length;
  const requestedAmount = Number.parseInt(els.wordAmountInput.value, 10);

  if (!availableTotal) {
    renderSetup();
    return;
  }

  if (!Number.isInteger(requestedAmount) || requestedAmount < 1) {
    els.setupFeedback.textContent = "Choose at least 1 word.";
    els.setupFeedback.className = "feedback is-wrong";
    shakeElement(els.wordAmountInput);
    return;
  }

  const amount = Math.min(requestedAmount, availableTotal);
  state.practiceLimit = amount;
  state.words = shuffleWords(availableWords).slice(0, amount);

  if (requestedAmount > availableTotal) {
    els.setupFeedback.textContent = `Only ${availableTotal} unlearned words are available, so this session uses ${amount}.`;
  }

  renderStudyList();
  showScreen("study");
}

function renderLearnedTable(learnedWords) {
  els.learnedCount.textContent = String(learnedWords.length);
  els.learnedTableBody.innerHTML = "";

  if (!learnedWords.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 3;
    cell.textContent = "No learned words yet.";
    row.append(cell);
    els.learnedTableBody.append(row);
    return;
  }

  learnedWords.forEach((word) => {
    const row = document.createElement("tr");
    ["puhekieli", "kirjakieli", "english"].forEach((key) => {
      const cell = document.createElement("td");
      cell.textContent = word[key] || "";
      row.append(cell);
    });
    els.learnedTableBody.append(row);
  });
}

function renderStudyList() {
  els.studyCount.textContent = `${state.words.length} words`;
  els.wordList.innerHTML = "";

  state.words.forEach((word, index) => {
    const item = document.createElement("article");
    item.className = "word-card";
    item.innerHTML = `
      <strong>${index + 1}. ${word.puhekieli}</strong>
      <span>Standard Finnish (kirjakieli): <em>${word.kirjakieli}</em></span>
      <span>English: <em>${word.english}</em></span>
    `;
    els.wordList.append(item);
  });
}

function startPractice() {
  if (!state.words.length) return;

  clearTimeout(state.timerId);
  state.currentIndex = 0;
  state.score = 0;
  state.answered = false;
  showScreen("practice");
  renderCurrentWord();
}

function renderCurrentWord() {
  const word = getCurrentWord();
  if (!word) {
    endPractice();
    return;
  }

  const progress = ((state.currentIndex + 1) / state.words.length) * 100;
  els.progressText.textContent = `${state.currentIndex + 1}/${state.words.length}`;
  els.scoreText.textContent = `Score ${state.score}`;
  els.progressBar.style.width = `${progress}%`;
  els.practiceTitle.textContent = word.kirjakieli;
  els.englishHint.textContent = word.english;
  els.answerInput.value = "";
  els.answerInput.disabled = false;
  els.answerInput.className = "";
  els.feedbackText.textContent = "";
  els.feedbackText.className = "feedback";
  els.submitButton.classList.remove("is-hidden");
  els.nextButton.classList.add("is-hidden");
  state.answered = false;

  requestAnimationFrame(() => els.answerInput.focus());
}

function handleSubmit(event) {
  event.preventDefault();
  if (state.answered) return;

  const word = getCurrentWord();
  const userAnswer = els.answerInput.value;

  if (!userAnswer.trim()) {
    showFeedback("Type your answer first.", "wrong");
    shakeInput();
    return;
  }

  if (isCorrectAnswer(userAnswer, word.puhekieli)) {
    state.score += 1;
    state.answered = true;
    saveLearnedWord(state.activeCategory.id, word);
    els.scoreText.textContent = `Score ${state.score}`;
    els.answerInput.classList.add("is-correct");
    els.answerInput.disabled = true;
    showFeedback("Nice.", "correct");
    state.timerId = setTimeout(goToNextWord, correctAnswerDelayMs);
  } else {
    state.answered = true;
    els.answerInput.classList.add("is-wrong");
    els.answerInput.disabled = true;
    showFeedback(`Good try. The answer is "${word.puhekieli}".`, "wrong");
    shakeInput();
    els.submitButton.classList.add("is-hidden");
    els.nextButton.classList.remove("is-hidden");
    els.nextButton.focus();
  }
}

function goToNextWord() {
  clearTimeout(state.timerId);
  state.currentIndex += 1;
  renderCurrentWord();
}

function endPractice() {
  const total = state.words.length;
  const percent = total ? Math.round((state.score / total) * 100) : 0;

  els.finalScore.textContent = `${state.score}/${total}`;
  els.resultMessage.textContent = getResultMessage(percent);
  saveBestScore(state.activeCategory.id, state.score, total);
  renderBestScore();
  showScreen("result");
}

function getResultMessage(percent) {
  if (percent === 100) return "Perfect round. These words are becoming familiar.";
  if (percent >= 80) return "Strong practice. Review the few that felt uncertain.";
  if (percent >= 50) return "Good progress. A second round will make many of these stick.";
  return "You completed the lesson. That matters more than getting everything right today.";
}

function showFeedback(message, type) {
  els.feedbackText.textContent = message;
  els.feedbackText.className = `feedback is-${type}`;
}

function shakeInput() {
  shakeElement(els.answerInput);
}

function shakeElement(element) {
  element.classList.remove("is-shaking");
  void element.offsetWidth;
  element.classList.add("is-shaking");
}

function showSetup() {
  clearTimeout(state.timerId);
  renderSetup();
  showScreen("setup");
}

function getAvailableWords() {
  if (!state.activeCategory) return [];

  const learnedIds = new Set(readLearnedWords(state.activeCategory.id).map((word) => word.id));
  return state.allWords.filter((word) => !learnedIds.has(getWordId(word)));
}

function shuffleWords(words) {
  const shuffled = [...words];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function clampNumber(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function saveLearnedWord(categoryId, word) {
  const learnedWords = readLearnedWords(categoryId);
  const wordId = getWordId(word);

  if (learnedWords.some((learnedWord) => learnedWord.id === wordId)) return;

  learnedWords.push({
    id: wordId,
    puhekieli: word.puhekieli,
    kirjakieli: word.kirjakieli,
    english: word.english,
    learnedAt: new Date().toISOString()
  });

  localStorage.setItem(getLearnedWordsKey(categoryId), JSON.stringify(learnedWords));
}

function readLearnedWords(categoryId = "puhekieli") {
  try {
    const saved = localStorage.getItem(getLearnedWordsKey(categoryId));
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getWordId(word) {
  return [word.puhekieli, word.kirjakieli, word.english].map(normalizeAnswer).join("|");
}

function getLearnedWordsKey(categoryId) {
  return `realfinnish.learnedWords.${categoryId}`;
}

function getCurrentWord() {
  return state.words[state.currentIndex];
}

function isCorrectAnswer(userAnswer, correctAnswer) {
  const normalizedUserAnswer = normalizeAnswer(userAnswer);
  return getAcceptedAnswers(correctAnswer).some((answer) => answer === normalizedUserAnswer);
}

function getAcceptedAnswers(answer) {
  return answer
    .split("/")
    .map((part) => normalizeAnswer(part))
    .filter(Boolean);
}

function normalizeAnswer(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,!?;:()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function saveBestScore(categoryId, score, total) {
  const key = getBestScoreKey(categoryId);
  const currentBest = readBestScore(categoryId);
  const percent = total ? score / total : 0;

  if (!currentBest || percent > currentBest.percent) {
    localStorage.setItem(
      key,
      JSON.stringify({
        score,
        total,
        percent,
        updatedAt: new Date().toISOString()
      })
    );
  }
}

function readBestScore(categoryId = "puhekieli") {
  try {
    const saved = localStorage.getItem(getBestScoreKey(categoryId));
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function renderBestScore() {
  const best = readBestScore("puhekieli");
  if (!best) {
    els.bestScoreCard.hidden = true;
    return;
  }

  els.bestScoreText.textContent = `${best.score}/${best.total}`;
  els.bestScoreCard.hidden = false;
}

function getBestScoreKey(categoryId) {
  return `realfinnish.bestScore.${categoryId}`;
}

function handleShareClick(event) {
  const platform = event.currentTarget.dataset.sharePlatform;
  const shareBlock = event.currentTarget.closest(".share-actions");
  clearShareFeedbacks();

  if (platform === "facebook") {
    shareToFacebook(shareBlock);
  }

  if (platform === "messenger") {
    shareToMessenger(shareBlock);
  }

  if (platform === "linkedin") {
    shareToLinkedIn(shareBlock);
  }
}

function shareToFacebook(shareBlock) {
  copyShareResult({ silent: true });
  openShareWindow(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`
  );
  setShareFeedback("Result copied. Facebook is opening.", "", shareBlock);
}

async function shareToMessenger(shareBlock) {
  const shareData = getShareData();

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      setShareFeedback("Shared.", "", shareBlock);
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
      console.error(error);
    }
  }

  await copyShareResult({ silent: true });
  openShareWindow("https://www.facebook.com/messages/");
  setShareFeedback("Result copied. Messenger is opening.", "", shareBlock);
}

function shareToLinkedIn(shareBlock) {
  copyShareResult({ silent: true });
  openShareWindow(
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`
  );
  setShareFeedback("Result copied. LinkedIn is opening.", "", shareBlock);
}

async function copyShareResult(options = {}) {
  const text = getShareText();

  try {
    await navigator.clipboard.writeText(text);
    if (!options.silent) setShareFeedback("Copied result.");
  } catch {
    if (!options.silent) setShareFeedback("Copy failed.", "wrong");
  }
}

function openShareWindow(url) {
  window.open(url, "_blank", "noopener,noreferrer,width=720,height=640");
}

function getShareData() {
  return {
    title: "RealFinnish",
    text: getShareText(),
    url: getShareUrl()
  };
}

function getShareText() {
  const total = state.words.length;
  return `I practiced spoken Finnish on RealFinnish and scored ${state.score}/${total}.`;
}

function getShareUrl() {
  return window.location.href;
}

function setShareFeedback(message, type = "", shareBlock = document) {
  const feedback = shareBlock.querySelector("[data-share-feedback]");
  if (!feedback) return;

  feedback.textContent = message;
  feedback.className = type ? `feedback is-${type}` : "feedback is-correct";
}

function clearShareFeedbacks() {
  els.shareFeedbacks.forEach((feedback) => {
    feedback.textContent = "";
    feedback.className = "feedback";
  });
}

function showScreen(screenName) {
  Object.entries(screens).forEach(([name, screen]) => {
    screen.classList.toggle("is-active", name === screenName);
  });

  els.backButton.classList.toggle("is-hidden", screenName === "home");

  if (screenName === "home") {
    els.screenTitle.textContent = "Learn real-life Finnish";
  }

  if (screenName === "setup" && state.activeCategory) {
    els.screenTitle.textContent = state.activeCategory.title;
  }

  if (screenName === "study" && state.activeCategory) {
    els.screenTitle.textContent = state.activeCategory.title;
  }

  if (screenName === "practice") {
    els.screenTitle.textContent = "Practice";
  }

  if (screenName === "result") {
    els.screenTitle.textContent = "Results";
  }

  window.scrollTo({ top: 0, behavior: "instant" });
}

function handleBack() {
  const activeScreen = Object.entries(screens).find(([, screen]) =>
    screen.classList.contains("is-active")
  )?.[0];

  if (activeScreen === "practice") {
    clearTimeout(state.timerId);
    showScreen("study");
    return;
  }

  if (activeScreen === "study" || activeScreen === "result") {
    showSetup();
    return;
  }

  if (activeScreen === "setup") {
    showScreen("home");
  }
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (!window.isSecureContext && window.location.hostname !== "localhost") return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.error("Service worker registration failed.", error);
    });
  });
}

init();
registerServiceWorker();
