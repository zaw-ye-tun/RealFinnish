const googleSheet = {
  csvBaseUrl:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSDvwwaprrPYJpJii_fJeG6tcqbaN6RhHel6EL5dVsRsoDL6GEwPjAD2QDdzBbuxc6CcB-DGFesbgST/pub",
  sheetGids: {
    lessons: "0",
    puhekieli: "897991474",
    puhekieli_2: "2037559126",
    helsinki_slang: "1355912983",
    language_notes: "689568316"
  }
};

const fallbackCategories = [
  {
    id: "puhekieli",
    titleKey: "categoryPuhekieliTitle",
    descriptionKey: "categoryPuhekieliDescription",
    badgeKey: "activeLesson",
    dataUrl: "data/puhekieli.json",
    enabled: true
  },
    {
    id: "puhekieli_2",
    titleKey: "categoryPuhekieli2Title",
    descriptionKey: "categoryPuhekieli2Description",
    badgeKey: "activeLesson",
    dataUrl: "data/puhekieli_2.json",
    enabled: true
  },
  {
    id: "helsinki-slang",
    titleKey: "categoryHelsinkiTitle",
    descriptionKey: "categoryHelsinkiDescription",
    badgeKey: "activeLesson",
    dataUrl: "data/helsinki_slang.json",
    enabled: true
  },
  {
    id: "workplace-finnish",
    titleKey: "categoryWorkplaceTitle",
    descriptionKey: "categoryWorkplaceDescription",
    badgeKey: "comingSoon",
    enabled: false
  }
];

let categories = [...fallbackCategories];

const correctAnswerDelayMs = 650;
const languageStorageKey = "realfinnish.language";
const defaultLanguage = "en";
const supportedLanguages = ["en", "my"];

