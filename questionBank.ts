import type { Language, SkillDifficulty, TopicInfo } from '@/types';

export interface BankQuestion {
  id: string;
  topicCode: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  /** Short one-line explanation shown after the student answers, localized. */
  explanation: Record<Language, string>;
  /** Optional difficulty tag, used by SAT prep to recommend easier/harder
   * questions based on the student's current mastery (see recommendedDifficulty
   * in lib/mastery.ts). General-subject questions leave this undefined. */
  difficulty?: SkillDifficulty;
}

/** Subjects that belong to SAT prep mode, as opposed to the student's general school subjects. */
export const SAT_SUBJECTS = ['SAT Math', 'SAT Reading & Writing'] as const;

export function isSatSubject(subject: string): boolean {
  return (SAT_SUBJECTS as readonly string[]).includes(subject);
}

/**
 * Small, curated demo topic set. Each topic here has a matching question
 * set in QUESTION_BANK below, and metadata in TOPIC_META. This is
 * intentionally compact — the goal is a working, honest
 * diagnose → recommend → study → practice → progress loop over a real (if
 * small) content set, not a full curriculum. Expanding this list is a
 * later content task, not an architecture change.
 */
export const TOPIC_BANK: Record<string, TopicInfo> = {
  'MATH10-QE-01': {
    subject: 'Mathematics',
    grade: 'Class 10',
    chapter: 'Quadratic Equations',
    topic: 'Solving Quadratic Equations by Factorization',
    code: 'MATH10-QE-01',
  },
  'MATH9-LE-01': {
    subject: 'Mathematics',
    grade: 'Class 9',
    chapter: 'Linear Equations',
    topic: 'Linear Equations in Two Variables',
    code: 'MATH9-LE-01',
  },
  'SCI10-LIGHT-02': {
    subject: 'Science',
    grade: 'Class 10',
    chapter: 'Light — Reflection and Refraction',
    topic: 'Laws of Reflection',
    code: 'SCI10-LIGHT-02',
  },
  'SCI10-ACID-01': {
    subject: 'Science',
    grade: 'Class 10',
    chapter: 'Acids, Bases and Salts',
    topic: 'Properties of Acids and Bases',
    code: 'SCI10-ACID-01',
  },
  'ENG9-POEM-03': {
    subject: 'English',
    grade: 'Class 9',
    chapter: 'Poetry',
    topic: 'The Road Not Taken',
    code: 'ENG9-POEM-03',
  },
  'ENG8-GRAM-01': {
    subject: 'English',
    grade: 'Class 8',
    chapter: 'Grammar',
    topic: 'Tenses',
    code: 'ENG8-GRAM-01',
  },

  /* --- SAT prep skills (Phase 4) --- */
  'SAT-MATH-LINEQ-01': {
    subject: 'SAT Math',
    grade: 'SAT',
    chapter: 'Algebra',
    topic: 'Linear Equations',
    code: 'SAT-MATH-LINEQ-01',
  },
  'SAT-MATH-QUADEQ-01': {
    subject: 'SAT Math',
    grade: 'SAT',
    chapter: 'Algebra',
    topic: 'Quadratic Equations',
    code: 'SAT-MATH-QUADEQ-01',
  },
  'SAT-MATH-PROBSOLVE-01': {
    subject: 'SAT Math',
    grade: 'SAT',
    chapter: 'Problem Solving & Data Analysis',
    topic: 'Problem Solving',
    code: 'SAT-MATH-PROBSOLVE-01',
  },
  'SAT-RW-MAINIDEA-01': {
    subject: 'SAT Reading & Writing',
    grade: 'SAT',
    chapter: 'Reading Comprehension',
    topic: 'Main Ideas',
    code: 'SAT-RW-MAINIDEA-01',
  },
  'SAT-RW-GRAMMAR-01': {
    subject: 'SAT Reading & Writing',
    grade: 'SAT',
    chapter: 'Standard English Conventions',
    topic: 'Grammar',
    code: 'SAT-RW-GRAMMAR-01',
  },
  'SAT-RW-INFERENCE-01': {
    subject: 'SAT Reading & Writing',
    grade: 'SAT',
    chapter: 'Reading Comprehension',
    topic: 'Reading Inference',
    code: 'SAT-RW-INFERENCE-01',
  },
};

/**
 * Per-topic metadata used by the Phase 3 recommendation/dashboard views:
 * a rough estimated study time and a one-line "what you'll learn" summary,
 * localized. Kept as small static strings so the app stays fast on slow
 * connections — no network calls involved.
 */
export interface TopicMeta {
  estimatedMinutes: number;
  summary: Record<Language, string>;
}

