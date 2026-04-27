const manifestUrl = "subjects/index.json";
const fallbackSubjectUrl = "subjects/medicina_generale.json";
const jsonFetchTimeoutMs = 8000;

const elements = {
  loadingStatus: document.getElementById("caricamento-stato"),
  setupEmpty: document.getElementById("setup-empty"),
  subjectSelect: document.getElementById("subject-select"),
  topicSelect: document.getElementById("topic-select"),
  startQuizButton: document.getElementById("start-quiz"),
  quizSection: document.getElementById("quiz-section"),
  resultsSection: document.getElementById("results-section"),
  questionCount: document.getElementById("question-count"),
  scorePreview: document.getElementById("score-preview"),
  progressFill: document.getElementById("progress-fill"),
  subjectTag: document.getElementById("subject-tag"),
  topicTag: document.getElementById("topic-tag"),
  questionText: document.getElementById("question-text"),
  optionsList: document.getElementById("options-list"),
  feedbackPanel: document.getElementById("feedback-panel"),
  feedbackLabel: document.getElementById("feedback-label"),
  feedbackMessage: document.getElementById("feedback-message"),
  confirmAnswer: document.getElementById("confirm-answer"),
  nextQuestion: document.getElementById("next-question"),
  restartQuiz: document.getElementById("restart-quiz"),
  newQuiz: document.getElementById("new-quiz"),
  resultScore: document.getElementById("result-score"),
  resultPercent: document.getElementById("result-percent"),
  resultWrong: document.getElementById("result-wrong"),
  resultContext: document.getElementById("result-context"),
  topicErrorList: document.getElementById("topic-error-list"),
  reviewList: document.getElementById("review-list"),
};

const state = {
  subjects: [],
  currentQuiz: null,
  currentIndex: 0,
  selectedOption: null,
  locked: false,
  results: [],
};

init().catch((error) => {
  console.error(error);
  elements.loadingStatus.textContent = "Impossibile caricare i quiz";
  elements.setupEmpty.innerHTML = buildLoadErrorMessage(error);
});

async function init() {
  if (isFileProtocol()) {
    throw new Error("FILE_PROTOCOL_NOT_SUPPORTED");
  }

  const manifest = await loadManifest();
  const subjectFiles = normalizeManifest(manifest);
  const subjects = [];

  for (const entry of subjectFiles) {
    const data = await fetchJson(entry.file);
    subjects.push(normalizeSubjectData(data, entry));
  }

  state.subjects = subjects;
  populateSubjects();
  elements.loadingStatus.textContent = `${subjects.length} ${subjects.length === 1 ? "materia pronta" : "materie pronte"}`;
  elements.setupEmpty.classList.add("hidden");
  elements.subjectSelect.disabled = false;
  elements.topicSelect.disabled = false;
  elements.startQuizButton.disabled = false;
  bindEvents();
  updateTopics();
}

async function loadManifest() {
  try {
    return await fetchJson(manifestUrl);
  } catch (error) {
    return {
      subjects: [
        {
          file: fallbackSubjectUrl,
        },
      ],
    };
  }
}

function normalizeManifest(manifest) {
  if (Array.isArray(manifest)) {
    return manifest;
  }

  if (Array.isArray(manifest?.subjects)) {
    return manifest.subjects;
  }

  return [
    {
      file: fallbackSubjectUrl,
    },
  ];
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, jsonFetchTimeoutMs);

  let response;
  try {
    response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error(`Timeout durante il caricamento di ${url}`);
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error(`Impossibile caricare ${url}`);
  }

  return response.json();
}

function normalizeSubjectData(data, entry = {}) {
  const subjectName = entry.label || data.materia || entry.name || "Materia";
  const topics = Array.isArray(data.argomenti) ? data.argomenti : [];

  return {
    name: subjectName,
    file: entry.file || fallbackSubjectUrl,
    topics: topics.map((topic) => ({
      name: topic.argomento || "Argomento",
      questions: Array.isArray(topic.domande)
        ? topic.domande.map((question) => ({
            subject: subjectName,
            topic: topic.argomento || "Argomento",
            text: question.testo || "Domanda senza testo",
            options: Array.isArray(question.opzioni) ? question.opzioni : [],
            correctAnswer: question.risposta_corretta || "",
          }))
        : [],
    })),
  };
}

function populateSubjects() {
  elements.subjectSelect.innerHTML = state.subjects
    .map((subject, index) => `<option value="${index}">${subject.name}</option>`)
    .join("");
}

function populateTopics(subjectIndex) {
  const subject = state.subjects[subjectIndex];
  const options = [
    '<option value="all">Tutti gli argomenti</option>',
    ...subject.topics.map((topic, index) => `<option value="${index}">${topic.name}</option>`),
  ];

  elements.topicSelect.innerHTML = options.join("");
}

function bindEvents() {
  elements.subjectSelect.addEventListener("change", () => {
    updateTopics();
  });

  elements.startQuizButton.addEventListener("click", startQuiz);
  elements.confirmAnswer.addEventListener("click", confirmAnswer);
  elements.nextQuestion.addEventListener("click", goToNextQuestion);
  elements.restartQuiz.addEventListener("click", startQuiz);
  elements.newQuiz.addEventListener("click", () => {
    scrollToTop();
    startQuiz();
  });

  elements.optionsList.addEventListener("click", handleOptionClick);
}