const translations = {
  en: {
    activeLesson: "Active lesson",
    answerPlaceholder: "Type spoken Finnish...",
    availableWords: "{count} words available",
    backHome: "Back Home",
    backLabel: "Go back",
    bestScore: "Best score",
    categoryHelsinkiDescription: "131 local words and expressions used around Helsinki.",
    categoryHelsinkiTitle: "Helsinki Slang",
    categoryPuhekieli2Description: "85 common spoken Finnish words for everyday life.",
    categoryPuhekieli2Title: "Spoken Finnish 2 (puhekieli)",
    categoryPuhekieliDescription: "100 common spoken Finnish words for everyday life.",
    categoryPuhekieliTitle: "Spoken Finnish (puhekieli)",
    categoryWorkplaceDescription: "Useful Finnish for jobs, meetings, and messages.",
    categoryWorkplaceTitle: "Workplace Finnish",
    chooseAtLeastOne: "Choose at least 1 word.",
    chooseWords: "Choose Words",
    closeLabel: "Close",
    comingSoon: "Coming soon",
    copiedResult: "Copied result.",
    copyFailed: "Copy failed.",
    definitionHeader: "Meaning",
    definitionLabel: "Meaning",
    exampleLabel: "Example:",
    facebookOpening: "Result copied. Facebook is opening.",
    footerText: "© 2026 RealFinnish. All rights reserved.",
    goodTry: "Good try. The answer is \"{answer}\".",
    homeScreenTitle: "Learn real-life Finnish",
    homeTitle: "Choose a lesson",
    languageNotes: "Language notes",
    languageSelectLabel: "Select language",
    metaDescription: "RealFinnish helps beginners learn practical spoken Finnish for everyday life.",
    learnedWords: "Learned words",
    learningTopicsLabel: "Learning topics",
    lessonLoadBody: "Please open this folder through a local server or GitHub Pages.",
    lessonLoadTitle: "Lesson could not be loaded.",
    linkedinOpening: "Result copied. LinkedIn is opening.",
    messengerOpening: "Result copied. Messenger is opening.",
    noLearnedWords: "No learned words yet.",
    noWordsAvailable: "All words in this lesson are learned. Add more words to the JSON file to continue.",
    notesLoadBody: "Please check data/language-notes.json and refresh the page.",
    notesLoadTitle: "Notes could not be loaded.",
    notesLoading: "Loading notes...",
    notesTitle: "Why these labels?",
    pageTitle: "RealFinnish - Learn Spoken Finnish",
    onlyAvailable: "Only {available} unlearned words are available, so this session uses {amount}.",
    practice: "Practice",
    practiceAgain: "Practice Again",
    practiceComplete: "Practice complete",
    practiceProgressLabel: "Practice progress",
    result50: "Good progress. A second round will make many of these stick.",
    result80: "Strong practice. Review the few that felt uncertain.",
    result100: "Perfect round. These words are becoming familiar.",
    resultDefault: "You completed the lesson. That matters more than getting everything right today.",
    results: "Results",
    resultTitle: "You finished the set.",
    savedProgress: "Saved progress",
    score: "Score {score}",
    setupBody: "Already learned words are skipped automatically.",
    setupTitle: "How many words today?",
    shareAppLabel: "Share RealFinnish",
    shareProgressLabel: "Share progress",
    shareText: "I practiced spoken Finnish on RealFinnish and scored {score}/{total}.",
    shareTo: "Share to",
    shared: "Shared.",
    sourceLabel: "Source:",
    spokenFinnishHeader: "Spoken Finnish (puhekieli)",
    standardFinnishHeader: "Standard Finnish (kirjakieli)",
    standardFinnishLabel: "Standard Finnish (kirjakieli):",
    startPractice: "Start Practice",
    studyBody: "Read through the list at your own pace. Start when you feel ready.",
    studyTitle: "Study first, then practice.",
    submit: "Submit",
    next: "Next",
    nice: "Nice.",
    typeAnswerFirst: "Type your answer first.",
    whyButton: "Why?",
    words: "{count} words",
    wordsToLearn: "Words to learn",
    answerPlaceholderFinnish: "Type Finnish...",
    writeFinnish: "Write the Finnish word",
    writeSpokenFinnish: "Write the spoken Finnish",
    yourAnswer: "Your answer"
  },
  my: {
    activeLesson: "လက်ရှိ သင်ခန်းစာ",
    answerPlaceholder: "စကားပြော Finnish ကို ရိုက်ပါ...",
    availableWords: "စကားလုံး {count} လုံး ရနိုင်သည်",
    backHome: "မူလစာမျက်နှာသို့",
    backLabel: "နောက်သို့ ပြန်ရန်",
    bestScore: "အကောင်းဆုံး ရမှတ်",
    categoryHelsinkiDescription: "Helsinki တွင် သုံးသော ဒေသခံ စကားလုံးနှင့် အသုံးအနှုန်း ၁၃၁ ခု။",
    categoryHelsinkiTitle: "Helsinki Slang",
    categoryPuhekieli2Description: "နေ့စဉ်ဘဝအတွက် အသုံးများသော စကားပြော Finnish စကားလုံး ၈၅ လုံး။",
    categoryPuhekieli2Title: "စကားပြော Finnish ၂ (puhekieli)",
    categoryPuhekieliDescription: "နေ့စဉ်ဘဝအတွက် အသုံးများသော စကားပြော Finnish စကားလုံး ၁၀၀ လုံး။",
    categoryPuhekieliTitle: "စကားပြော Finnish (puhekieli)",
    categoryWorkplaceDescription: "အလုပ်၊ အစည်းအဝေးနှင့် မက်ဆေ့ချ်များအတွက် အသုံးဝင်သော Finnish။",
    categoryWorkplaceTitle: "အလုပ်ခွင် Finnish",
    chooseAtLeastOne: "အနည်းဆုံး စကားလုံး ၁ လုံး ရွေးပါ။",
    chooseWords: "လေ့လာမည်။",
    closeLabel: "ပိတ်ရန်",
    comingSoon: "မကြာမီလာမည်",
    copiedResult: "ရလဒ်ကို ကူးယူပြီးပါပြီ။",
    copyFailed: "ကူးယူ၍ မရပါ။",
    definitionHeader: "မြန်မာ",
    definitionLabel: "မြန်မာ",
    exampleLabel: "ဥပမာ:",
    facebookOpening: "ရလဒ်ကို ကူးယူပြီး Facebook ဖွင့်နေသည်။",
    footerText: "© 2026 RealFinnish. မူပိုင်ခွင့်အားလုံး ထိန်းသိမ်းထားသည်။",
    goodTry: "ကြိုးစားမှု ကောင်းပါတယ်။ အဖြေမှန်မှာ \"{answer}\" ဖြစ်သည်။",
    homeScreenTitle: "လက်တွေ့ Finnish ကို လေ့လာရအောင်",
    homeTitle: "သင်ခန်းစာ ရွေးပါ။",
    languageNotes: "ဘာသာစကား မှတ်စုများ",
    languageSelectLabel: "ဘာသာစကား ရွေးရန်",
    metaDescription: "RealFinnish သည် စတင်လေ့လာသူများအတွက် နေ့စဉ်ဘဝတွင် အသုံးဝင်သော စကားပြော Finnish ကို လေ့လာရန် ကူညီသည်။",
    learnedWords: "သင်သိပြီးသော စကားလုံးများ",
    learningTopicsLabel: "သင်ယူရန် ခေါင်းစဉ်များ",
    lessonLoadBody: "ဤ folder ကို local server သို့မဟုတ် GitHub Pages မှတဆင့် ဖွင့်ပါ။",
    lessonLoadTitle: "သင်ခန်းစာကို ဖွင့်မရပါ။",
    linkedinOpening: "ရလဒ်ကို ကူးယူပြီး LinkedIn ဖွင့်နေသည်။",
    messengerOpening: "ရလဒ်ကို ကူးယူပြီး Messenger ဖွင့်နေသည်။",
    noLearnedWords: "သင်ပြီးသော စကားလုံး မရှိသေးပါ။",
    noWordsAvailable: "ဤသင်ခန်းစာရှိ စကားလုံးများအားလုံး သင်ပြီးပါပြီ။",
    notesLoadBody: "data/language-notes.json ကို စစ်ဆေးပြီး စာမျက်နှာကို ပြန်ဖွင့်ပါ။",
    notesLoadTitle: "မှတ်စုများကို ဖွင့်မရပါ။",
    notesLoading: "မှတ်စုများ ဖွင့်နေသည်...",
    notesTitle: "ဒီစကားလုံးတွေကို ဘာကြောင့် ဘယ်လိုနေရာတွေမှာ သုံးထားတာလဲ",
    pageTitle: "RealFinnish - စကားပြော Finnish လေ့လာရန်",
    onlyAvailable: "မသင်ရသေးသော စကားလုံး {available} လုံးသာ ရနိုင်သဖြင့် ဤ session တွင် {amount} လုံး သုံးပါမည်။",
    practice: "လေ့ကျင့်ရန်",
    practiceAgain: "ထပ်လေ့ကျင့်ရန်",
    practiceComplete: "လေ့ကျင့်မှု ပြီးဆုံးပြီ",
    practiceProgressLabel: "လေ့ကျင့်မှု တိုးတက်မှု",
    result50: "တိုးတက်မှု ကောင်းပါတယ်။ နောက်တစ်ကြိမ် လေ့ကျင့်ရင် ပိုမှတ်မိလာပါမည်။",
    result80: "လေ့ကျင့်မှု ခိုင်မာပါတယ်။ မသေချာသေးတဲ့ စကားလုံးအနည်းငယ်ကို ပြန်ကြည့်ပါ။",
    result100: "အပြည့်မှန်ပါတယ်။ ဒီစကားလုံးတွေကို ပိုရင်းနှီးလာပါပြီ။",
    resultDefault: "သင်ခန်းစာကို ပြီးအောင် လုပ်နိုင်ခဲ့ပါတယ်။ အားလုံးမှန်ခြင်းထက် လေ့ကျင့်နေဖို့က ပိုအရေးကြီးပါတယ်။",
    results: "ရလဒ်များ",
    resultTitle: "ဤ လေ့ကျင့်မှု ပြီးဆုံးပါပြီ။",
    savedProgress: "သိမ်းထားသော တိုးတက်မှု",
    score: "ရမှတ် {score}",
    setupBody: "သင်လေ့ကျင့်ပြီးသော စကားလုံးများကို အလိုအလျောက် ကျော်သွားပါမည်။",
    setupTitle: "ဒီနေ့ စကားလုံး ဘယ်လောက် လေ့လာမလဲ။",
    shareAppLabel: "RealFinnish ကို မျှဝေရန်",
    shareProgressLabel: "တိုးတက်မှု မျှဝေရန်",
    shareText: "RealFinnish တွင် စကားပြော Finnish လေ့ကျင့်ပြီး {score}/{total} ရခဲ့သည်။",
    shareTo: "မျှဝေရန်",
    shared: "မျှဝေပြီးပါပြီ။",
    sourceLabel: "ရင်းမြစ်:",
    spokenFinnishHeader: "စကားပြော Finnish (puhekieli)",
    standardFinnishHeader: "စံ Finnish (kirjakieli)",
    standardFinnishLabel: "စံ Finnish (kirjakieli):",
    startPractice: "လေ့ကျင့်မှု စရန်",
    studyBody: "ဖြေးဖြေးဖတ်ပါ။ မှတ်ပါ။ အဆင်သင့်ဖြစ်ရင် စတင်ပါ။",
    studyTitle: "အရင်လေ့လာပြီး နောက်မှ လေ့ကျင့်ပါ။",
    submit: "စစ်ပါ",
    next: "နောက်တစ်ခု",
    nice: "ကောင်းပါတယ်။",
    typeAnswerFirst: "အဖြေကို အရင် ရိုက်ပါ။",
    whyButton: "ဘာကြောင့်?",
    words: "စကားလုံး {count} လုံး",
    wordsToLearn: "လေ့လာမည့် စကားလုံး",
    answerPlaceholderFinnish: "Finnish ကို ရိုက်ပါ...",
    writeFinnish: "Finnish ကို ရေးပါ",
    writeSpokenFinnish: "စကားပြော Finnish ကို ရေးပါ",
    yourAnswer: "သင့်အဖြေ"
  }
};

