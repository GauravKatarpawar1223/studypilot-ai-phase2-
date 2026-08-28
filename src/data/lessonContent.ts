import type { Language } from '@/types';

/**
 * A short, scannable lesson for one topic — not a textbook chapter. Every
 * field is localized. This is a plain data structure (mirrors TOPIC_META's
 * pattern) precisely so that adding lesson content for a new topic never
 * requires touching any component code — just add an entry here.
 */
export interface LessonContent {
  /** 1-3 sentence explanation of the idea, in plain language. */
  concept: Record<Language, string>;
  /** 3-4 short bullet points: rules, formulas, or things to remember. */
  keyPoints: Record<Language, string[]>;
  /** One short worked example. */
  example: Record<Language, string>;
  /** One common mistake students make on this topic. */
  commonMistake: Record<Language, string>;
}

const DEFAULT_LESSON: LessonContent = {
  concept: {
    English: "A full lesson for this topic isn't ready yet — practice questions are still a great way to learn it.",
    Hindi: 'इस विषय के लिए पूरा पाठ अभी तैयार नहीं है — अभ्यास प्रश्न अभी भी इसे सीखने का एक शानदार तरीका हैं।',
    Marathi: 'या विषयासाठी पूर्ण धडा अजून तयार नाही — सराव प्रश्न अजूनही तो शिकण्याचा उत्तम मार्ग आहेत.',
  },
  keyPoints: {
    English: ['Try a few practice questions to see what you already know.'],
    Hindi: ['आप पहले से क्या जानते हैं यह देखने के लिए कुछ अभ्यास प्रश्न आज़माएं।'],
    Marathi: ['तुम्हाला आधीच काय माहीत आहे हे पाहण्यासाठी काही सराव प्रश्न करून पहा.'],
  },
  example: {
    English: 'Each practice question comes with an explanation, so you can learn as you go.',
    Hindi: 'प्रत्येक अभ्यास प्रश्न के साथ एक स्पष्टीकरण आता है, ताकि आप आगे बढ़ते हुए सीख सकें।',
    Marathi: 'प्रत्येक सराव प्रश्नासोबत एक स्पष्टीकरण असते, जेणेकरून तुम्ही पुढे जाताना शिकू शकाल.',
  },
  commonMistake: {
    English: "Don't worry about getting everything right the first time — that's what practice is for.",
    Hindi: 'पहली बार में सब कुछ सही करने की चिंता न करें — अभ्यास इसी के लिए है।',
    Marathi: 'पहिल्यांदाच सर्व काही बरोबर करण्याची काळजी करू नका — सराव यासाठीच असतो.',
  },
};

