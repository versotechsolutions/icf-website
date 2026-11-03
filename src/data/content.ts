/**
 * Client-supplied page copy. Text is reproduced from the source documents with only
 * light typographic clean-up (spelling of headings, sentence case). The source file for each
 * block is noted above it. See docs/content-mapping.md for the full mapping.
 */
import type { Award, FaqItem, LabelledText, RegistrationFee, ScheduleItem } from '@/types';

/* ------------------------------------------------------------------ About ICF
 * Sources: Organaization site/About ICF.docx, event details site/About ICF.docx,
 * Organization Home page Details.docx */
export const aboutIntro = [
  'International Conference Forum (ICF) is a dedicated platform designed to connect researchers, academicians, students, industry professionals, and conference organizers from around the world.',
  'Our mission is to make it easier for people to discover academic conferences, international seminars, workshops, symposiums, and research events across various fields and disciplines.',
  'We aim to provide a reliable and accessible platform where individuals can explore upcoming conferences, learn about important academic events, and discover opportunities to present their research, exchange ideas, and build professional connections.',
];

export const mission =
  'Our mission is to simplify conference discovery and promote knowledge sharing by connecting people with relevant academic and professional events worldwide.';

export const vision =
  'Our vision is to become a trusted global destination for discovering conferences, encouraging collaboration, and supporting the advancement of research, education, and innovation.';

export const visionForExcellence: LabelledText[] = [
  { title: 'Promoting global research', text: 'To connect researchers, academicians, and professionals worldwide to share knowledge and innovative ideas.' },
  { title: 'Encouraging innovation', text: 'To provide a platform for collaboration, scientific advancement, and excellence across diverse disciplines.' },
  { title: 'Building a global community', text: 'To create meaningful opportunities for networking, learning, and international research partnerships.' },
];

export const coreValues: LabelledText[] = [
  { title: 'Academic excellence', text: 'We encourage high-quality research, innovative thinking, and continuous learning to advance knowledge across diverse academic disciplines.' },
  { title: 'Global collaboration', text: 'We connect researchers, academicians, students, and professionals to exchange ideas and build meaningful international partnerships.' },
  { title: 'Innovation and creativity', text: 'We support new ideas, emerging technologies, and innovative research that contribute to academic and professional development.' },
  { title: 'Integrity and transparency', text: 'We value ethical research practices, professional conduct, fairness, and clear communication throughout the conference experience.' },
];

export const whyChooseIcf: LabelledText[] = [
  { title: 'International research opportunities', text: 'Explore conferences across multiple disciplines and connect with a wider academic community.' },
  { title: 'Research presentation platform', text: 'Share your findings, present original research, and receive valuable feedback from fellow participants.' },
  { title: 'Professional networking', text: 'Build connections with researchers, students, academicians, and industry professionals.' },
  { title: 'Convenient conference access', text: 'Discover upcoming conferences, review event details, and find registration information through one platform.' },
  { title: 'Knowledge sharing and growth', text: 'Discover emerging research trends, exchange perspectives, and identify opportunities for future collaboration.' },
];

/* Four pillars — from the client-supplied homepage banner artwork */
export const pillars = ['Global networking', 'Knowledge sharing', 'Collaboration opportunities', 'Impactful research'] as const;

/* ------------------------------------------------------------------ Peer review
 * Source: Organization Home page Details.docx (table) */
export const peerReviewSteps: LabelledText[] = [
  { title: 'Abstract submission', text: 'Authors submit their abstracts through the conference website.' },
  { title: 'Peer reviewer selection', text: 'Qualified experts from the field are selected to review submissions.' },
  { title: 'Review process', text: 'Reviewers evaluate the quality, relevance, originality, and methodology of the abstracts and full papers.' },
  { title: 'Feedback', text: 'Authors receive feedback, which may include acceptance or revision requests, or rejection.' },
  { title: 'Final decision', text: 'The conference committee makes the final decision based on reviewer feedback.' },
  { title: 'Awards', text: 'Presented papers are eligible for awards, such as Best Paper and Best Presenter.' },
];

/* ------------------------------------------------------------------ Awards
 * Sources: Organaization site/Awards page.docx, event details site/Award page.docx */