export const TOPIC_META: Record<string, TopicMeta> = {
  'MATH10-QE-01': {
    estimatedMinutes: 15,
    summary: {
      English: 'Learn to solve quadratic equations by factoring them into two linear factors.',
      Hindi: 'गुणनखंडन द्वारा द्विघात समीकरण हल करना सीखें।',
      Marathi: 'गुणाकार पद्धतीने द्विघात समीकरण सोडवायला शिका.',
    },
  },
  'MATH9-LE-01': {
    estimatedMinutes: 12,
    summary: {
      English: 'Understand how linear equations in two variables are written and graphed.',
      Hindi: 'दो चरों वाले रैखिक समीकरण को लिखना और ग्राफ बनाना समझें।',
      Marathi: 'दोन चलांची रेषीय समीकरणे कशी लिहावी आणि आलेखावर मांडावी हे समजून घ्या.',
    },
  },
  'SCI10-LIGHT-02': {
    estimatedMinutes: 15,
    summary: {
      English: 'Learn the laws of reflection and how plane mirrors form images.',
      Hindi: 'परावर्तन के नियम और समतल दर्पण द्वारा प्रतिबिंब बनना सीखें।',
      Marathi: 'परावर्तनाचे नियम आणि सपाट आरशाने प्रतिमा कशी तयार होते हे शिका.',
    },
  },
  'SCI10-ACID-01': {
    estimatedMinutes: 12,
    summary: {
      English: 'Learn how acids and bases behave and how to test them with litmus.',
      Hindi: 'अम्ल और क्षार कैसे व्यवहार करते हैं और लिटमस से जांच सीखें।',
      Marathi: 'आम्ल आणि आम्लारी कशी वागतात आणि लिटमसने कशी तपासावी हे शिका.',
    },
  },
  'ENG9-POEM-03': {
    estimatedMinutes: 10,
    summary: {
      English: "Read and understand the themes of Robert Frost's classic poem.",
      Hindi: 'रॉबर्ट फ्रॉस्ट की क्लासिक कविता के विषयों को पढ़ें और समझें।',
      Marathi: 'रॉबर्ट फ्रॉस्ट यांच्या classic कवितेचे विषय वाचा आणि समजून घ्या.',
    },
  },
  'ENG8-GRAM-01': {
    estimatedMinutes: 10,
    summary: {
      English: 'Practice using present, past, and future tenses correctly.',
      Hindi: 'वर्तमान, भूत और भविष्य काल का सही प्रयोग करने का अभ्यास करें।',
      Marathi: 'वर्तमान, भूत आणि भविष्यकाळाचा योग्य वापर करण्याचा सराव करा.',
    },
  },

  /* --- SAT prep skills (Phase 4) --- */
  'SAT-MATH-LINEQ-01': {
    estimatedMinutes: 10,
    summary: {
      English: 'Practice solving one-variable linear equations quickly and accurately.',
      Hindi: 'एक-चर रैखिक समीकरणों को जल्दी और सटीक रूप से हल करने का अभ्यास करें।',
      Marathi: 'एक-चल रेषीय समीकरणे जलद आणि अचूकपणे सोडवण्याचा सराव करा.',
    },
  },
  'SAT-MATH-QUADEQ-01': {
    estimatedMinutes: 12,
    summary: {
      English: 'Learn to find roots and use key properties of quadratic equations.',
      Hindi: 'द्विघात समीकरणों के मूल ज्ञात करना और उनके गुणधर्म सीखें।',
      Marathi: 'द्विघात समीकरणांची मुळे शोधणे आणि त्यांचे गुणधर्म शिका.',
    },
  },
  'SAT-MATH-PROBSOLVE-01': {
    estimatedMinutes: 12,
    summary: {
      English: 'Apply ratios, percentages, and rates to real-world word problems.',
      Hindi: 'अनुपात, प्रतिशत और दर को वास्तविक समस्याओं पर लागू करें।',
      Marathi: 'गुणोत्तर, टक्केवारी आणि दर वास्तविक समस्यांवर लागू करा.',
    },
  },
  'SAT-RW-MAINIDEA-01': {
    estimatedMinutes: 10,
    summary: {
      English: 'Practice identifying the central idea of a short passage quickly.',
      Hindi: 'छोटे अनुच्छेद का केंद्रीय विचार जल्दी पहचानने का अभ्यास करें।',
      Marathi: 'छोट्या उताऱ्याची मध्यवर्ती कल्पना जलद ओळखण्याचा सराव करा.',
    },
  },
  'SAT-RW-GRAMMAR-01': {
    estimatedMinutes: 10,
    summary: {
      English: 'Review common grammar rules tested on the SAT: agreement, punctuation, and pronouns.',
      Hindi: 'SAT में परखे जाने वाले सामान्य व्याकरण नियमों की समीक्षा करें।',
      Marathi: 'SAT मध्ये तपासले जाणारे सामान्य व्याकरण नियम पुन्हा पहा.',
    },
  },
  'SAT-RW-INFERENCE-01': {
    estimatedMinutes: 12,
    summary: {
      English: 'Practice drawing logical conclusions from what a passage implies.',
      Hindi: 'अनुच्छेद के निहितार्थ से तार्किक निष्कर्ष निकालने का अभ्यास करें।',
      Marathi: 'उताऱ्याच्या अर्थावरून तार्किक निष्कर्ष काढण्याचा सराव करा.',
    },
  },
};

const DEFAULT_TOPIC_META: TopicMeta = {
  estimatedMinutes: 10,
  summary: {
    English: "A quick session to strengthen this topic.",
    Hindi: 'इस विषय को मजबूत करने के लिए एक त्वरित सत्र।',
    Marathi: 'हा विषय मजबूत करण्यासाठी एक द्रुत सत्र.',
  },
};

/** Always returns metadata, falling back to sensible defaults for any topic not in TOPIC_META. */
export function getTopicMeta(topicCode: string): TopicMeta {
  return TOPIC_META[topicCode] ?? DEFAULT_TOPIC_META;
}