const state = {
  activeCategory: null,
  allWords: [],
  words: [],
  languageNotes: null,
  language: getInitialLanguage(),
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
  languageButton: document.querySelector("#languageButton"),
  languageOptions: document.querySelector("#languageOptions"),
  languageOptionButtons: document.querySelectorAll("[data-language-option]"),
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
  practicePrompt: document.querySelector("#practicePrompt"),
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
  applyTranslations();
  renderCategories();
  renderBestScore();
  bindEvents();
  showScreen("home");
  loadCategoriesFromSheet()
    .then((sheetCategories) => {
      if (!sheetCategories.length) return;
      categories = sheetCategories;
      renderCategories();
      renderBestScore();
    })
    .catch((error) => {
      console.error("Google Sheets lesson index could not be loaded.", error);
    });
}

function bindEvents() {
  els.backButton.addEventListener("click", handleBack);
  els.whyButton.addEventListener("click", openLanguageNotes);
  els.languageButton.addEventListener("click", toggleLanguageMenu);
  els.languageOptionButtons.forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.languageOption));
  });
  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("keydown", handleDocumentKeydown);
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

async function loadCategoriesFromSheet() {
  const rows = await fetchSheetRowsByGid(googleSheet.sheetGids.lessons);

  return rows
    .filter((row) => row.id)
    .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
    .map((row) => {
      const sheetName = row.sheet_name?.trim();

      return {
        id: row.id.trim(),
        titleKey: row.title_key?.trim(),
        descriptionKey: row.description_key?.trim(),
        badgeKey: row.badge_key?.trim(),
        title: {
          en: row.title_en?.trim(),
          my: row.title_my?.trim()
        },
        description: {
          en: row.description_en?.trim(),
          my: row.description_my?.trim()
        },
        badge: {
          en: row.badge_en?.trim(),
          my: row.badge_my?.trim()
        },
        sheetName,
        gid: row.gid?.trim() || googleSheet.sheetGids[sheetName],
        dataUrl: row.current_data_url?.trim() || row.source_file?.trim(),
        enabled: parseBoolean(row.enabled)
      };
    });
}