const awardBenefits: LabelledText[] = [
  { title: 'Research excellence awards', text: 'Recognize outstanding research papers, innovative ideas, and academic contributions.' },
  { title: 'Certificates and recognition', text: 'Receive certificates of participation, presentation, or achievement, subject to eligibility.' },
  { title: 'Networking opportunities', text: 'Connect with researchers, academicians, and industry professionals worldwide.' },
];

export const awards: Award[] = [
  {
    slug: 'best-paper',
    name: 'Best Paper Award',
    description: ['Recognizes outstanding research papers based on originality, research quality, methodology, and contribution to the field.'],
    benefits: awardBenefits,
  },
  {
    slug: 'best-presentation',
    name: 'Best Presentation Award',
    description: [
      "The Best Paper Presentation Award recognizes outstanding research papers and excellent presentation skills at ICF conferences.",
      'It honors originality, research quality, innovation, and effective communication of ideas.',
      "Award recipients receive recognition for their academic achievements, subject to the conference's evaluation criteria.",
    ],
    benefits: awardBenefits,
  },
  {
    slug: 'best-student-paper',
    name: 'Best Student Paper Award',
    description: [
      'The Best Student Paper Award recognizes outstanding research contributions by students participating in ICF conferences.',
      'It encourages innovation, academic excellence, and the development of new ideas in various research fields.',
      "Eligible students are selected based on research quality, originality, and the conference's evaluation criteria.",
    ],
    benefits: awardBenefits,
  },
  {
    slug: 'certificate-of-participation',
    name: 'Certificate of Participation',
    description: [
      "The Certificate of Participation recognizes attendees who participate in ICF conferences and meet the event's attendance requirements.",
      'It serves as a record of participation and supports academic and professional development.',
    ],
  },
];

/* ------------------------------------------------------------------ FAQ
 * Source: event details site/Conference FAQ.docx */
export const faqs: FaqItem[] = [
  { question: 'What is the International Conference Forum (ICF)?', answer: 'International Conference Forum (ICF) provides a platform for researchers, academicians, students, and professionals to share knowledge, present research papers, and participate in international conferences.' },
  { question: 'How can I find upcoming conferences?', answer: 'Visit our Upcoming Conferences page to explore conferences by subject, country, date, and research area.' },
  { question: 'How can I register for a conference?', answer: 'Select your preferred conference, visit its details page, and complete the registration form with the required information.' },
  { question: 'Can I submit a research paper?', answer: 'Yes. Authors can submit their research papers through the paper submission process specified on the respective conference page.' },
  { question: 'Who can participate in ICF conferences?', answer: 'Researchers, students, professors, academicians, industry professionals, and anyone interested in the relevant conference topics can participate.' },
  { question: 'Are online conference options available?', answer: 'Online participation may be available for selected conferences. Please check the individual conference page for virtual participation details.' },
  { question: 'Will I receive a certificate?', answer: 'Certificates may be provided to eligible participants, presenters, or award recipients according to the specific conference guidelines.' },
  { question: 'How can I contact the ICF team?', answer: 'Visit our Contact Us page and submit your enquiry through the contact form. Our team will respond as soon as possible.' },
  { question: 'How are research papers reviewed?', answer: "Submitted papers may undergo a peer-review process based on the conference's review criteria, research quality, originality, and relevance." },
  { question: 'Can I receive an award for my research paper?', answer: "Eligible participants may be considered for awards such as Best Paper Presentation Award or Best Student Paper Award, subject to the conference's award criteria." },
  { question: 'How can I know the registration fee?', answer: 'Registration fees and payment instructions are provided on the respective conference details page.' },
  { question: 'Can I update my registration details?', answer: 'Please contact the ICF support team with your registration information and the requested changes. Updates are subject to the applicable conference policies.' },
];

/* ------------------------------------------------------------------ Registration
 * Source: event details site/Registration Page.docx */
export const registrationIntro =
  'We invite you to join the International Conference Forum (ICF) and become part of a global academic community! Connect with researchers, academicians, and industry experts, explore innovative ideas, participate in meaningful discussions, and contribute to the advancement of research, innovation, and global knowledge sharing.';