export const QUESTION_BANK: Record<string, BankQuestion[]> = {
  'MATH10-QE-01': [
    {
      id: 'MATH10-QE-01-Q1',
      topicCode: 'MATH10-QE-01',
      question: 'What is the standard form of a quadratic equation?',
      options: ['ax + b = 0', 'ax² + bx + c = 0', 'ax³ + bx² + c = 0', 'a/x + b = 0'],
      correctIndex: 1,
      explanation: {
        English: 'A quadratic equation always has an x² term: ax² + bx + c = 0.',
        Hindi: 'द्विघात समीकरण में हमेशा x² पद होता है: ax²+bx+c=0।',
        Marathi: 'द्विघात समीकरणात नेहमी x² पद असते: ax²+bx+c=0.',
      },
    },
    {
      id: 'MATH10-QE-01-Q2',
      topicCode: 'MATH10-QE-01',
      question: 'The roots of x² - 5x + 6 = 0 are:',
      options: ['1, 6', '2, 3', '-2, -3', '2, -3'],
      correctIndex: 1,
      explanation: {
        English: 'It factors as (x-2)(x-3) = 0, so x = 2 or x = 3.',
        Hindi: 'गुणनखंड (x-2)(x-3)=0, इसलिए x=2 या x=3।',
        Marathi: 'गुणाकार (x-2)(x-3)=0, म्हणून x=2 किंवा x=3.',
      },
    },
    {
      id: 'MATH10-QE-01-Q3',
      topicCode: 'MATH10-QE-01',
      question: 'How many roots does a quadratic equation have (counting repeats)?',
      options: ['1', '2', '3', '0'],
      correctIndex: 1,
      explanation: {
        English: 'A quadratic equation always has exactly 2 roots.',
        Hindi: 'द्विघात समीकरण के हमेशा 2 मूल होते हैं।',
        Marathi: 'द्विघात समीकरणाला नेहमी 2 मुळे असतात.',
      },
    },
    {
      id: 'MATH10-QE-01-Q4',
      topicCode: 'MATH10-QE-01',
      question: 'Factorization of x² - 9 is:',
      options: ['(x-3)(x-3)', '(x+3)(x+3)', '(x-3)(x+3)', '(x-9)(x+1)'],
      correctIndex: 2,
      explanation: {
        English: 'x² - 9 is a difference of squares: (x-3)(x+3).',
        Hindi: 'x²-9 वर्गों का अंतर है: (x-3)(x+3)।',
        Marathi: 'x²-9 हा वर्गांचा फरक आहे: (x-3)(x+3).',
      },
    },
  ],
  'MATH9-LE-01': [
    {
      id: 'MATH9-LE-01-Q1',
      topicCode: 'MATH9-LE-01',
      question: 'A linear equation in two variables can be written as:',
      options: ['ax + b = 0', 'ax + by + c = 0', 'ax² + b = 0', 'a/x + b/y = 0'],
      correctIndex: 1,
      explanation: {
        English: 'A linear equation in two variables has the form ax + by + c = 0.',
        Hindi: 'दो चरों वाले रैखिक समीकरण का रूप ax+by+c=0 होता है।',
        Marathi: 'दोन चलांच्या रेषीय समीकरणाचे रूप ax+by+c=0 असते.',
      },
    },
    {
      id: 'MATH9-LE-01-Q2',
      topicCode: 'MATH9-LE-01',
      question: 'How many solutions does a single linear equation in two variables have?',
      options: ['Exactly one', 'Exactly two', 'Infinitely many', 'None'],
      correctIndex: 2,
      explanation: {
        English: 'A single linear equation in two variables has infinitely many solutions.',
        Hindi: 'एक रैखिक समीकरण के अनंत हल होते हैं।',
        Marathi: 'एका रेषीय समीकरणाला अनंत उकल असतात.',
      },
    },
    {
      id: 'MATH9-LE-01-Q3',
      topicCode: 'MATH9-LE-01',
      question: 'If x = 2 and y = 3 satisfy 2x + y = 7, this point lies:',
      options: ['On the line', 'Above the line', 'Below the line', 'Cannot say'],
      correctIndex: 0,
      explanation: {
        English: 'Since 2(2) + 3 = 7 is true, (2,3) satisfies the equation.',
        Hindi: '2(2)+3=7 सही है, इसलिए (2,3) समीकरण को संतुष्ट करता है।',
        Marathi: '2(2)+3=7 खरे आहे, म्हणून (2,3) समीकरण पूर्ण करते.',
      },
    },
    {
      id: 'MATH9-LE-01-Q4',
      topicCode: 'MATH9-LE-01',
      question: 'The graph of a linear equation in two variables is a:',
      options: ['Curve', 'Straight line', 'Parabola', 'Circle'],
      correctIndex: 1,
      explanation: {
        English: 'The graph of a linear equation is always a straight line.',
        Hindi: 'रैखिक समीकरण का ग्राफ हमेशा एक सीधी रेखा होता है।',
        Marathi: 'रेषीय समीकरणाचा आलेख नेहमी सरळ रेषा असतो.',
      },
    },
  ],
  'SCI10-LIGHT-02': [
    {
      id: 'SCI10-LIGHT-02-Q1',
      topicCode: 'SCI10-LIGHT-02',
      question: 'The angle of incidence is always equal to the:',
      options: ['Angle of refraction', 'Angle of reflection', 'Angle of deviation', 'Critical angle'],
      correctIndex: 1,
      explanation: {
        English: 'By the law of reflection, angle of incidence = angle of reflection.',
        Hindi: 'परावर्तन के नियम से आपतन कोण = परावर्तन कोण।',
        Marathi: 'परावर्तनाच्या नियमानुसार आपाती कोन = परावर्तन कोन.',
      },
    },
    {
      id: 'SCI10-LIGHT-02-Q2',
      topicCode: 'SCI10-LIGHT-02',
      question: 'The incident ray, reflected ray, and normal all lie:',
      options: ['On different planes', 'In the same plane', 'Perpendicular to each other', 'Parallel to the mirror'],
      correctIndex: 1,
      explanation: {
        English: 'The incident ray, reflected ray, and normal always lie in one plane.',
        Hindi: 'आपतित किरण, परावर्तित किरण और अभिलंब एक ही तल में होते हैं।',
        Marathi: 'आपाती किरण, परावर्तित किरण आणि लंब एकाच प्रतलात असतात.',
      },
    },
    {
      id: 'SCI10-LIGHT-02-Q3',
      topicCode: 'SCI10-LIGHT-02',
      question: 'A plane mirror forms an image that is:',
      options: ['Real and inverted', 'Virtual and erect', 'Real and erect', 'Virtual and inverted'],
      correctIndex: 1,
      explanation: {
        English: 'A plane mirror always forms a virtual, erect image.',
        Hindi: 'समतल दर्पण हमेशा आभासी, सीधा प्रतिबिंब बनाता है।',
        Marathi: 'सपाट आरसा नेहमी आभासी, सरळ प्रतिमा तयार करतो.',
      },
    },
    {
      id: 'SCI10-LIGHT-02-Q4',
      topicCode: 'SCI10-LIGHT-02',
      question: 'The normal at the point of incidence is drawn:',
      options: ['Parallel to the mirror', 'At 45° to the mirror', 'Perpendicular to the mirror', 'At 60° to the mirror'],
      correctIndex: 2,
      explanation: {
        English: 'The normal is always drawn perpendicular to the reflecting surface.',
        Hindi: 'अभिलंब हमेशा परावर्तक सतह के लंबवत खींचा जाता है।',
        Marathi: 'लंब नेहमी परावर्तक पृष्ठभागाला लंबरूप काढला जातो.',
      },
    },
  ],
  'SCI10-ACID-01': [
    {
      id: 'SCI10-ACID-01-Q1',
      topicCode: 'SCI10-ACID-01',
      question: 'An acid turns blue litmus paper:',
      options: ['Blue', 'Red', 'Green', 'Colorless'],
      correctIndex: 1,
      explanation: {
        English: 'Acids turn blue litmus paper red.',
        Hindi: 'अम्ल नीले लिटमस पेपर को लाल कर देते हैं।',
        Marathi: 'आम्ल निळ्या लिटमस पेपरला लाल करते.',
      },
    },
    {
      id: 'SCI10-ACID-01-Q2',
      topicCode: 'SCI10-ACID-01',
      question: 'The pH of a neutral solution is:',
      options: ['0', '7', '14', '1'],
      correctIndex: 1,
      explanation: {
        English: 'A neutral solution has a pH of exactly 7.',
        Hindi: 'उदासीन विलयन का pH ठीक 7 होता है।',
        Marathi: 'उदासीन द्रावणाचा pH बरोबर 7 असतो.',
      },
    },
    {
      id: 'SCI10-ACID-01-Q3',
      topicCode: 'SCI10-ACID-01',
      question: 'A base turns red litmus paper:',
      options: ['Red', 'Blue', 'Yellow', 'Colorless'],
      correctIndex: 1,
      explanation: {
        English: 'Bases turn red litmus paper blue.',
        Hindi: 'क्षार लाल लिटमस पेपर को नीला कर देते हैं।',
        Marathi: 'आम्लारी लाल लिटमस पेपरला निळे करते.',
      },
    },
    {
      id: 'SCI10-ACID-01-Q4',
      topicCode: 'SCI10-ACID-01',
      question: 'Which of these is a common laboratory base?',
      options: ['Hydrochloric acid', 'Sodium hydroxide', 'Acetic acid', 'Sulphuric acid'],
      correctIndex: 1,
      explanation: {
        English: 'Sodium hydroxide (NaOH) is a common laboratory base.',
        Hindi: 'सोडियम हाइड्रॉक्साइड (NaOH) एक सामान्य प्रयोगशाला क्षार है।',
        Marathi: 'सोडियम हायड्रॉक्साइड (NaOH) ही सामान्य प्रयोगशाळा आम्लारी आहे.',
      },
    },
  ],
  'ENG9-POEM-03': [
    {
      id: 'ENG9-POEM-03-Q1',
      topicCode: 'ENG9-POEM-03',
      question: '"The Road Not Taken" was written by:',
      options: ['William Wordsworth', 'Robert Frost', 'John Keats', 'Rudyard Kipling'],
      correctIndex: 1,
      explanation: {
        English: 'The Road Not Taken was written by Robert Frost.',
        Hindi: "'द रोड नॉट टेकन' रॉबर्ट फ्रॉस्ट ने लिखी थी।",
        Marathi: "'द रोड नॉट टेकन' रॉबर्ट फ्रॉस्ट यांनी लिहिली.",
      },
    },
    {
      id: 'ENG9-POEM-03-Q2',
      topicCode: 'ENG9-POEM-03',
      question: 'The poem is mainly about:',
      options: ['A journey by train', 'Choices in life', 'A walk in the rain', 'A conversation with a friend'],
      correctIndex: 1,
      explanation: {
        English: 'The poem reflects on the choices we make in life.',
        Hindi: 'यह कविता जीवन में किए गए चुनावों पर विचार करती है।',
        Marathi: 'ही कविता जीवनातील निवडींवर विचार करते.',
      },
    },
    {
      id: 'ENG9-POEM-03-Q3',
      topicCode: 'ENG9-POEM-03',
      question: 'How many roads diverge in the poem?',
      options: ['One', 'Two', 'Three', 'Four'],
      correctIndex: 1,
      explanation: {
        English: 'The poem describes two roads diverging in a wood.',
        Hindi: 'कविता में जंगल में दो रास्ते अलग होते हैं।',
        Marathi: 'कवितेत जंगलात दोन वाटा वेगळ्या होतात.',
      },
    },
    {
      id: 'ENG9-POEM-03-Q4',
      topicCode: 'ENG9-POEM-03',
      question: 'The tone of the poem is best described as:',
      options: ['Angry', 'Reflective', 'Comic', 'Fearful'],
      correctIndex: 1,
      explanation: {
        English: "The poem's tone is thoughtful and reflective.",
        Hindi: 'कविता का स्वर विचारशील और चिंतनशील है।',
        Marathi: 'कवितेचा सूर विचारशील आणि चिंतनशील आहे.',
      },
    },
  ],
  'ENG8-GRAM-01': [
    {
      id: 'ENG8-GRAM-01-Q1',
      topicCode: 'ENG8-GRAM-01',
      question: 'Choose the correct present continuous form: "She ___ to school now."',
      options: ['go', 'goes', 'is going', 'went'],
      correctIndex: 2,
      explanation: {
        English: "Present continuous uses is/am/are + verb-ing: 'is going'.",
        Hindi: "वर्तमान सतत काल में is/am/are + verb-ing होता है: 'is going'।",
        Marathi: "वर्तमान चालू काळात is/am/are + verb-ing असते: 'is going'.",
      },
    },
    {
      id: 'ENG8-GRAM-01-Q2',
      topicCode: 'ENG8-GRAM-01',
      question: 'The past tense of "write" is:',
      options: ['writed', 'wrote', 'writen', 'writing'],
      correctIndex: 1,
      explanation: {
        English: "The past tense of 'write' is 'wrote'.",
        Hindi: "'write' का भूतकाल 'wrote' होता है।",
        Marathi: "'write' चा भूतकाळ 'wrote' असतो.",
      },
    },
    {
      id: 'ENG8-GRAM-01-Q3',
      topicCode: 'ENG8-GRAM-01',
      question: 'Which sentence uses future tense correctly?',
      options: ['I will went home', 'I will go home', 'I will going home', 'I go home tomorrow will'],
      correctIndex: 1,
      explanation: {
        English: "Future tense uses 'will' + base verb: 'will go'.",
        Hindi: "भविष्य काल में 'will' + मूल क्रिया होती है: 'will go'।",
        Marathi: "भविष्यकाळात 'will' + मूळ क्रियापद असते: 'will go'.",
      },
    },
    {
      id: 'ENG8-GRAM-01-Q4',
      topicCode: 'ENG8-GRAM-01',
      question: '"They have finished their homework" is an example of:',
      options: ['Present perfect', 'Past continuous', 'Future perfect', 'Simple past'],
      correctIndex: 0,
      explanation: {
        English: "'Have/has + past participle' forms the present perfect tense.",
        Hindi: "'have/has + past participle' वर्तमान पूर्ण काल बनाता है।",
        Marathi: "'have/has + past participle' ने वर्तमान पूर्ण काळ तयार होतो.",
      },
    },
  ],

  /* --- SAT Math: Linear Equations --- */
  'SAT-MATH-LINEQ-01': [
    {
      id: 'SAT-MATH-LINEQ-01-Q1',
      topicCode: 'SAT-MATH-LINEQ-01',
      question: 'If 2x + 3 = 11, what is x?',
      options: ['2', '3', '4', '5'],
      correctIndex: 2,
      difficulty: 'easy',
      explanation: {
        English: 'Subtract 3, then divide by 2: 2x = 8, so x = 4.',
        Hindi: '3 घटाएं, फिर 2 से भाग दें: 2x=8, तो x=4।',
        Marathi: '3 वजा करा, नंतर 2 ने भागा: 2x=8, म्हणून x=4.',
      },
    },
    {
      id: 'SAT-MATH-LINEQ-01-Q2',
      topicCode: 'SAT-MATH-LINEQ-01',
      question: 'If 5x - 2 = 18, what is x?',
      options: ['2', '4', '5', '8'],
      correctIndex: 1,
      difficulty: 'easy',
      explanation: {
        English: 'Add 2, then divide by 5: 5x = 20, so x = 4.',
        Hindi: '2 जोड़ें, फिर 5 से भाग दें: 5x=20, तो x=4।',
        Marathi: '2 मिळवा, नंतर 5 ने भागा: 5x=20, म्हणून x=4.',
      },
    },
    {
      id: 'SAT-MATH-LINEQ-01-Q3',
      topicCode: 'SAT-MATH-LINEQ-01',
      question: 'If 3(x - 2) = 2x + 1, what is x?',
      options: ['5', '6', '7', '8'],
      correctIndex: 2,
      difficulty: 'medium',
      explanation: {
        English: 'Expand and solve: 3x - 6 = 2x + 1, so x = 7.',
        Hindi: 'विस्तार करें और हल करें: 3x-6=2x+1, तो x=7।',
        Marathi: 'विस्तार करा आणि सोडवा: 3x-6=2x+1, म्हणून x=7.',
      },
    },
    {
      id: 'SAT-MATH-LINEQ-01-Q4',
      topicCode: 'SAT-MATH-LINEQ-01',
      question: 'If (2x + 1) / 3 = x - 1, what is x?',
      options: ['2', '3', '4', '5'],
      correctIndex: 2,
      difficulty: 'hard',
      explanation: {
        English: 'Cross-multiply: 2x + 1 = 3x - 3, so x = 4.',
        Hindi: 'क्रॉस-गुणा करें: 2x+1=3x-3, तो x=4।',
        Marathi: 'क्रॉस-गुणाकार करा: 2x+1=3x-3, म्हणून x=4.',
      },
    },
  ],

  /* --- SAT Math: Quadratic Equations --- */
  'SAT-MATH-QUADEQ-01': [
    {
      id: 'SAT-MATH-QUADEQ-01-Q1',
      topicCode: 'SAT-MATH-QUADEQ-01',
      question: 'What are the roots of x² - 4 = 0?',
      options: ['x = 2 only', 'x = -2 only', 'x = 2 or x = -2', 'x = 4 or x = -4'],
      correctIndex: 2,
      difficulty: 'easy',
      explanation: {
        English: 'x² - 4 = 0 factors as (x-2)(x+2) = 0, so x = 2 or x = -2.',
        Hindi: 'x²-4=0 का गुणनखंड (x-2)(x+2)=0 है, तो x=2 या x=-2।',
        Marathi: 'x²-4=0 चे गुणाकार (x-2)(x+2)=0 आहे, म्हणून x=2 किंवा x=-2.',
      },
    },
    {
      id: 'SAT-MATH-QUADEQ-01-Q2',
      topicCode: 'SAT-MATH-QUADEQ-01',
      question: 'If x² = 49, what is a possible value of x?',
      options: ['6', '7', '8', '9'],
      correctIndex: 1,
      difficulty: 'easy',
      explanation: {
        English: '√49 = 7, so x = 7 is a possible value.',
        Hindi: '√49 = 7, तो x=7 एक संभावित मान है।',
        Marathi: '√49 = 7, म्हणून x=7 ही एक शक्य किंमत आहे.',
      },
    },
    {
      id: 'SAT-MATH-QUADEQ-01-Q3',
      topicCode: 'SAT-MATH-QUADEQ-01',
      question: 'What is the sum of the roots of x² - 5x + 6 = 0?',
      options: ['1', '5', '6', '-5'],
      correctIndex: 1,
      difficulty: 'medium',
      explanation: {
        English: 'Sum of roots = -b/a = -(-5)/1 = 5.',
        Hindi: 'मूलों का योग = -b/a = 5।',
        Marathi: 'मुळांची बेरीज = -b/a = 5.',
      },
    },
    {
      id: 'SAT-MATH-QUADEQ-01-Q4',
      topicCode: 'SAT-MATH-QUADEQ-01',
      question: 'For x² + bx + 9 = 0 to have exactly one real root, what is a positive value of b?',
      options: ['3', '6', '9', '12'],
      correctIndex: 1,
      difficulty: 'hard',
      explanation: {
        English: 'One real root requires the discriminant b² - 36 = 0, so b = 6.',
        Hindi: 'एक मूल के लिए विविक्तकर b²-36=0 होना चाहिए, तो b=6।',
        Marathi: 'एका मुळासाठी विविक्षक b²-36=0 हवा, म्हणून b=6.',
      },
    },
  ],

  /* --- SAT Math: Problem Solving --- */
  'SAT-MATH-PROBSOLVE-01': [
    {
      id: 'SAT-MATH-PROBSOLVE-01-Q1',
      topicCode: 'SAT-MATH-PROBSOLVE-01',
      question: 'A shirt costs $20 after a 20% discount from its original price. What was the original price?',
      options: ['$22', '$24', '$25', '$28'],
      correctIndex: 2,
      difficulty: 'easy',
      explanation: {
        English: '0.8 × original price = 20, so original price = 25.',
        Hindi: '0.8 × मूल कीमत = 20, तो मूल कीमत = 25।',
        Marathi: '0.8 × मूळ किंमत = 20, म्हणून मूळ किंमत = 25.',
      },
    },
    {
      id: 'SAT-MATH-PROBSOLVE-01-Q2',
      topicCode: 'SAT-MATH-PROBSOLVE-01',
      question: 'If a car travels 60 miles in 1.5 hours, what is its average speed in mph?',
      options: ['30', '35', '40', '45'],
      correctIndex: 2,
      difficulty: 'easy',
      explanation: {
        English: 'Speed = distance ÷ time = 60 ÷ 1.5 = 40 mph.',
        Hindi: 'गति = दूरी ÷ समय = 60 ÷ 1.5 = 40 mph।',
        Marathi: 'वेग = अंतर ÷ वेळ = 60 ÷ 1.5 = 40 mph.',
      },
    },
    {
      id: 'SAT-MATH-PROBSOLVE-01-Q3',
      topicCode: 'SAT-MATH-PROBSOLVE-01',
      question: 'A recipe requires 3 cups of flour for 12 cookies. How many cups are needed for 20 cookies?',
      options: ['4', '4.5', '5', '6'],
      correctIndex: 2,
      difficulty: 'medium',
      explanation: {
        English: '3/12 = 1/4 cup per cookie; 1/4 × 20 = 5 cups.',
        Hindi: '3/12 = 1/4 कप प्रति कुकी; 1/4 × 20 = 5 कप।',
        Marathi: '3/12 = 1/4 कप प्रति कुकी; 1/4 × 20 = 5 कप.',
      },
    },
    {
      id: 'SAT-MATH-PROBSOLVE-01-Q4',
      topicCode: 'SAT-MATH-PROBSOLVE-01',
      question:
        'A store marks up an item by 25% then offers a 20% discount on the marked-up price. What is the net percent change from the original price?',
      options: ['+5%', '0%', '-5%', '-10%'],
      correctIndex: 1,
      difficulty: 'hard',
      explanation: {
        English: '1.25 × 0.80 = 1.00, so there is no net change.',
        Hindi: '1.25 × 0.80 = 1.00, तो कोई शुद्ध परिवर्तन नहीं है।',
        Marathi: '1.25 × 0.80 = 1.00, म्हणून कोणताही निव्वळ बदल नाही.',
      },
    },
  ],

  /* --- SAT Reading & Writing: Main Ideas (original short passages, not from any real SAT test) --- */
  'SAT-RW-MAINIDEA-01': [
    {
      id: 'SAT-RW-MAINIDEA-01-Q1',
      topicCode: 'SAT-RW-MAINIDEA-01',
      question:
        'Passage: "Many city parks now include small gardens where residents grow vegetables together. These shared gardens help neighbors get to know each other while also providing fresh food." What is the main idea of the passage?',
      options: [
        'City parks are disappearing.',
        'Community gardens build connections and provide food.',
        'Vegetables are expensive to buy.',
        'Neighbors rarely garden together.',
      ],
      correctIndex: 1,
      difficulty: 'easy',
      explanation: {
        English: 'The passage focuses on gardens building connections and providing food.',
        Hindi: 'अनुच्छेद बगीचों द्वारा जुड़ाव बनाने और भोजन देने पर केंद्रित है।',
        Marathi: 'उतारा बागांद्वारे नाती जोडणे आणि अन्न पुरवणे यावर केंद्रित आहे.',
      },
    },
    {
      id: 'SAT-RW-MAINIDEA-01-Q2',
      topicCode: 'SAT-RW-MAINIDEA-01',
      question:
        'Passage: "Libraries once mainly lent books, but many now offer tools, sewing machines, and even seeds for borrowing. This shift reflects how libraries are adapting to serve broader community needs." What is the main idea?',
      options: [
        'Libraries are closing across the country.',
        'Libraries are expanding beyond books to meet community needs.',
        'Sewing machines are hard to find.',
        'Most people prefer digital books.',
      ],
      correctIndex: 1,
      difficulty: 'easy',
      explanation: {
        English: 'The passage describes libraries expanding their services.',
        Hindi: 'अनुच्छेद पुस्तकालयों की सेवाओं के विस्तार का वर्णन करता है।',
        Marathi: 'उतारा ग्रंथालयांच्या सेवांच्या विस्ताराचे वर्णन करतो.',
      },
    },
    {
      id: 'SAT-RW-MAINIDEA-01-Q3',
      topicCode: 'SAT-RW-MAINIDEA-01',
      question:
        'Passage: "The introduction of streetlights in the 19th century did more than light up roads at night — it also extended the hours people felt safe to work, socialize, and travel, quietly reshaping daily urban life." According to the passage, what was a significant effect of streetlights?',
      options: [
        'They increased the cost of city living.',
        'They only helped with road safety.',
        'They changed how people used their time in cities.',
        'They were rejected by most cities.',
      ],
      correctIndex: 2,
      difficulty: 'medium',
      explanation: {
        English: 'The passage explains how streetlights changed daily city life.',
        Hindi: 'अनुच्छेद बताता है कि स्ट्रीटलाइट्स ने शहरी जीवन को कैसे बदला।',
        Marathi: 'उतारा स्पष्ट करतो की स्ट्रीटलाइट्सने शहरी जीवन कसे बदलले.',
      },
    },
    {
      id: 'SAT-RW-MAINIDEA-01-Q4',
      topicCode: 'SAT-RW-MAINIDEA-01',
      question:
        'Passage: "Critics of the new policy argue it addresses a symptom rather than the underlying cause; supporters counter that even partial progress is preferable to prolonged inaction while a fuller solution is designed." The passage is primarily concerned with:',
      options: [
        'Describing a debate about the value of a partial solution.',
        'Explaining how a policy was created.',
        'Proving that critics are correct.',
        "Summarizing the policy's budget.",
      ],
      correctIndex: 0,
      difficulty: 'hard',
      explanation: {
        English: 'The passage presents both sides of a debate about partial progress.',
        Hindi: 'अनुच्छेद आंशिक प्रगति पर बहस के दोनों पक्ष प्रस्तुत करता है।',
        Marathi: 'उतारा आंशिक प्रगतीवरील वादाच्या दोन्ही बाजू मांडतो.',
      },
    },
  ],

  /* --- SAT Reading & Writing: Grammar --- */
  'SAT-RW-GRAMMAR-01': [
    {
      id: 'SAT-RW-GRAMMAR-01-Q1',
      topicCode: 'SAT-RW-GRAMMAR-01',
      question: 'Choose the correct sentence.',
      options: [
        'Each of the students have a book.',
        'Each of the students has a book.',
        'Each of the student have a book.',
        'Each of the students having a book.',
      ],
      correctIndex: 1,
      difficulty: 'easy',
      explanation: {
        English: "'Each' is singular, so it takes 'has', not 'have'.",
        Hindi: "'Each' एकवचन है, इसलिए 'has' आएगा, 'have' नहीं।",
        Marathi: "'Each' एकवचनी आहे, म्हणून 'has' येईल, 'have' नाही.",
      },
    },
    {
      id: 'SAT-RW-GRAMMAR-01-Q2',
      topicCode: 'SAT-RW-GRAMMAR-01',
      question: 'Choose the correctly punctuated sentence.',
      options: [
        'I bought apples oranges, and bananas.',
        'I bought apples, oranges and, bananas.',
        'I bought apples, oranges, and bananas.',
        'I bought, apples oranges and bananas.',
      ],
      correctIndex: 2,
      difficulty: 'easy',
      explanation: {
        English: "A comma before 'and' in a list (the Oxford comma) is used consistently here.",
        Hindi: "सूची में 'and' से पहले अल्पविराम यहां लगातार प्रयोग हुआ है।",
        Marathi: "यादीत 'and' आधी स्वल्पविराम इथे सातत्याने वापरला आहे.",
      },
    },
    {
      id: 'SAT-RW-GRAMMAR-01-Q3',
      topicCode: 'SAT-RW-GRAMMAR-01',
      question: 'Which sentence uses the correct pronoun?',
      options: [
        'Between you and I, this is a great plan.',
        'Between you and me, this is a great plan.',
        'Between you and myself, this is a great plan.',
        'Between yourself and I, this is a great plan.',
      ],
      correctIndex: 1,
      difficulty: 'medium',
      explanation: {
        English: "'Me' is the correct object pronoun after a preposition like 'between'.",
        Hindi: "'between' जैसे preposition के बाद सही object सर्वनाम 'me' है।",
        Marathi: "'between' सारख्या preposition नंतर योग्य object सर्वनाम 'me' आहे.",
      },
    },
    {
      id: 'SAT-RW-GRAMMAR-01-Q4',
      topicCode: 'SAT-RW-GRAMMAR-01',
      question: 'Which sentence corrects the dangling modifier in "Walking to school, the rain started falling"?',
      options: [
        'Walking to school, the rain started falling.',
        'The rain, walking to school, started falling.',
        'While I was walking to school, the rain started falling.',
        'Walking to school started the rain falling.',
      ],
      correctIndex: 2,
      difficulty: 'hard',
      explanation: {
        English: "The modifier 'walking to school' should describe a person, not 'the rain'.",
        Hindi: "'walking to school' को व्यक्ति का वर्णन करना चाहिए, 'बारिश' का नहीं।",
        Marathi: "'walking to school' ने व्यक्तीचे वर्णन करावे, 'पावसाचे' नाही.",
      },
    },
  ],

  /* --- SAT Reading & Writing: Reading Inference --- */
  'SAT-RW-INFERENCE-01': [
    {
      id: 'SAT-RW-INFERENCE-01-Q1',
      topicCode: 'SAT-RW-INFERENCE-01',
      question:
        'Passage: "Maria packed an umbrella, a raincoat, and boots before leaving the house." What can be inferred?',
      options: [
        'Maria expects sunny weather.',
        'Maria expects rain.',
        'Maria is going swimming.',
        'Maria forgot her jacket.',
      ],
      correctIndex: 1,
      difficulty: 'easy',
      explanation: {
        English: 'Packing rain gear suggests Maria expects rain.',
        Hindi: 'बारिश का सामान पैक करना दर्शाता है कि मारिया बारिश की उम्मीद कर रही है।',
        Marathi: 'पावसाचे सामान पॅक करणे दर्शवते की मारियाला पावसाची अपेक्षा आहे.',
      },
    },
    {
      id: 'SAT-RW-INFERENCE-01-Q2',
      topicCode: 'SAT-RW-INFERENCE-01',
      question:
        'Passage: "The store\'s shelves were empty of bread by 9 a.m., though they had been fully stocked at opening." What can be inferred?',
      options: [
        'The store received no deliveries.',
        'Bread was in high demand that morning.',
        'The store closed early.',
        'Customers avoided the store.',
      ],
      correctIndex: 1,
      difficulty: 'easy',
      explanation: {
        English: 'Empty shelves by 9 a.m. suggest high demand that morning.',
        Hindi: 'सुबह 9 बजे तक खाली शेल्फ उस सुबह अधिक मांग का संकेत देते हैं।',
        Marathi: 'सकाळी 9 पर्यंत रिकामी शेल्फ त्या सकाळी जास्त मागणी दर्शवते.',
      },
    },
    {
      id: 'SAT-RW-INFERENCE-01-Q3',
      topicCode: 'SAT-RW-INFERENCE-01',
      question:
        "Passage: \"Despite the coach's repeated warnings about the weather, the team continued practicing outside until the sky turned dark green.\" What does the passage suggest about the team?",
      options: [
        "They took the coach's warning seriously and stopped immediately.",
        'They ignored signs of worsening weather.',
        'They practiced indoors instead.',
        'They canceled practice early.',
      ],
      correctIndex: 1,
      difficulty: 'medium',
      explanation: {
        English: 'Continuing despite warnings suggests the team ignored the signs.',
        Hindi: 'चेतावनियों के बावजूद जारी रखना दर्शाता है कि टीम ने संकेतों को नजरअंदाज किया।',
        Marathi: 'इशाऱ्यांनंतरही सुरू ठेवणे दर्शवते की संघाने चिन्हे दुर्लक्षित केली.',
      },
    },
    {
      id: 'SAT-RW-INFERENCE-01-Q4',
      topicCode: 'SAT-RW-INFERENCE-01',
      question:
        'Passage: "The company published record profits the same week it announced layoffs, framing the cuts as necessary for \'long-term efficiency.\'" The passage most strongly suggests that:',
      options: [
        "The layoffs were unrelated to the company's financial performance.",
        "There may be a tension between the company's stated reason and its financial results.",
        'The company was losing money.',
        'Employees supported the layoffs.',
      ],
      correctIndex: 1,
      difficulty: 'hard',
      explanation: {
        English: 'Record profits alongside layoffs suggest the two may not be directly connected.',
        Hindi: 'रिकॉर्ड मुनाफे के साथ छंटनी बताती है कि दोनों सीधे तौर पर जुड़े नहीं हो सकते।',
        Marathi: 'विक्रमी नफ्यासह टाळेबंदी सुचवते की दोन्ही थेट जोडलेले नसू शकतात.',
      },
    },
  ],
};