export const LESSON_CONTENT: Record<string, LessonContent> = {
  'MATH10-QE-01': {
    concept: {
      English:
        'A quadratic equation has the form ax² + bx + c = 0. To solve by factoring, rewrite it as two brackets multiplied together, then set each bracket to zero.',
      Hindi:
        'द्विघात समीकरण का रूप ax² + bx + c = 0 होता है। गुणनखंडन से हल करने के लिए, इसे दो कोष्ठकों के गुणनफल के रूप में लिखें, फिर प्रत्येक कोष्ठक को शून्य के बराबर रखें।',
      Marathi:
        'द्विघात समीकरणाचे रूप ax² + bx + c = 0 असते. गुणाकार पद्धतीने सोडवण्यासाठी, ते दोन कंसांच्या गुणाकाराच्या रूपात लिहा, नंतर प्रत्येक कंस शून्याच्या बरोबर ठेवा.',
    },
    keyPoints: {
      English: [
        'Standard form: ax² + bx + c = 0',
        'Find two numbers that multiply to a×c and add to b',
        'Split the middle term using those numbers, then factor by grouping',
        'Set each factor equal to 0 to get the two roots',
      ],
      Hindi: [
        'मानक रूप: ax² + bx + c = 0',
        'ऐसी दो संख्याएँ खोजें जिनका गुणनफल a×c और योग b हो',
        'उन संख्याओं से मध्य पद को विभाजित करें, फिर समूहन द्वारा गुणनखंड करें',
        'प्रत्येक गुणनखंड को 0 के बराबर रखकर दो मूल प्राप्त करें',
      ],
      Marathi: [
        'मानक रूप: ax² + bx + c = 0',
        'ज्यांचा गुणाकार a×c आणि बेरीज b असेल अशा दोन संख्या शोधा',
        'त्या संख्यांनी मधली संज्ञा विभागा, नंतर गटबद्ध करून गुणाकार करा',
        'प्रत्येक गुणाकार 0 च्या बरोबर ठेवून दोन मुळे मिळवा',
      ],
    },
    example: {
      English:
        'Solve x² - 5x + 6 = 0. Find two numbers that multiply to 6 and add to -5: -2 and -3. So (x-2)(x-3) = 0, giving x = 2 or x = 3.',
      Hindi:
        'x² - 5x + 6 = 0 हल करें। ऐसी दो संख्याएँ जिनका गुणनफल 6 और योग -5 हो: -2 और -3। तो (x-2)(x-3) = 0, अर्थात् x = 2 या x = 3।',
      Marathi:
        'x² - 5x + 6 = 0 सोडवा. ज्यांचा गुणाकार 6 आणि बेरीज -5 असेल अशा दोन संख्या: -2 आणि -3. म्हणून (x-2)(x-3) = 0, म्हणजे x = 2 किंवा x = 3.',
    },
    commonMistake: {
      English: 'Forgetting that a quadratic usually has TWO roots — many students stop after finding just one.',
      Hindi: 'यह भूल जाना कि द्विघात समीकरण के आमतौर पर दो मूल होते हैं — कई छात्र केवल एक मूल खोजकर रुक जाते हैं।',
      Marathi: 'द्विघात समीकरणाला सहसा दोन मुळे असतात हे विसरणे — अनेक विद्यार्थी फक्त एक मूळ शोधून थांबतात.',
    },
  },

  'MATH9-LE-01': {
    concept: {
      English:
        'A linear equation in two variables has the form ax + by + c = 0, where x and y are unknowns. Its graph is always a straight line.',
      Hindi:
        'दो चरों वाले रैखिक समीकरण का रूप ax + by + c = 0 होता है, जहाँ x और y अज्ञात हैं। इसका आलेख हमेशा एक सीधी रेखा होता है।',
      Marathi:
        'दोन चलांच्या रेषीय समीकरणाचे रूप ax + by + c = 0 असते, जिथे x आणि y अज्ञात असतात. त्याचा आलेख नेहमी सरळ रेषा असतो.',
    },
    keyPoints: {
      English: [
        'General form: ax + by + c = 0',
        'A single equation has infinitely many (x, y) solutions',
        'Every point on the line is a solution',
        'Two such equations together can be solved for one unique (x, y)',
      ],
      Hindi: [
        'सामान्य रूप: ax + by + c = 0',
        'एक समीकरण के अनंत (x, y) हल होते हैं',
        'रेखा पर हर बिंदु एक हल है',
        'ऐसे दो समीकरणों को साथ हल करने पर एक अद्वितीय (x, y) मिलता है',
      ],
      Marathi: [
        'सामान्य रूप: ax + by + c = 0',
        'एका समीकरणाला अनंत (x, y) उकल असतात',
        'रेषेवरील प्रत्येक बिंदू एक उकल आहे',
        'अशी दोन समीकरणे एकत्र सोडवल्यास एक निश्चित (x, y) मिळते',
      ],
    },
    example: {
      English: 'For 2x + y = 7, if x = 2 then y = 3, since 2(2) + 3 = 7. So (2, 3) is one solution.',
      Hindi: '2x + y = 7 के लिए, यदि x = 2 है तो y = 3, क्योंकि 2(2) + 3 = 7। तो (2, 3) एक हल है।',
      Marathi: '2x + y = 7 साठी, जर x = 2 असेल तर y = 3, कारण 2(2) + 3 = 7. म्हणून (2, 3) ही एक उकल आहे.',
    },
    commonMistake: {
      English:
        'Thinking one linear equation has only one solution — it actually has infinitely many, one for every point on the line.',
      Hindi:
        'यह सोचना कि एक रैखिक समीकरण का केवल एक हल होता है — वास्तव में इसके अनंत हल होते हैं, रेखा के हर बिंदु के लिए एक।',
      Marathi:
        'एका रेषीय समीकरणाला फक्त एकच उकल असते असे वाटणे — प्रत्यक्षात त्याला अनंत उकली असतात, रेषेवरील प्रत्येक बिंदूसाठी एक.',
    },
  },

  'SCI10-LIGHT-02': {
    concept: {
      English: 'When light hits a mirror, it bounces back following two simple rules called the laws of reflection.',
      Hindi: 'जब प्रकाश दर्पण से टकराता है, तो वह दो सरल नियमों के अनुसार वापस लौटता है जिन्हें परावर्तन के नियम कहते हैं।',
      Marathi: 'प्रकाश आरशावर आदळतो तेव्हा तो परावर्तनाच्या नियम नावाच्या दोन साध्या नियमांनुसार परत जातो.',
    },
    keyPoints: {
      English: [
        'Angle of incidence = Angle of reflection',
        'The incident ray, reflected ray, and normal all lie in the same plane',
        'The normal is drawn perpendicular to the mirror at the point of contact',
        'A plane mirror always forms a virtual, upright image',
      ],
      Hindi: [
        'आपतन कोण = परावर्तन कोण',
        'आपतित किरण, परावर्तित किरण और अभिलंब एक ही तल में होते हैं',
        'अभिलंब संपर्क बिंदु पर दर्पण के लंबवत खींचा जाता है',
        'समतल दर्पण हमेशा आभासी, सीधा प्रतिबिंब बनाता है',
      ],
      Marathi: [
        'आपाती कोन = परावर्तन कोन',
        'आपाती किरण, परावर्तित किरण आणि लंब एकाच प्रतलात असतात',
        'लंब संपर्क बिंदूवर आरशाला लंबरूप काढला जातो',
        'सपाट आरसा नेहमी आभासी, सरळ प्रतिमा तयार करतो',
      ],
    },
    example: {
      English: 'If light hits a mirror at 30° from the normal, it reflects off at exactly 30° on the other side of the normal.',
      Hindi: 'यदि प्रकाश अभिलंब से 30° के कोण पर दर्पण से टकराता है, तो वह अभिलंब के दूसरी ओर ठीक 30° पर परावर्तित होता है।',
      Marathi: 'जर प्रकाश लंबापासून 30° कोनात आरशावर आदळला, तर तो लंबाच्या दुसऱ्या बाजूला बरोबर 30° वर परावर्तित होतो.',
    },
    commonMistake: {
      English: 'Measuring the angle from the mirror surface instead of from the normal (the perpendicular line).',
      Hindi: 'कोण को दर्पण की सतह से मापना, न कि अभिलंब (लंबवत रेखा) से।',
      Marathi: 'कोन आरशाच्या पृष्ठभागापासून मोजणे, लंबापासून (लंबरूप रेषेपासून) नाही.',
    },
  },

  'SCI10-ACID-01': {
    concept: {
      English:
        'Acids and bases are opposite types of chemical substances that can be identified by how they react with litmus paper and by their pH.',
      Hindi: 'अम्ल और क्षार दो विपरीत प्रकार के रासायनिक पदार्थ हैं जिन्हें लिटमस पेपर और pH से पहचाना जा सकता है।',
      Marathi: 'आम्ल आणि आम्लारी हे दोन विरुद्ध प्रकारचे रासायनिक पदार्थ आहेत जे लिटमस पेपर आणि pH ने ओळखता येतात.',
    },
    keyPoints: {
      English: [
        'Acids turn blue litmus red; bases turn red litmus blue',
        'pH scale runs 0–14: below 7 is acidic, above 7 is basic, 7 is neutral',
        'Acids taste sour (e.g., lemon); bases feel soapy (e.g., soap)',
        'Common lab base: Sodium hydroxide (NaOH)',
      ],
      Hindi: [
        'अम्ल नीले लिटमस को लाल करते हैं; क्षार लाल लिटमस को नीला करते हैं',
        'pH स्केल 0–14: 7 से कम अम्लीय, 7 से अधिक क्षारीय, 7 उदासीन',
        'अम्ल खट्टे होते हैं (जैसे नींबू); क्षार साबुन जैसे महसूस होते हैं',
        'सामान्य प्रयोगशाला क्षार: सोडियम हाइड्रॉक्साइड (NaOH)',
      ],
      Marathi: [
        'आम्ल निळ्या लिटमसला लाल करते; आम्लारी लाल लिटमसला निळे करते',
        'pH स्केल 0–14: 7 पेक्षा कमी आम्लधर्मी, 7 पेक्षा जास्त आम्लारीधर्मी, 7 उदासीन',
        'आम्ल आंबट असते (उदा. लिंबू); आम्लारी साबणासारखे वाटते',
        'सामान्य प्रयोगशाळा आम्लारी: सोडियम हायड्रॉक्साइड (NaOH)',
      ],
    },
    example: {
      English: "Lemon juice turns blue litmus paper red and has a pH around 2, so it's a strong acid.",
      Hindi: 'नींबू का रस नीले लिटमस पेपर को लाल कर देता है और इसका pH लगभग 2 है, इसलिए यह एक तेज़ अम्ल है।',
      Marathi: 'लिंबाचा रस निळ्या लिटमस पेपरला लाल करतो आणि त्याचा pH सुमारे 2 असतो, म्हणून ते तीव्र आम्ल आहे.',
    },
    commonMistake: {
      English: "Mixing up which litmus color change means acid vs. base — remember: acid turns litmus red.",
      Hindi: 'यह भ्रमित करना कि किस लिटमस रंग परिवर्तन का मतलब अम्ल है और किसका क्षार — याद रखें: अम्ल लिटमस को लाल करता है।',
      Marathi: 'कोणता लिटमस रंगबदल आम्ल दर्शवतो आणि कोणता आम्लारी याबद्दल गोंधळ करणे — लक्षात ठेवा: आम्ल लिटमसला लाल करते.',
    },
  },

  'ENG9-POEM-03': {
    concept: {
      English:
        'This poem by Robert Frost is about a traveler choosing between two roads in a forest — a metaphor for making choices in life.',
      Hindi:
        'रॉबर्ट फ्रॉस्ट की यह कविता एक यात्री के बारे में है जो जंगल में दो रास्तों में से एक चुनता है — यह जीवन में निर्णय लेने का एक रूपक है।',
      Marathi:
        'रॉबर्ट फ्रॉस्ट यांची ही कविता एका प्रवाशाबद्दल आहे जो जंगलात दोन वाटांपैकी एक निवडतो — हे जीवनातील निर्णय घेण्याचे एक रूपक आहे.',
    },
    keyPoints: {
      English: [
        'Written by Robert Frost',
        'The two roads represent life choices',
        'The tone is thoughtful and reflective, not sad',
        'The poem is about the impact of a choice, not regret over it',
      ],
      Hindi: [
        'रॉबर्ट फ्रॉस्ट द्वारा लिखित',
        'दो रास्ते जीवन के विकल्पों का प्रतिनिधित्व करते हैं',
        'स्वर विचारशील है, दुखी नहीं',
        'कविता विकल्प के प्रभाव के बारे में है, पछतावे के बारे में नहीं',
      ],
      Marathi: [
        'रॉबर्ट फ्रॉस्ट यांनी लिहिली',
        'दोन वाटा जीवनातील निवडींचे प्रतिनिधित्व करतात',
        'सूर विचारशील आहे, दुःखी नाही',
        'कविता निवडीच्या परिणामाबद्दल आहे, पश्चातापाबद्दल नाही',
      ],
    },
    example: {
      English: "The traveler says he 'took the one less traveled by' — meaning he chose the less common path.",
      Hindi: "यात्री कहता है कि उसने 'वह रास्ता चुना जो कम चला गया था' — यानी उसने कम आम रास्ता चुना।",
      Marathi: "प्रवासी म्हणतो की त्याने 'कमी वापरलेली वाट निवडली' — म्हणजे त्याने कमी सामान्य वाट निवडली.",
    },
    commonMistake: {
      English:
        'Assuming the poem says one road was clearly better — Frost actually describes both roads as almost equally worn.',
      Hindi:
        'यह मान लेना कि कविता स्पष्ट रूप से कहती है कि एक रास्ता बेहतर था — फ्रॉस्ट वास्तव में दोनों रास्तों को लगभग समान रूप से घिसा हुआ बताते हैं।',
      Marathi:
        'कविता स्पष्टपणे सांगते की एक वाट चांगली होती असे गृहीत धरणे — फ्रॉस्ट प्रत्यक्षात दोन्ही वाटा जवळपास सारख्याच वापरलेल्या असल्याचे सांगतात.',
    },
  },

  'ENG8-GRAM-01': {
    concept: {
      English: 'Tenses show WHEN an action happens — in the past, present, or future — by changing the verb form.',
      Hindi: 'काल यह दर्शाते हैं कि कोई क्रिया कब होती है — भूत, वर्तमान या भविष्य में — क्रिया के रूप को बदलकर।',
      Marathi: 'काळ हे दर्शवतात की एखादी क्रिया कधी घडते — भूत, वर्तमान किंवा भविष्यात — क्रियापदाचे रूप बदलून.',
    },
    keyPoints: {
      English: [
        "Present continuous: is/am/are + verb-ing (e.g., 'is going')",
        "Simple past: usually verb + -ed, but many verbs are irregular (e.g., 'write' → 'wrote')",
        "Future: will + base verb (e.g., 'will go')",
        "Present perfect: have/has + past participle (e.g., 'have finished')",
      ],
      Hindi: [
        "वर्तमान सतत: is/am/are + verb-ing (जैसे 'is going')",
        "सामान्य भूतकाल: आमतौर पर verb + -ed, पर कई क्रियाएँ अनियमित हैं (जैसे 'write' → 'wrote')",
        "भविष्य: will + मूल क्रिया (जैसे 'will go')",
        "वर्तमान पूर्ण: have/has + past participle (जैसे 'have finished')",
      ],
      Marathi: [
        "वर्तमान चालू: is/am/are + verb-ing (उदा. 'is going')",
        "साधा भूतकाळ: सहसा verb + -ed, पण अनेक क्रियापदे अनियमित असतात (उदा. 'write' → 'wrote')",
        "भविष्यकाळ: will + मूळ क्रियापद (उदा. 'will go')",
        "वर्तमान पूर्ण: have/has + past participle (उदा. 'have finished')",
      ],
    },
    example: {
      English:
        "'She is going to school' (happening now) vs. 'She went to school' (already happened) vs. 'She will go to school' (hasn't happened yet).",
      Hindi:
        "'She is going to school' (अभी हो रहा है) बनाम 'She went to school' (पहले ही हो चुका) बनाम 'She will go to school' (अभी नहीं हुआ)।",
      Marathi:
        "'She is going to school' (आत्ता घडत आहे) विरुद्ध 'She went to school' (आधीच घडले) विरुद्ध 'She will go to school' (अजून घडलेले नाही).",
    },
    commonMistake: {
      English: "Mixing tenses in one sentence, e.g., 'I will went home' instead of 'I will go home.'",
      Hindi: "एक ही वाक्य में काल मिलाना, जैसे 'I will went home' के बजाय 'I will go home' कहना।",
      Marathi: "एकाच वाक्यात काळ मिसळणे, उदा. 'I will went home' ऐवजी 'I will go home' म्हणणे.",
    },
  },

  'SAT-MATH-LINEQ-01': {
    concept: {
      English:
        'SAT linear equation questions ask you to solve for an unknown using basic algebra — isolate the variable on one side.',
      Hindi:
        'SAT रैखिक समीकरण प्रश्नों में आपको मूल बीजगणित का उपयोग करके एक अज्ञात राशि हल करनी होती है — चर को एक तरफ अलग करें।',
      Marathi:
        'SAT रेषीय समीकरण प्रश्नांमध्ये तुम्हाला मूळ बीजगणित वापरून एक अज्ञात राशी सोडवावी लागते — चल एका बाजूला वेगळे करा.',
    },
    keyPoints: {
      English: [
        'Move constants to one side, variables to the other',
        'Whatever you do to one side, do to the other',
        'Check your answer by substituting it back into the original equation',
        'Watch for equations with fractions or parentheses — simplify first',
      ],
      Hindi: [
        'स्थिरांकों को एक तरफ, चरों को दूसरी तरफ ले जाएँ',
        'जो भी एक तरफ करें, वही दूसरी तरफ भी करें',
        'उत्तर को मूल समीकरण में रखकर जाँचें',
        'भिन्न या कोष्ठक वाले समीकरणों में पहले सरल करें',
      ],
      Marathi: [
        'स्थिरांक एका बाजूला, चल दुसऱ्या बाजूला न्या',
        'जे एका बाजूला कराल तेच दुसऱ्या बाजूलाही करा',
        'उत्तर मूळ समीकरणात ठेवून तपासा',
        'अपूर्णांक किंवा कंस असलेली समीकरणे आधी सुलभ करा',
      ],
    },
    example: {
      English: 'Solve 2x + 3 = 11: subtract 3 from both sides (2x = 8), then divide by 2 (x = 4).',
      Hindi: '2x + 3 = 11 हल करें: दोनों तरफ से 3 घटाएँ (2x = 8), फिर 2 से भाग दें (x = 4)।',
      Marathi: '2x + 3 = 11 सोडवा: दोन्ही बाजूंनी 3 वजा करा (2x = 8), नंतर 2 ने भागा (x = 4).',
    },
    commonMistake: {
      English: "Forgetting to apply an operation to BOTH sides of the equation, which breaks the equality.",
      Hindi: 'समीकरण के दोनों तरफ एक क्रिया लागू करना भूल जाना, जिससे समानता टूट जाती है।',
      Marathi: 'समीकरणाच्या दोन्ही बाजूंना क्रिया लागू करायला विसरणे, ज्यामुळे समानता बिघडते.',
    },
  },

  'SAT-MATH-QUADEQ-01': {
    concept: {
      English:
        'SAT quadratic questions test whether you can find roots, use factoring, or apply properties like the sum and product of roots.',
      Hindi:
        'SAT द्विघात प्रश्न यह जाँचते हैं कि क्या आप मूल खोज सकते हैं, गुणनखंडन कर सकते हैं, या मूलों के योग/गुणनफल जैसे गुणधर्मों का उपयोग कर सकते हैं।',
      Marathi:
        'SAT द्विघात प्रश्न तपासतात की तुम्ही मुळे शोधू शकता, गुणाकार करू शकता, किंवा मुळांची बेरीज/गुणाकार यासारखे गुणधर्म वापरू शकता का.',
    },
    keyPoints: {
      English: [
        'Standard form: ax² + bx + c = 0',
        'Sum of roots = -b/a; Product of roots = c/a',
        'A quadratic has exactly one root when its discriminant (b² - 4ac) = 0',
        "Try factoring first — it's usually faster than the quadratic formula on the SAT",
      ],
      Hindi: [
        'मानक रूप: ax² + bx + c = 0',
        'मूलों का योग = -b/a; मूलों का गुणनफल = c/a',
        'जब विविक्तकर (b² - 4ac) = 0 हो तो द्विघात का ठीक एक मूल होता है',
        'पहले गुणनखंडन आज़माएँ — यह SAT पर आमतौर पर सूत्र से तेज़ है',
      ],
      Marathi: [
        'मानक रूप: ax² + bx + c = 0',
        'मुळांची बेरीज = -b/a; मुळांचा गुणाकार = c/a',
        'जेव्हा विविक्षक (b² - 4ac) = 0 असतो तेव्हा द्विघाताला बरोबर एक मूळ असते',
        'आधी गुणाकार करून पहा — हे SAT वर सहसा सूत्रापेक्षा जलद असते',
      ],
    },
    example: {
      English:
        'For x² - 5x + 6 = 0, the sum of roots is -(-5)/1 = 5 and the product is 6/1 = 6 — matching roots 2 and 3.',
      Hindi:
        'x² - 5x + 6 = 0 के लिए, मूलों का योग -(-5)/1 = 5 और गुणनफल 6/1 = 6 है — जो मूल 2 और 3 से मेल खाता है।',
      Marathi:
        'x² - 5x + 6 = 0 साठी, मुळांची बेरीज -(-5)/1 = 5 आणि गुणाकार 6/1 = 6 आहे — जे मुळे 2 आणि 3 शी जुळते.',
    },
    commonMistake: {
      English: 'Forgetting the negative sign in the sum-of-roots formula (-b/a, not b/a).',
      Hindi: 'मूलों के योग सूत्र में ऋण चिह्न भूल जाना (-b/a, न कि b/a)।',
      Marathi: 'मुळांच्या बेरीज सूत्रात वजा चिन्ह विसरणे (-b/a, b/a नाही).',
    },
  },

  'SAT-MATH-PROBSOLVE-01': {
    concept: {
      English:
        'These SAT questions apply math — ratios, percentages, rates — to real-world word problems. The key is translating words into an equation.',
      Hindi:
        'ये SAT प्रश्न गणित को — अनुपात, प्रतिशत, दर — वास्तविक समस्याओं पर लागू करते हैं। मुख्य बात है शब्दों को समीकरण में बदलना।',
      Marathi:
        'हे SAT प्रश्न गणित — गुणोत्तर, टक्केवारी, दर — वास्तविक समस्यांवर लागू करतात. मुख्य गोष्ट म्हणजे शब्दांचे समीकरणात रूपांतर करणे.',
    },
    keyPoints: {
      English: [
        "Read carefully and identify what's given vs. what's asked",
        'Percent change: (new - old) / old × 100',
        'Rate = distance ÷ time (or similar quantity ÷ quantity)',
        'Set up a proportion for ratio problems',
      ],
      Hindi: [
        'ध्यान से पढ़ें और पहचानें कि क्या दिया गया है बनाम क्या पूछा गया है',
        'प्रतिशत परिवर्तन: (नया - पुराना) / पुराना × 100',
        'दर = दूरी ÷ समय (या समान राशियाँ)',
        'अनुपात समस्याओं के लिए एक अनुपात समीकरण बनाएँ',
      ],
      Marathi: [
        'काळजीपूर्वक वाचा आणि काय दिले आहे विरुद्ध काय विचारले आहे ते ओळखा',
        'टक्केवारी बदल: (नवीन - जुने) / जुने × 100',
        'दर = अंतर ÷ वेळ (किंवा तत्सम राशी)',
        'गुणोत्तर समस्यांसाठी एक प्रमाण समीकरण मांडा',
      ],
    },
    example: {
      English: "A $20 shirt is the price after a 20% discount. Since 0.8 × original = 20, the original price was $25.",
      Hindi: '$20 की शर्ट 20% छूट के बाद की कीमत है। चूँकि 0.8 × मूल कीमत = 20, मूल कीमत $25 थी।',
      Marathi: '$20 चा शर्ट 20% सवलतीनंतरची किंमत आहे. 0.8 × मूळ किंमत = 20 असल्याने, मूळ किंमत $25 होती.',
    },
    commonMistake: {
      English:
        'Applying a percentage to the wrong base value — e.g., calculating 20% of the discounted price instead of the original price.',
      Hindi:
        'प्रतिशत को गलत आधार मान पर लागू करना — जैसे मूल कीमत के बजाय छूट वाली कीमत का 20% निकालना।',
      Marathi:
        'टक्केवारी चुकीच्या मूळ मूल्यावर लागू करणे — उदा. मूळ किमतीऐवजी सवलतीच्या किमतीची 20% काढणे.',
    },
  },

  'SAT-RW-MAINIDEA-01': {
    concept: {
      English:
        "Main idea questions ask what a passage is mostly about — not a small detail, but the overall point the author is making.",
      Hindi:
        'मुख्य विचार प्रश्न पूछते हैं कि एक अनुच्छेद मुख्यतः किस बारे में है — कोई छोटा विवरण नहीं, बल्कि लेखक का समग्र बिंदु।',
      Marathi:
        'मुख्य कल्पना प्रश्न विचारतात की एखादा उतारा प्रामुख्याने कशाबद्दल आहे — एखादा छोटा तपशील नाही, तर लेखकाचा एकूण मुद्दा.',
    },
    keyPoints: {
      English: [
        'Look at the first and last sentences — they often summarize the point',
        'Eliminate answers that are too narrow (just one detail) or too broad (not in the passage)',
        'The correct answer covers the WHOLE passage, not just part of it',
        "Watch for answer choices that sound true but aren't what the passage is actually about",
      ],
      Hindi: [
        'पहले और अंतिम वाक्य देखें — वे अक्सर बिंदु को संक्षेप में बताते हैं',
        'उन उत्तरों को हटाएँ जो बहुत संकीर्ण (केवल एक विवरण) या बहुत व्यापक (अनुच्छेद में नहीं) हैं',
        'सही उत्तर पूरे अनुच्छेद को कवर करता है, केवल एक हिस्से को नहीं',
        'उन विकल्पों से सावधान रहें जो सच लगते हैं पर अनुच्छेद का वास्तविक बिंदु नहीं हैं',
      ],
      Marathi: [
        'पहिले आणि शेवटचे वाक्य पहा — ते सहसा मुद्दा थोडक्यात मांडतात',
        'जे उत्तर खूप संकुचित (फक्त एक तपशील) किंवा खूप व्यापक (उताऱ्यात नाही) आहेत ते वगळा',
        'योग्य उत्तर संपूर्ण उतारा कव्हर करते, फक्त एक भाग नाही',
        'जे पर्याय खरे वाटतात पण उताऱ्याचा खरा मुद्दा नाहीत त्यांपासून सावध रहा',
      ],
    },
    example: {
      English:
        'A passage about community gardens building neighbor connections AND providing food — the main idea combines both, not just one.',
      Hindi:
        'सामुदायिक बगीचों के बारे में एक अनुच्छेद जो पड़ोसियों के जुड़ाव और भोजन दोनों बनाता है — मुख्य विचार दोनों को जोड़ता है, केवल एक को नहीं।',
      Marathi:
        'सामुदायिक बागांबद्दलचा उतारा जो शेजाऱ्यांचे नाते आणि अन्न दोन्ही तयार करतो — मुख्य कल्पना दोन्ही जोडते, फक्त एक नाही.',
    },
    commonMistake: {
      English:
        "Picking an answer that's true and mentioned in the passage, but is only a supporting detail rather than the main point.",
      Hindi:
        'ऐसा उत्तर चुनना जो सच है और अनुच्छेद में उल्लिखित है, पर मुख्य बिंदु के बजाय केवल एक सहायक विवरण है।',
      Marathi:
        'जे उत्तर खरे आहे आणि उताऱ्यात नमूद आहे, पण मुख्य मुद्द्याऐवजी फक्त एक सहाय्यक तपशील आहे ते निवडणे.',
    },
  },

  'SAT-RW-GRAMMAR-01': {
    concept: {
      English:
        'SAT grammar questions test standard English rules: subject-verb agreement, punctuation, and correct pronoun use.',
      Hindi:
        'SAT व्याकरण प्रश्न मानक अंग्रेज़ी नियमों की जाँच करते हैं: कर्ता-क्रिया सहमति, विराम चिह्न, और सही सर्वनाम प्रयोग।',
      Marathi:
        'SAT व्याकरण प्रश्न प्रमाणित इंग्रजी नियम तपासतात: कर्ता-क्रियापद सुसंगती, विरामचिन्हे, आणि योग्य सर्वनाम वापर.',
    },
    keyPoints: {
      English: [
        "Singular subjects (each, everyone) take singular verbs (has, not have)",
        "Use commas to separate items in a list, including before 'and' (Oxford comma)",
        "Use 'me' (not 'I') as the object after a preposition, like 'between you and me'",
        'Modifiers should clearly describe the correct noun, placed right next to it',
      ],
      Hindi: [
        "एकवचन कर्ता (each, everyone) एकवचन क्रिया लेते हैं (has, not have)",
        "सूची में वस्तुओं को अलग करने के लिए अल्पविराम का उपयोग करें, 'and' से पहले भी (Oxford comma)",
        "preposition के बाद 'me' (न कि 'I') का उपयोग करें, जैसे 'between you and me'",
        'Modifiers को सही संज्ञा का स्पष्ट वर्णन करना चाहिए, उसके ठीक बगल में रखा जाना चाहिए',
      ],
      Marathi: [
        "एकवचनी कर्ता (each, everyone) एकवचनी क्रियापद घेतात (has, not have)",
        "यादीतील वस्तू वेगळ्या करण्यासाठी स्वल्पविराम वापरा, 'and' आधीही (Oxford comma)",
        "preposition नंतर 'me' (I नाही) वापरा, उदा. 'between you and me'",
        'Modifiers ने योग्य नामाचे स्पष्ट वर्णन करावे, त्याच्या अगदी शेजारी ठेवावे',
      ],
    },
    example: {
      English: "'Each of the students has a book' is correct — 'each' is singular, so it needs 'has.'",
      Hindi: "'Each of the students has a book' सही है — 'each' एकवचन है, इसलिए इसे 'has' चाहिए।",
      Marathi: "'Each of the students has a book' बरोबर आहे — 'each' एकवचनी आहे, म्हणून त्याला 'has' हवे.",
    },
    commonMistake: {
      English:
        "Using 'I' instead of 'me' after a preposition, e.g., saying 'between you and I' instead of 'between you and me.'",
      Hindi:
        "preposition के बाद 'I' के बजाय 'me' का उपयोग न करना, जैसे 'between you and me' के बजाय 'between you and I' कहना।",
      Marathi:
        "preposition नंतर 'I' ऐवजी 'me' न वापरणे, उदा. 'between you and me' ऐवजी 'between you and I' म्हणणे.",
    },
  },

  'SAT-RW-INFERENCE-01': {
    concept: {
      English:
        "Inference questions ask what the passage suggests but doesn't say directly — you have to read between the lines using evidence in the text.",
      Hindi:
        'अनुमान प्रश्न पूछते हैं कि अनुच्छेद क्या संकेत देता है पर सीधे नहीं कहता — आपको पाठ में सबूत का उपयोग करके पंक्तियों के बीच पढ़ना होता है।',
      Marathi:
        'अनुमान प्रश्न विचारतात की उतारा काय सुचवतो पण थेट सांगत नाही — तुम्हाला मजकुरातील पुराव्याचा वापर करून ओळींमधील अर्थ वाचावा लागतो.',
    },
    keyPoints: {
      English: [
        'The answer must be supported by the passage, not just plausible in general',
        'Avoid answers that require outside knowledge not given in the text',
        "Look for word clues — cause/effect, contrast words like 'despite' or 'however'",
        'The best inference is the smallest logical step from what is stated',
      ],
      Hindi: [
        'उत्तर को अनुच्छेद द्वारा समर्थित होना चाहिए, केवल सामान्यतः प्रशंसनीय नहीं',
        'ऐसे उत्तरों से बचें जिनके लिए पाठ में न दी गई बाहरी जानकारी चाहिए',
        "शब्द संकेतों की तलाश करें — कारण/प्रभाव, 'despite' या 'however' जैसे विरोधाभासी शब्द",
        'सबसे अच्छा अनुमान जो कहा गया है उससे सबसे छोटा तार्किक कदम है',
      ],
      Marathi: [
        'उत्तराला उताऱ्याचा आधार असला पाहिजे, फक्त सर्वसाधारणपणे शक्य नाही',
        'मजकुरात न दिलेल्या बाह्य माहितीची गरज असलेली उत्तरे टाळा',
        "शब्द संकेत शोधा — कारण/परिणाम, 'despite' किंवा 'however' सारखे विरोधाभासी शब्द",
        'सर्वोत्तम अनुमान हे सांगितलेल्या गोष्टीपासूनचे सर्वात लहान तार्किक पाऊल असते',
      ],
    },
    example: {
      English:
        "'Maria packed an umbrella and boots' lets you infer she expects rain, even though the passage never says 'rain' directly.",
      Hindi:
        "'मारिया ने छाता और बूट पैक किए' से आप अनुमान लगा सकते हैं कि वह बारिश की उम्मीद कर रही है, भले ही अनुच्छेद कभी सीधे 'बारिश' न कहे।",
      Marathi:
        "'मारियाने छत्री आणि बूट पॅक केले' यावरून तुम्ही अनुमान काढू शकता की तिला पावसाची अपेक्षा आहे, जरी उतारा कधीही थेट 'पाऊस' म्हणत नसला तरी.",
    },
    commonMistake: {
      English:
        "Choosing an answer that might be true in real life but isn't actually supported by evidence in the passage.",
      Hindi:
        'ऐसा उत्तर चुनना जो वास्तविक जीवन में सच हो सकता है पर अनुच्छेद में सबूत द्वारा वास्तव में समर्थित नहीं है।',
      Marathi:
        'जे उत्तर प्रत्यक्ष आयुष्यात खरे असू शकते पण उताऱ्यातील पुराव्याने प्रत्यक्षात समर्थित नाही ते निवडणे.',
    },
  },
};

/** Always returns lesson content, falling back to a graceful generic lesson for any topic not yet authored. */
export function getLessonContent(topicCode: string): LessonContent {
  return LESSON_CONTENT[topicCode] ?? DEFAULT_LESSON;
}