export const registrationInfo =
  'We offer flexible registration options for participants attending International Conference Forum (ICF) conferences. Participants can complete their registration through the available online payment methods or follow the payment instructions provided for their selected conference.';

export const registrationCategoriesIntro =
  'Choose the registration category that best suits your participation in the International Conference Forum (ICF). Early bird and standard registration options may be available at different fees. Please check the respective conference page for registration deadlines, fees, and payment details.';

export const registrationFees: RegistrationFee[] = [
  { category: 'Author Presentation', preEnrolment: 319, standard: 349 },
  { category: 'Listener / Attendee', preEnrolment: 200, standard: 230 },
  { category: 'Virtual Keynote Speaker Registration', preEnrolment: 240, standard: 270 },
  { category: 'Pre-recorded Video Submission', preEnrolment: 155, standard: 175 },
  { category: 'Online Presentation', preEnrolment: 224, standard: 249 },
  { category: 'Online Listener', preEnrolment: 139, standard: 169 },
];

export const registrationSteps: LabelledText[] = [
  { title: 'Inform us after registering', text: 'Registered members must inform us immediately after completing registration. Once the registration fee is processed, send the scanned copy of the registration fee receipt or transaction proof to the ICF support email on or before the last date of registration.' },
  { title: 'Mail the bank statement', text: 'After transferring the registration fee, please email the bank statement to the ICF support email with your complete registration details.' },
  { title: 'Submit the camera-ready paper', text: 'Submit your camera-ready paper as per the provided guidelines.' },
];

export const registrationRules = [
  'No modifications will be accepted after the final paper submission date.',
  'A maximum of five authors/co-authors are allowed per paper to participate.',
  'No registration will be entertained after the last date of registration.',
];

/* ------------------------------------------------------------------ Submission
 * Source: event details site/Submission Page.docx */
export const abstractGuidelines: LabelledText[] = [
  { title: 'Original research', text: 'Abstracts must clearly present original research, innovative ideas, or the study being submitted.' },
  { title: 'Language and quality', text: 'All abstracts must be written in English and be free from grammatical and spelling errors.' },
  { title: 'Content requirements', text: 'Submissions should be informative, relevant to the conference theme, clear, and concise.' },
  { title: 'Word limit', text: 'Abstracts must be written as a single paragraph of 200–250 words.' },
  { title: 'Author details', text: "The title, author name(s), and institutional affiliation(s) must be centered. The presenting author's name must be underlined." },
  { title: 'Author biography', text: 'Include a brief biography of the presenting author, following the official abstract template.' },
  { title: 'File format', text: 'Submit the abstract as a Microsoft Word document (.doc or .docx).' },
  { title: 'Online submission', text: 'Upload your abstract through the official ICF submission portal.' },
  { title: 'Submission confirmation', text: 'An acknowledgment email will be sent within three working days of successful submission.' },
];

export const fullPaperIntro =
  'Authors whose abstracts have been accepted and who have completed the required conference registration are invited to submit their full papers for review. Please follow the guidelines below to ensure successful submission.';

export const fullPaperGuidelines: LabelledText[] = [
  { title: 'Language and quality', text: 'Manuscripts must be written in English and carefully proofread for grammatical accuracy, clarity, and readability.' },
  { title: 'Paper length and format', text: 'Full papers should be 6–8 pages long and formatted in a double-column layout, following the specified conference template.' },
  { title: 'Tables, figures, and images', text: 'Include clear, high-quality tables, figures, and images with appropriate numbering, captions, and references in the text.' },
  { title: 'Keywords', text: 'Provide relevant keywords in lowercase, separated by commas, except for proper nouns and scientific terms that require capitalization.' },
  { title: 'Author affiliations', text: "Clearly mention each author's full name, institutional affiliation, department (if applicable), and country." },
  { title: 'File format', text: 'Submit the manuscript as a Microsoft Word document (.doc or .docx).' },
  { title: 'Online submission', text: 'Upload your full paper through the official ICF submission portal.' },
];

export const manuscriptStructure = [
  'Paper Title',
  'Author Details and Affiliations',
  'Abstract',
  'Keywords / Index Terms',
  'Background / Introduction',
  'Motivation and Objectives',
  'Research Contribution / Methodology',
  'Results',
  'Discussion',
  'Conclusions',
  'References',
];