/** Topics matching the student's chosen subjects; falls back to the full bank if none match. */
export function getTopicsForSubjects(subjects: string[]): TopicInfo[] {
  const matched = Object.values(TOPIC_BANK).filter((t) => subjects.includes(t.subject));
  return matched.length > 0 ? matched : Object.values(TOPIC_BANK);
}

/** Builds a compact diagnostic question set spanning the student's matched topics.
 * maxTopics defaults to the full bank size so a student's diagnostic always
 * covers every topic matching their selected subjects (important so the
 * later study plan, which is built from diagnosed topics, never has to
 * silently drop a subject the student picked).
 */
export function getDiagnosticQuestions(
  subjects: string[],
  maxTopics = 6,
  perTopic = 3
): BankQuestion[] {
  const topics = getTopicsForSubjects(subjects).slice(0, maxTopics);
  const questions: BankQuestion[] = [];
  topics.forEach((t) => {
    const bank = QUESTION_BANK[t.code] ?? [];
    questions.push(...bank.slice(0, perTopic));
  });
  return questions;
}

/** All SAT skill topics (both SAT Math and SAT Reading & Writing). */
export function getSatTopics(): TopicInfo[] {
  return Object.values(TOPIC_BANK).filter((t) => isSatSubject(t.subject));
}

/**
 * Builds the SAT diagnostic question set, spanning every SAT skill in the
 * bank. Unlike the general diagnostic (which is scoped to the student's
 * chosen subjects), SAT prep is opt-in on its own, so this always covers
 * the full small SAT bank rather than filtering by anything the student
 * picked during setup.
 */
export function getSatDiagnosticQuestions(perTopic = 3): BankQuestion[] {
  const topics = getSatTopics();
  const questions: BankQuestion[] = [];
  topics.forEach((t) => {
    const bank = QUESTION_BANK[t.code] ?? [];
    questions.push(...bank.slice(0, perTopic));
  });
  return questions;
}
