// Ordered newest first — the deck reads as a reverse chronology.
export const projects = [
  {
    id: 'money-mule',
    kicker: 'Machine Learning · AML',
    title: 'Money-Mule Detection Model',
    context: 'EADA Business School — with MyInvestor',
    timeline: 'Feb 2026 — Jul 2026',
    description:
      'An interpretable binary-classification model that flags money-mule accounts for MyInvestor, a Spanish digital investment platform. It feeds an anti-money-laundering workflow that outputs risk scores for human compliance review rather than automated decisions, so every modelling choice was made for auditability first.',
    figure: { value: '3,000', label: 'accounts analysed' },
    stack: ['Python', 'Scikit-learn', 'Gradient Boosting', 'SHAP'],
  },
  {
    id: 'cardiomegaly',
    kicker: 'Computer Vision · Healthcare',
    title: 'Cardiomegaly Detection from Chest X-Rays',
    context: 'EADA Business School — Datathon',
    timeline: 'Apr 2026',
    description:
      'An end-to-end computer-vision system that detects cardiomegaly from chest X-rays, built in five days. It runs the full PyTorch pipeline — preprocessing, augmentation, training, validation, evaluation — behind a web app where doctors upload an X-ray and receive a prediction with clinical-support context.',
    figure: { value: '5 days', label: 'from brief to working app' },
    stack: ['PyTorch', 'CNNs', 'Computer Vision'],
  },
  {
    id: 'nutripilot',
    kicker: 'Full-Stack · PWA',
    title: 'NutriPilot — Nutrition & Meal Planning',
    context: 'Personal Project',
    timeline: 'May 2025 — Sep 2025',
    description:
      'A nutrition and meal-planning progressive web app written from scratch in plain HTML, CSS and JavaScript. I owned the whole lifecycle — Figma UX design, frontend, backend, deployment — and added offline support and installability through the Service Worker API for full PWA compliance.',
    figure: { value: '0', label: 'frameworks used' },
    stack: ['JavaScript', 'Service Workers', 'Figma'],
  },
  {
    id: 'disease-diagnosis',
    kicker: 'Machine Learning',
    title: 'ML-Based Disease Diagnosis System',
    context: 'Universität Tübingen',
    timeline: 'Apr 2023 — Aug 2023',
    description:
      'A MATLAB diagnostic tool that combines geographic and meteorological datasets to estimate regional disease likelihood. Several machine-learning algorithms run side by side so their predictions can be compared and analysed against each other.',
    figure: null,
    stack: ['MATLAB', 'Machine Learning'],
  },
  {
    id: 'speech-commands',
    kicker: 'Deep Learning · Audio',
    title: 'Speech Command Recognition System',
    context: 'Universität Tübingen',
    timeline: 'Dec 2022 — Feb 2023',
    description:
      'A two-stage speech-recognition system — keyword detection followed by command detection — built on CNNs that read Mel-spectrograms from the Speech Commands dataset. Implemented and optimised in PyTorch with regularisation and a full performance evaluation.',
    figure: { value: '95%', label: 'accuracy across 34 spoken commands' },
    stack: ['PyTorch', 'CNNs', 'Audio Processing'],
  },
]