/* ------------------------------------------------------------------ Programme
 * Source: event details site/Program.docx */
export const agendaIntro = [
  'The International Conference Forum (ICF) provides a structured platform for researchers, academicians, students, and industry professionals to exchange knowledge, present innovative research, and explore emerging developments across various disciplines.',
  'Our conference agenda includes keynote presentations, research paper sessions, expert discussions, networking opportunities, and interactive knowledge-sharing activities. Each conference follows an agenda tailored to its theme, objectives, and participating audience.',
];

export const agendaHighlights = [
  'Welcome Address and Inaugural Session',
  'Keynote Speeches by Invited Experts',
  'Research Paper Presentations',
  'Technical Sessions and Panel Discussions',
  'Networking and Knowledge Exchange',
  'Closing Remarks and Certificate Distribution, where applicable',
];

export const scheduleIntro = [
  'The ICF conference schedule helps participants plan their attendance and participate in sessions according to the event timeline. It provides essential information about session timings, presentations, keynote speakers, and scheduled activities.',
  'Participants are encouraged to review the individual conference schedule before the event, as timings and session details may vary by conference.',
];

export const schedule: ScheduleItem[] = [
  { time: '09:00 – 09:30', session: 'Registration and Welcome', kind: 'ceremony' },
  { time: '09:30 – 10:00', session: 'Inaugural Session', kind: 'ceremony' },
  { time: '10:00 – 11:00', session: 'Keynote Address', kind: 'session' },
  { time: '11:00 – 11:15', session: 'Tea Break', kind: 'break' },
  { time: '11:15 – 12:30', session: 'Research Paper Presentations', kind: 'session' },
  { time: '12:30 – 13:30', session: 'Lunch Break', kind: 'break' },
  { time: '13:30 – 14:30', session: 'Technical Sessions', kind: 'session' },
  { time: '14:30 – 15:30', session: 'Interactive Discussion and Networking', kind: 'session' },
  { time: '15:30 – 16:00', session: 'Closing Remarks and Certificates, where applicable', kind: 'ceremony' },
];

/* ------------------------------------------------------------------ About the conference
 * Source: event details site/About Conf page.docx */
export const conferenceHighlights: LabelledText[] = [
  { title: 'Global networking', text: 'Connect with researchers, academicians, and professionals from different countries.' },
  { title: 'Research paper presentation', text: 'Present your research findings, ideas, and innovations to an academic audience.' },
  { title: 'Expert insights', text: 'Gain valuable knowledge through keynote sessions and expert presentations.' },
  { title: 'Knowledge exchange', text: 'Explore emerging trends, new technologies, and developments across multiple disciplines.' },
  { title: 'Academic recognition', text: 'Opportunities for certificates and research awards, subject to individual conference guidelines.' },
  { title: 'Collaboration opportunities', text: 'Build professional relationships and explore future research partnerships.' },
];

export const conferenceRegistrationInfo: LabelledText[] = [
  { title: 'Early registration', text: 'Register before the announced deadline to take advantage of applicable early registration rates.' },
  { title: 'Student & researcher benefits', text: 'Special registration options may be available for students, research scholars, and early-career academics.' },
  { title: 'Conference participation', text: 'Registration benefits may include access to conference sessions, research presentations, networking opportunities, and conference materials, as specified for each event.' },
];

/** Example "About the conference" copy for ICICGB-26 (About Conf page.docx). */
export const icicgbAbout = [
  'The International Conference on Innovation and Competition in Global Banking (ICICGB-26), organized through the International Conference Forum (ICF), brings together scholars, researchers, academicians, banking professionals, and industry experts from around the world.',
  'The conference provides a platform to present innovative research, explore emerging trends in global banking, discuss financial technologies, and exchange ideas on banking innovation and competition. It encourages knowledge sharing, international collaboration, and meaningful discussions on the future of the global banking industry.',
  'Through expert insights, research presentations, and professional networking opportunities, ICICGB-26 aims to promote academic excellence, encourage innovation, and strengthen collaboration between academia and industry.',
];

/* ------------------------------------------------------------------ Invitation letter
 * Source: Organaization site/Invitation Letter.docx */