function getInitialLanguage() {
  try {
    const savedLanguage = localStorage.getItem(languageStorageKey);
    return supportedLanguages.includes(savedLanguage) ? savedLanguage : defaultLanguage;
  } catch {
    return defaultLanguage;
  }
}

function parseBoolean(value) {
  return ["true", "yes", "1"].includes(String(value || "").trim().toLowerCase());
}

function getLocalizedValue(value, fallbackKey) {
  if (!value) return fallbackKey ? t(fallbackKey) : "";
  if (typeof value === "string") return value;
  return value[state.language] || value[defaultLanguage] || "";
}

function getSheetCsvUrl(gid) {
  const url = new URL(googleSheet.csvBaseUrl);
  url.searchParams.set("gid", gid);
  url.searchParams.set("single", "true");
  url.searchParams.set("output", "csv");
  url.searchParams.set("v", String(Date.now()));
  return url.toString();
}

async function fetchSheetRowsByGid(gid) {
  if (!gid) throw new Error("Missing Google Sheet gid.");

  const response = await fetch(getSheetCsvUrl(gid), { cache: "no-store" });
  if (!response.ok) throw new Error(`Could not load Google Sheet gid ${gid}.`);

  return csvToRows(await response.text());
}

function csvToRows(csvText) {
  const table = parseCsv(csvText.replace(/^\uFEFF/, ""));
  if (!table.length) return [];

  const headers = table[0].map((header) => header.trim());

  return table.slice(1).map((row) =>
    headers.reduce((record, header, index) => {
      record[header] = row[index] || "";
      return record;
    }, {})
  );
}