function updateTopics() {
  const subjectIndex = Number(elements.subjectSelect.value || 0);
  populateTopics(subjectIndex);
}

function startQuiz() {
  const subjectIndex = Number(elements.subjectSelect.value || 0);
  const subject = state.subjects[subjectIndex];
  const topicChoice = elements.topicSelect.value;
  const selectedQuestions = collectQuestions(subject, topicChoice);

  if (!selectedQuestions.length) {
    window.alert("La materia selezionata non contiene domande per l'argomento scelto.");
    return;
  }

  state.currentQuiz = {
    subject,
    topicChoice,
    questions: shuffle(selectedQuestions).map((question) => ({
      ...question,
      options: shuffle(question.options),
    })),
  };
  state.currentIndex = 0;
  state.results = [];
  state.selectedOption = null;
  state.locked = false;

  elements.resultsSection.classList.add("hidden");
  elements.quizSection.classList.remove("hidden");
  elements.feedbackPanel.classList.add("hidden");
  renderQuestion();
  scrollToQuiz();
}

function collectQuestions(subject, topicChoice) {
  if (topicChoice === "all") {
    return subject.topics.flatMap((topic) => topic.questions);
  }

  const topic = subject.topics[Number(topicChoice)];
  return topic?.questions || [];
}

function renderQuestion() {
  const current = state.currentQuiz.questions[state.currentIndex];
  state.selectedOption = null;
  state.locked = false;
  elements.feedbackPanel.classList.add("hidden");
  elements.confirmAnswer.classList.remove("hidden");
  elements.nextQuestion.classList.add("hidden");
  elements.confirmAnswer.disabled = true;
  elements.optionsList.innerHTML = "";
  elements.subjectTag.textContent = current.subject;
  elements.topicTag.textContent = current.topic;
  elements.questionText.textContent = current.text;
  elements.questionCount.textContent = `Domanda ${state.currentIndex + 1} di ${state.currentQuiz.questions.length}`;
  elements.scorePreview.textContent = `${state.results.filter((result) => result.isCorrect).length} corrette`;
  elements.progressFill.style.width = `${(state.currentIndex / state.currentQuiz.questions.length) * 100}%`;

  current.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    button.textContent = option;
    button.dataset.option = option;
    button.dataset.index = String(index);
    button.setAttribute("aria-pressed", "false");
    elements.optionsList.appendChild(button);
  });
}

function handleOptionClick(event) {
  const target = event.target.closest(".option");
  if (!target || state.locked) {
    return;
  }

  state.selectedOption = target.dataset.option;
  elements.confirmAnswer.disabled = false;

  Array.from(elements.optionsList.querySelectorAll(".option")).forEach((button) => {
    button.classList.toggle("is-selected", button === target);
    button.setAttribute("aria-pressed", button === target ? "true" : "false");
  });
}

function confirmAnswer() {
  if (!state.selectedOption || state.locked) {
    return;
  }

  const current = state.currentQuiz.questions[state.currentIndex];
  const correct = current.correctAnswer;
  const isCorrect = state.selectedOption === correct;

  state.locked = true;
  state.results.push({
    question: current.text,
    topic: current.topic,
    subject: current.subject,
    selected: state.selectedOption,
    correct,
    isCorrect,
  });

  Array.from(elements.optionsList.querySelectorAll(".option")).forEach((button) => {
    button.disabled = true;
    const option = button.dataset.option;
    button.classList.toggle("is-correct", option === correct);
    button.classList.toggle("is-wrong", option === state.selectedOption && !isCorrect);
  });

  elements.feedbackPanel.classList.remove("hidden");
  elements.feedbackLabel.textContent = isCorrect ? "Risposta corretta" : "Risposta errata";
  elements.feedbackLabel.style.color = isCorrect ? "var(--success)" : "var(--danger)";
  elements.feedbackMessage.textContent = isCorrect
    ? "Hai selezionato la risposta giusta."
    : `La risposta corretta era: ${correct}.`;
  elements.confirmAnswer.classList.add("hidden");
  elements.nextQuestion.classList.remove("hidden");
  elements.nextQuestion.textContent = state.currentIndex === state.currentQuiz.questions.length - 1 ? "Vedi risultato finale" : "Prossima domanda";
  elements.scorePreview.textContent = `${state.results.filter((result) => result.isCorrect).length} corrette`;
}

function goToNextQuestion() {
  if (state.currentIndex >= state.currentQuiz.questions.length - 1) {
    showResults();
    return;
  }

  state.currentIndex += 1;
  renderQuestion();
  scrollToQuiz();
}