export const invitationLetter = {
  intro:
    'A Letter of Invitation confirms that your paper submission and registration have been accepted by the International Conference Forum (ICF) Organizing Committee. The letter will be issued in English and may support your visa application. However, it does not guarantee visa approval.',
  requirementsIntro: [
    'Invitation letters will be issued only after successful registration and payment confirmation. The letter will be sent to the registered participant by email.',
    'To request an invitation letter, please email the following documents to the official ICF email address:',
  ],
  documents: [
    'Completed conference registration form',
    'Proof of registration fee payment',
    'Recent passport-size photograph',
    'Copy of a valid passport',
  ],
  disclaimer: [
    'Participants requiring a visa are responsible for completing their visa application and complying with the requirements of the relevant embassy or consulate. The ICF Organizing Committee has no control over visa processing times or visa approval decisions.',
    'Participants are strongly advised to apply for their visas as early as possible. In the event of a visa rejection, ICF cannot influence or reverse the decision of the relevant authorities and cannot guarantee visa issuance.',
  ],
};

/* ------------------------------------------------------------------ Travel & accommodation
 * Source: event details site/Travel page.docx */
export const travel = {
  visaIntro: [
    'ICF provides official invitation letters to registered participants upon request.',
    'Participants must check visa requirements and prepare the necessary travel documents before applying.',
    'Visa approval is solely at the discretion of the respective embassy or consulate.',
  ],
  issuance: 'Invitation letters will only be issued after full payment and registration are completed. The letter will be sent via email.',
  documents: ['Completed Registration Form', 'Proof of Payment', 'Passport-size Photograph', 'Clear scanned copy of your Passport'],
  advised: [
    'The ICF organizing committee cannot influence visa application decisions or processing times at embassies or consulates.',
    'Visa issuance is solely at the discretion of the embassy or consulate authorities.',
    'Processing times can vary, so early visa application is strongly advised.',
    'If your visa is denied, ICF cannot appeal or intervene on your behalf.',
  ],
  responsibility: [
    { title: 'Self-managed travel & accommodation', text: 'Participants are responsible for arranging their own visa, travel, and accommodation. ICF does not provide support for these arrangements.' },
    { title: 'Financial liability', text: 'ICF is not liable for any costs incurred due to changes in conference dates, location, or format.' },
    { title: 'Fee exclusions', text: 'Registration fees cover the conference participation but do not include travel, lodging, or personal expenses.' },
  ] as LabelledText[],
  visaSupport: [
    { title: 'No embassy communication', text: 'ICF will not liaise with consulates or embassies on behalf of participants. Participants are responsible for handling all communications related to their visa applications directly.' },
    { title: 'Visa support', text: 'While the invitation letter may assist in obtaining a visa, ICF cannot guarantee visa approval and takes no responsibility for any visa denial or delays.' },
    // Source heading reads "Fee Exclusions" (duplicated); the content concerns misuse of the letter.
    { title: 'Misuse of the invitation letter', text: 'Unauthorized changes to the invitation letter or misuse of the document will invalidate it. The registrant may face disqualification from participation and possible legal action.' },
    { title: 'Agreement', text: 'By accepting the invitation letter, participants agree to abide by international travel laws and ethical guidelines for participation.' },
  ] as LabelledText[],
};

/* ------------------------------------------------------------------ Video conferencing
 * Source: event details site/Video Conferencing.docx */