function parseCsv(csvText) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let index = 0; index < csvText.length; index += 1) {
    const char = csvText[index];
    const nextChar = csvText[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        value += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(value);
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") index += 1;
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
      continue;
    }

    value += char;
  }

  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }

  return rows.filter((items) => items.some((item) => item.trim()));
}

function t(key, replacements = {}) {
  const languageText = translations[state.language]?.[key];
  const fallbackText = translations[defaultLanguage][key] || key;
  const template = languageText || fallbackText;

  return Object.entries(replacements).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template
  );
}

function applyTranslations() {
  document.documentElement.lang = state.language;
  document.title = t("pageTitle");
  document.querySelector('meta[name="description"]')?.setAttribute("content", t("metaDescription"));

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
  });

  updateLanguageMenuState();
}

function setLanguage(language) {
  if (!supportedLanguages.includes(language) || language === state.language) {
    closeLanguageMenu();
    return;
  }

  state.language = language;
  try {
    localStorage.setItem(languageStorageKey, language);
  } catch {
    // Ignore storage errors; the language still updates for this session.
  }
  applyTranslations();
  renderCategories();
  renderBestScore();
  renderCurrentScreenText();
  closeLanguageMenu();
}

function toggleLanguageMenu(event) {
  event.stopPropagation();
  const isOpen = !els.languageOptions.classList.contains("is-hidden");

  if (isOpen) {
    closeLanguageMenu();
    return;
  }

  els.languageOptions.classList.remove("is-hidden");
  els.languageButton.setAttribute("aria-expanded", "true");
}

function closeLanguageMenu() {
  els.languageOptions.classList.add("is-hidden");
  els.languageButton.setAttribute("aria-expanded", "false");
}

function updateLanguageMenuState() {
  els.languageOptionButtons.forEach((button) => {
    button.setAttribute("aria-checked", String(button.dataset.languageOption === state.language));
  });
}

function handleDocumentClick(event) {
  if (!els.languageOptions.contains(event.target) && event.target !== els.languageButton) {
    closeLanguageMenu();
  }
}

function handleDocumentKeydown(event) {
  if (event.key === "Escape") closeLanguageMenu();
}

function renderCurrentScreenText() {
  const activeScreen = getActiveScreenName();

  if (activeScreen === "setup" && state.activeCategory) renderSetup();
  if (activeScreen === "study" && state.words.length) renderStudyList();
  if (activeScreen === "practice" && state.words.length) renderCurrentWord({ keepAnswer: true });
  if (activeScreen === "result") {
    const total = state.words.length;
    const percent = total ? Math.round((state.score / total) * 100) : 0;
    els.resultMessage.textContent = getResultMessage(percent);
  }

  if (els.notesDialog.open && state.languageNotes) {
    renderLanguageNotes(state.languageNotes);
  }

  showScreen(activeScreen || "home");
}