function showResults() {
  const total = state.currentQuiz.questions.length;
  const correctAnswers = state.results.filter((result) => result.isCorrect).length;
  const wrongAnswers = total - correctAnswers;
  const percent = total === 0 ? 0 : Math.round((correctAnswers / total) * 100);
  const subject = state.currentQuiz.subject.name;
  const topicChoice = state.currentQuiz.topicChoice;
  const topicLabel = topicChoice === "all" ? "tutti gli argomenti" : state.currentQuiz.subject.topics[Number(topicChoice)]?.name || "argomento selezionato";

  elements.quizSection.classList.add("hidden");
  elements.resultsSection.classList.remove("hidden");

  elements.resultScore.textContent = `${correctAnswers}/${total}`;
  elements.resultPercent.textContent = `${percent}%`;
  elements.resultWrong.textContent = `${wrongAnswers} risposte errate`;
  elements.resultContext.textContent = `Hai svolto un quiz di ${total} domande su ${subject}, concentrandoti su ${topicLabel}. Il riepilogo qui sotto evidenzia le risposte da ripassare.`;

  const mistakes = state.results.filter((result) => !result.isCorrect);
  const topicColors = buildTopicColorMap(mistakes);
  renderTopicErrorSummary(mistakes, topicColors);
  renderReviewList(mistakes, topicColors);
  scrollToResults();
}

function renderTopicErrorSummary(mistakes, topicColors) {
  if (!mistakes.length) {
    elements.topicErrorList.innerHTML = '<li class="topic-errors__empty">Nessun errore: tutti gli argomenti sono stati risolti correttamente.</li>';
    return;
  }

  const topicCounts = new Map();
  mistakes.forEach((item) => {
    const topic = item.topic || "Argomento non specificato";
    topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
  });

  elements.topicErrorList.innerHTML = Array.from(topicCounts.entries())
    .sort(([a], [b]) => a.localeCompare(b, "it"))
    .map(([topic, count]) => {
      const colors = topicColors.get(topic);
      return `
        <li class="topic-errors__item">
          <span class="topic-chip" style="${buildTopicChipStyle(colors)}">${escapeHtml(topic)}</span>
          <strong class="topic-errors__count">${count} ${count === 1 ? "errore" : "errori"}</strong>
        </li>
      `;
    })
    .join("");
}

function renderReviewList(mistakes, topicColors) {

  if (!mistakes.length) {
    elements.reviewList.innerHTML = `
      <div class="review-item">
        <strong>Ottimo lavoro</strong>
        <p>Non ci sono risposte errate da rivedere. Puoi ripetere il quiz per consolidare il risultato.</p>
      </div>
    `;
    return;
  }

  elements.reviewList.innerHTML = mistakes
    .map(
      (item) => `
        <article class="review-item">
          <span class="topic-chip topic-chip--question review-item__topic" style="${buildTopicChipStyle(topicColors.get(item.topic || "Argomento non specificato"))}">${escapeHtml(item.topic || "Argomento non specificato")}</span>
          <strong class="review-item__question">${escapeHtml(item.question)}</strong>
          <p class="review-item__line">
            <span class="review-item__label review-item__label--correct">Risposta corretta:</span>
            <span class="review-item__value">${escapeHtml(item.correct)}</span>
          </p>
          <p class="review-item__line">
            <span class="review-item__label review-item__label--selected">La tua risposta:</span>
            <span class="review-item__value">${escapeHtml(item.selected)}</span>
          </p>
        </article>
      `,
    )
    .join("");
}

function buildTopicColorMap(mistakes) {
  const topics = [...new Set(mistakes.map((item) => item.topic || "Argomento non specificato"))].sort((a, b) => a.localeCompare(b, "it"));
  const topicColors = new Map();

  topics.forEach((topic, index) => {
    const hue = Math.round((index * 137.508) % 360);
    topicColors.set(topic, {
      text: `hsl(${hue} 68% 28%)`,
      background: `hsl(${hue} 86% 92%)`,
      border: `hsl(${hue} 52% 70%)`,
    });
  });

  return topicColors;
}

function buildTopicChipStyle(colors) {
  const fallbackColors = {
    text: "hsl(190 35% 25%)",
    background: "hsl(190 52% 92%)",
    border: "hsl(190 30% 72%)",
  };
  const palette = colors || fallbackColors;

  return `--topic-chip-text:${palette.text};--topic-chip-bg:${palette.background};--topic-chip-border:${palette.border};`;
}

function shuffle(items) {
  const array = [...items];
  for (let index = array.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
  }

  return array;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function scrollToQuiz() {
  elements.quizSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function scrollToResults() {
  elements.resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function isFileProtocol() {
  return window.location.protocol === "file:";
}

function buildLoadErrorMessage(error) {
  if (error?.message === "FILE_PROTOCOL_NOT_SUPPORTED") {
    return [
      "<p>Hai aperto il sito come file locale (<strong>file://</strong>). In questa modalità il browser blocca il caricamento dei file JSON.</p>",
      "<p>Avvia un server locale dalla cartella del progetto e apri l'indirizzo HTTP:</p>",
      "<p><strong>python -m http.server 8000</strong><br><strong>http://127.0.0.1:8000</strong></p>",
    ].join("");
  }

  return "<p>Non è stato possibile leggere le domande. Verifica la presenza dei file JSON nella cartella <strong>subjects</strong> e che il sito sia aperto via HTTP.</p>";
}