export const videoConferencing = {
  intro: [
    'The International Conference Forum (ICF) provides a seamless video conferencing platform for researchers, academicians, students, and industry professionals worldwide. Participants can join virtual conferences, attend keynote sessions, present research papers, interact with experts, and collaborate with global communities from anywhere.',
    'Our platform makes online conferences accessible, convenient, and engaging through live presentations, interactive discussions, and virtual networking opportunities.',
  ],
  benefits: [
    { title: 'Global accessibility', text: 'Join international conferences from anywhere without travel expenses.' },
    { title: 'Live research presentations', text: 'Present research papers and share findings with a global audience.' },
    { title: 'Expert interaction', text: 'Connect directly with keynote speakers, researchers, and industry professionals.' },
    { title: 'Real-time Q&A sessions', text: 'Ask questions and participate in interactive discussions.' },
    { title: 'Virtual networking', text: 'Build professional relationships and explore research collaborations worldwide.' },
    { title: 'Cost-effective participation', text: 'Save money on travel, accommodation, and venue expenses.' },
    { title: 'Flexible participation', text: 'Attend online sessions from your home, university, or workplace.' },
    { title: 'Knowledge sharing', text: 'Discover the latest research, innovations, and developments across disciplines.' },
  ] as LabelledText[],
  features: [
    { title: 'Live virtual conferences', text: 'Attend international conferences and academic sessions online in real time.' },
    { title: 'Research paper presentations', text: 'Present your research to participants from around the world.' },
    { title: 'Interactive Q&A sessions', text: 'Ask questions and engage with speakers during live sessions.' },
    { title: 'Screen sharing', text: 'Share presentation slides, research documents, and other relevant materials.' },
    { title: 'Audio and video communication', text: 'Communicate with speakers, organizers, and fellow participants.' },
    { title: 'Virtual networking', text: 'Connect with researchers, academicians, and industry professionals.' },
    { title: 'Secure meeting access', text: 'Join sessions through authorized conference links and access details.' },
    { title: 'Global participation', text: 'Participate in conferences from different countries without travelling.' },
  ] as LabelledText[],
  steps: [
    { title: 'Register for the conference', text: 'Select your preferred conference on the ICF website and complete the registration process.' },
    { title: 'Receive joining details', text: 'Check your registered email for the conference confirmation, meeting link, date, and time.' },
    { title: 'Prepare your device', text: 'Ensure your device has a working microphone, speakers or headphones, and a camera if required.' },
    { title: 'Open the conference link', text: 'Click the meeting link at the scheduled time and follow the on-screen instructions.' },
    { title: 'Check your audio and video', text: 'Allow microphone and camera permissions if requested. Test your devices before joining.' },
    { title: 'Join the session', text: 'Enter your name and any required meeting details, then join the conference.' },
    { title: 'Participate and connect', text: 'Listen to presentations, ask questions when invited, and interact respectfully with other participants.' },
  ] as LabelledText[],
  requirements: [
    { title: 'Device', text: 'Desktop computer, laptop, tablet, or smartphone.' },
    { title: 'Internet connection', text: 'A stable broadband or Wi-Fi connection; reliable mobile data may also work.' },
    { title: 'Web browser', text: 'An up-to-date version of Google Chrome, Microsoft Edge, Safari, or another supported browser.' },
    { title: 'Audio equipment', text: 'A working microphone and speakers or headphones.' },
    { title: 'Camera', text: 'A webcam or built-in camera when video participation is required.' },
  ] as LabelledText[],
  etiquette: [
    { title: 'Be punctual', text: 'Join the conference on time and be prepared for all sessions.' },
    { title: 'Respect others', text: 'Listen attentively, avoid interruptions, and communicate politely with speakers and participants.' },
    { title: 'Maintain professionalism', text: 'Follow the conference guidelines, dress appropriately, and keep your microphone muted during online sessions.' },
  ] as LabelledText[],
};

/* ------------------------------------------------------------------ Contact
 * Sources: Organaization site/Contact Us Page.docx, event details site/Contact Us page.docx */
export const contactIntro = [
  "Whether you're presenting your research, attending as a listener, delivering a keynote, or seeking collaboration, we're just a message away.",
  'At ICF, our team is committed to providing personalized support for all your academic and professional needs.',
];

export const enquiryTypes = [
  'Conference Registration',
  'Paper Submission',
  'Upcoming Conferences',
  'Speaker / Committee Opportunities',
  'Partnership / Collaboration',
  'General Enquiry',
] as const;

/** Closing line used on several event-site documents. */
export const closingLine = 'We look forward to hearing from you and working together to advance global academic excellence!';

/* ------------------------------------------------------------------ Tentative venue
 * Source: event details site/Tentative venue page.docx — supplied as an EXAMPLE only. */
export const exampleVenue = {
  name: 'Hilton Nagoya',
  lines: ['1 Chome-3-3 Sakae', 'Naka Ward', 'Nagoya', 'Aichi Prefecture 460-0008', 'Japan'],
};