async function openLanguageNotes() {
  els.notesList.innerHTML = `
    <article class="note-card">
      <p>${t("notesLoading")}</p>
    </article>
  `;
  els.notesDialog.showModal();

  try {
    if (!state.languageNotes) {
      state.languageNotes = await loadLanguageNotes();
    }

    renderLanguageNotes(state.languageNotes);
  } catch (error) {
    els.notesList.innerHTML = `
      <article class="note-card">
        <h3>${t("notesLoadTitle")}</h3>
        <p>${t("notesLoadBody")}</p>
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
    const localizedNote = getLocalizedNote(note);
    item.innerHTML = `
      <h3>${localizedNote.title}</h3>
      <p>${localizedNote.body}</p>
      <p><strong>${t("exampleLabel")}</strong> <code>${localizedNote.example || note.example}</code></p>
      <a href="${note.sourceUrl}" target="_blank" rel="noreferrer">${t("sourceLabel")} ${note.sourceName}</a>
    `;
    els.notesList.append(item);
  });
}

function getLocalizedNote(note) {
  return note.translations?.[state.language] || {
    title: note.title,
    body: note.body,
    example: note.example
  };
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

    const title = document.createElement("h3");
    title.textContent = getCategoryTitle(category);
    const description = document.createElement("p");
    description.textContent = getCategoryDescription(category);
    const badge = document.createElement("span");
    badge.className = "pill";
    badge.textContent = getCategoryBadge(category);
    button.append(title, description, badge);

    if (category.enabled) {
      button.addEventListener("click", () => loadCategory(category.id));
    }

    els.categoryList.append(button);
  });
}

function getCategoryTitle(category) {
  return getLocalizedValue(category.title, category.titleKey);
}

function getCategoryDescription(category) {
  return getLocalizedValue(category.description, category.descriptionKey);
}

function getCategoryBadge(category) {
  return getLocalizedValue(category.badge, category.badgeKey);
}

async function loadCategory(categoryId) {
  const category = categories.find((item) => item.id === categoryId);
  if (!category || !category.enabled) return;

  state.activeCategory = category;
  els.screenTitle.textContent = getCategoryTitle(category);

  try {
    state.allWords = await loadCategoryWords(category);
    state.words = [];
    renderSetup();
    showScreen("setup");
  } catch (error) {
    els.wordList.innerHTML = `
      <div class="word-card">
        <strong>${t("lessonLoadTitle")}</strong>
        <span>${t("lessonLoadBody")}</span>
      </div>
    `;
    showScreen("study");
    console.error(error);
  }
}

async function loadLanguageNotes() {
  try {
    const rows = await fetchSheetRowsByGid(googleSheet.sheetGids.language_notes);
    return sheetRowsToLanguageNotes(rows);
  } catch (error) {
    console.error("Google Sheets language notes could not be loaded.", error);
  }

  const response = await fetch("data/language-notes.json");
  if (!response.ok) throw new Error("Could not load language notes.");
  return response.json();
}

function sheetRowsToLanguageNotes(rows) {
  return rows
    .filter((row) => row.title_en || row.body_en)
    .map((row) => ({
      title: row.title_en?.trim() || "",
      body: row.body_en?.trim() || "",
      example: row.example_en?.trim() || "",
      sourceName: row.source_name?.trim() || "",
      sourceUrl: row.source_url?.trim() || "",
      translations: {
        my: {
          title: row.title_my?.trim() || "",
          body: row.body_my?.trim() || "",
          example: row.example_my?.trim() || ""
        }
      }
    }));
}

async function loadCategoryWords(category) {
  if (category.gid) {
    return sheetRowsToWords(await fetchSheetRowsByGid(category.gid));
  }

  if (!category.dataUrl) throw new Error(`Missing lesson source for ${category.id}.`);

  const response = await fetch(category.dataUrl);
  if (!response.ok) throw new Error(`Could not load ${category.dataUrl}`);

  return response.json();
}

function sheetRowsToWords(rows) {
  return rows
    .filter((row) => row.puhekieli || row.kirjakieli || row.english || row.my)
    .map((row) => {
      const word = {
        puhekieli: row.puhekieli?.trim() || "",
        kirjakieli: row.kirjakieli?.trim() || "",
        english: row.english?.trim() || "",
        definitions: {
          my: row.my?.trim() || ""
        }
      };

      if (row.category?.trim()) word.category = row.category.trim();
      return word;
    });
}

function renderSetup() {
  const availableWords = getAvailableWords();
  const learnedWords = readLearnedWords(state.activeCategory.id);
  const availableTotal = availableWords.length;
  const defaultAmount = clampNumber(state.practiceLimit, 1, Math.max(availableTotal, 1));

  els.availableCount.textContent = t("availableWords", { count: availableTotal });
  els.wordAmountInput.max = String(Math.max(availableTotal, 1));
  els.wordAmountInput.value = String(defaultAmount);
  els.wordAmountInput.disabled = availableTotal === 0;
  els.chooseWordsButton.disabled = availableTotal === 0;
  els.setupFeedback.textContent =
    availableTotal === 0
      ? t("noWordsAvailable")
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
    els.setupFeedback.textContent = t("chooseAtLeastOne");
    els.setupFeedback.className = "feedback is-wrong";
    shakeElement(els.wordAmountInput);
    return;
  }

  const amount = Math.min(requestedAmount, availableTotal);
  state.practiceLimit = amount;
  state.words = shuffleWords(availableWords).slice(0, amount);

  if (requestedAmount > availableTotal) {
    els.setupFeedback.textContent = t("onlyAvailable", {
      available: availableTotal,
      amount
    });
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
    cell.textContent = t("noLearnedWords");
    row.append(cell);
    els.learnedTableBody.append(row);
    return;
  }

  learnedWords.forEach((word) => {
    const row = document.createElement("tr");
    const definitionCell = document.createElement("td");
    const hasDifferentForms = hasRegisterDifference(word);

    definitionCell.textContent = getWordDefinition(word);

    if (hasDifferentForms) {
      const spokenCell = document.createElement("td");
      const standardCell = document.createElement("td");

      spokenCell.textContent = getFinnishTarget(word);
      standardCell.textContent = word.kirjakieli || "";
      row.append(spokenCell, standardCell, definitionCell);
    } else {
      const finnishCell = document.createElement("td");

      finnishCell.colSpan = 2;
      finnishCell.className = "is-merged-finnish";
      finnishCell.textContent = getFinnishTarget(word);
      row.append(finnishCell, definitionCell);
    }

    els.learnedTableBody.append(row);
  });
}

function renderStudyList() {
  els.studyCount.textContent = t("words", { count: state.words.length });
  els.wordList.innerHTML = "";

  state.words.forEach((word, index) => {
    const item = document.createElement("article");
    item.className = "word-card";

    const title = document.createElement("strong");
    title.textContent = `${index + 1}. ${getFinnishTarget(word)}`;
    item.append(title);

    if (hasRegisterDifference(word)) {
      const standard = document.createElement("span");
      const standardValue = document.createElement("em");
      standard.append(t("standardFinnishLabel"), " ");
      standardValue.textContent = word.kirjakieli;
      standard.append(standardValue);
      item.append(standard);
    }

    const definition = document.createElement("span");
    const definitionValue = document.createElement("em");
    definition.append(`${t("definitionLabel")}: `);
    definitionValue.textContent = getWordDefinition(word);
    definition.append(definitionValue);
    item.append(definition);

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

function renderCurrentWord(options = {}) {
  const word = getCurrentWord();
  if (!word) {
    endPractice();
    return;
  }

  const progress = ((state.currentIndex + 1) / state.words.length) * 100;
  els.progressText.textContent = `${state.currentIndex + 1}/${state.words.length}`;
  els.scoreText.textContent = t("score", { score: state.score });
  els.progressBar.style.width = `${progress}%`;
  els.practicePrompt.textContent = getPracticePromptLabel(word);
  els.practiceTitle.textContent = getPracticeCue(word);
  els.englishHint.textContent = getPracticeHint(word);
  els.answerInput.placeholder = getAnswerPlaceholder(word);
  if (options.keepAnswer) return;

  if (!options.keepAnswer) els.answerInput.value = "";
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
    showFeedback(t("typeAnswerFirst"), "wrong");
    shakeInput();
    return;
  }

  const correctAnswer = getFinnishTarget(word);

  if (isCorrectAnswer(userAnswer, correctAnswer)) {
    state.score += 1;
    state.answered = true;
    saveLearnedWord(state.activeCategory.id, word);
    els.scoreText.textContent = t("score", { score: state.score });
    els.answerInput.classList.add("is-correct");
    els.answerInput.disabled = true;
    showFeedback(t("nice"), "correct");
    state.timerId = setTimeout(goToNextWord, correctAnswerDelayMs);
  } else {
    state.answered = true;
    els.answerInput.classList.add("is-wrong");
    els.answerInput.disabled = true;
    showFeedback(t("goodTry", { answer: correctAnswer }), "wrong");
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
  if (percent === 100) return t("result100");
  if (percent >= 80) return t("result80");
  if (percent >= 50) return t("result50");
  return t("resultDefault");
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
    definitions: word.definitions || {},
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

function getWordDefinition(word) {
  return word.definitions?.[state.language] || word.english || "";
}

function getFinnishTarget(word) {
  return word.puhekieli || word.kirjakieli || "";
}

function hasRegisterDifference(word) {
  const spoken = normalizeAnswer(word.puhekieli || "");
  const standard = normalizeAnswer(word.kirjakieli || "");

  if (!spoken || !standard) return false;
  return spoken !== standard;
}

function getPracticePromptLabel(word) {
  return hasRegisterDifference(word) ? t("writeSpokenFinnish") : t("writeFinnish");
}

function getAnswerPlaceholder(word) {
  return hasRegisterDifference(word) ? t("answerPlaceholder") : t("answerPlaceholderFinnish");
}

function getPracticeCue(word) {
  if (hasRegisterDifference(word)) {
    return word.kirjakieli || getWordDefinition(word) || getFinnishTarget(word);
  }

  return getWordDefinition(word) || word.english || getFinnishTarget(word);
}

function getPracticeHint(word) {
  if (hasRegisterDifference(word)) return getWordDefinition(word);

  const definition = getWordDefinition(word);
  if (state.language !== defaultLanguage && word.english && normalizeAnswer(word.english) !== normalizeAnswer(definition)) {
    return word.english;
  }

  return "";
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
  setShareFeedback(t("facebookOpening"), "", shareBlock);
}

async function shareToMessenger(shareBlock) {
  const shareData = getShareData();

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      setShareFeedback(t("shared"), "", shareBlock);
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
      console.error(error);
    }
  }

  await copyShareResult({ silent: true });
  openShareWindow("https://www.facebook.com/messages/");
  setShareFeedback(t("messengerOpening"), "", shareBlock);
}

function shareToLinkedIn(shareBlock) {
  copyShareResult({ silent: true });
  openShareWindow(
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`
  );
  setShareFeedback(t("linkedinOpening"), "", shareBlock);
}

async function copyShareResult(options = {}) {
  const text = getShareText();

  try {
    await navigator.clipboard.writeText(text);
    if (!options.silent) setShareFeedback(t("copiedResult"));
  } catch {
    if (!options.silent) setShareFeedback(t("copyFailed"), "wrong");
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
  return t("shareText", { score: state.score, total });
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
    els.screenTitle.textContent = t("homeScreenTitle");
  }

  if (screenName === "setup" && state.activeCategory) {
    els.screenTitle.textContent = getCategoryTitle(state.activeCategory);
  }

  if (screenName === "study" && state.activeCategory) {
    els.screenTitle.textContent = getCategoryTitle(state.activeCategory);
  }

  if (screenName === "practice") {
    els.screenTitle.textContent = t("practice");
  }

  if (screenName === "result") {
    els.screenTitle.textContent = t("results");
  }

  window.scrollTo({ top: 0, behavior: "instant" });
}

function handleBack() {
  const activeScreen = getActiveScreenName();

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

function getActiveScreenName() {
  return Object.entries(screens).find(([, screen]) => screen.classList.contains("is-active"))?.[0];
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
