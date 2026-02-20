
export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: string;
};

export type QuizCategory = {
  id: string;
  title: string;
  description: string;
  levels: QuizLevel[];
};

export type QuizLevel = {
  id: string;
  title: string;
  description: string;
  attempts: number;
  questions: QuizQuestion[];
};

export const QUIZ_CATEGORIES: QuizCategory[] = [
  {
    id: "consumer-rights",
    title: "Consumer Rights",
    description: "Test your knowledge about consumer protection laws and rights",
    levels: [
      {
        id: "easy",
        title: "Easy",
        description: "COPRA & Consumer Rights - 10 Questions",
        attempts: 980,
        questions: [
          {
            id: "cr-e-1",
            question: "Which Act protects consumer rights in India?",
            options: [
              "The Consumer Protection Act, 1986",
              "The Contract Act, 1872",
              "The Negotiable Instruments Act",
              "The Sale of Goods Act"
            ],
            answer: "The Consumer Protection Act, 1986"
          },
          {
            id: "cr-e-2",
            question: "Which of the following is NOT a consumer right?",
            options: [
              "Right to Safety",
              "Right to Cheat",
              "Right to Choose",
              "Right to Information"
            ],
            answer: "Right to Cheat"
          },
          {
            id: "cr-e-3",
            question: "Where can a consumer file a complaint for faulty products?",
            options: [
              "Consumer Court",
              "Civil Court",
              "Police Station",
              "Election Commission"
            ],
            answer: "Consumer Court"
          },
          {
            id: "cr-e-4",
            question: "What is the maximum compensation limit in a District Consumer Court?",
            options: [
              "₹10 lakh",
              "₹1 crore",
              "₹50 lakh",
              "₹5 crore"
            ],
            answer: "₹10 lakh"
          },
          {
            id: "cr-e-5",
            question: "Which of the following is an unfair trade practice?",
            options: [
              "Selling goods at a discount",
              "False advertising",
              "Giving free samples",
              "Offering warranty services"
            ],
            answer: "False advertising"
          }
        ]
      },
      {
        id: "intermediate",
        title: "Intermediate",
        description: "Consumer Disputes & Remedies - 15 Questions",
        attempts: 720,
        questions: [
          {
            id: "cr-i-1",
            question: "What is the time limit to file a consumer complaint?",
            options: [
              "6 months",
              "1 year",
              "2 years",
              "5 years"
            ],
            answer: "1 year"
          },
          {
            id: "cr-i-2",
            question: "Which of the following platforms helps in online consumer complaints?",
            options: [
              "MyGov.in",
              "Consumer Helpline (NCH)",
              "Income Tax Portal",
              "Election Commission"
            ],
            answer: "Consumer Helpline (NCH)"
          },
          {
            id: "cr-i-3",
            question: "What does MRP stand for?",
            options: [
              "Maximum Retail Price",
              "Minimum Retail Price",
              "Manufacturer's Rate Price",
              "Market Retail Price"
            ],
            answer: "Maximum Retail Price"
          },
          {
            id: "cr-i-4",
            question: "What is a misleading advertisement?",
            options: [
              "False claims about a product",
              "Giving discounts on products",
              "Showing real product features",
              "Providing warranty details"
            ],
            answer: "False claims about a product"
          },
          {
            id: "cr-i-5",
            question: "Who can file a consumer complaint?",
            options: [
              "Only the buyer of the product",
              "Any consumer or registered group",
              "Only the shopkeeper",
              "Only a lawyer"
            ],
            answer: "Any consumer or registered group"
          }
        ]
      },
      {
        id: "hard",
        title: "Hard",
        description: "Advanced Consumer Protection Laws - 20 Questions",
        attempts: 510,
        questions: [
          {
            id: "cr-h-1",
            question: "Which Act replaced the Consumer Protection Act, 1986?",
            options: [
              "Consumer Protection Act, 2015",
              "Consumer Protection Act, 2019",
              "Consumer Rights Act, 2020",
              "Consumer Welfare Act, 2018"
            ],
            answer: "Consumer Protection Act, 2019"
          },
          {
            id: "cr-h-2",
            question: "What is the role of the Central Consumer Protection Authority (CCPA)?",
            options: [
              "Regulating advertisements",
              "Resolving consumer disputes",
              "Imposing fines on misleading advertisements",
              "All of the above"
            ],
            answer: "All of the above"
          },
          {
            id: "cr-h-3",
            question: "Which of the following cases can be heard in the National Consumer Disputes Redressal Commission (NCDRC)?",
            options: [
              "Complaints up to ₹50 lakh",
              "Complaints between ₹50 lakh and ₹2 crore",
              "Complaints above ₹2 crore",
              "Any complaint, regardless of amount"
            ],
            answer: "Complaints above ₹2 crore"
          },
          {
            id: "cr-h-4",
            question: "Which of the following is NOT covered under consumer protection?",
            options: [
              "Defective products",
              "Service deficiency",
              "Business-to-business transactions",
              "False advertising"
            ],
            answer: "Business-to-business transactions"
          },
          {
            id: "cr-h-5",
            question: "Which organization is responsible for product safety standards in India?",
            options: [
              "BIS (Bureau of Indian Standards)",
              "RBI (Reserve Bank of India)",
              "SEBI (Securities Exchange Board of India)",
              "IRDAI (Insurance Regulatory and Development Authority of India)"
            ],
            answer: "BIS (Bureau of Indian Standards)"
          }
        ]
      }
    ]
  },
  {
    id: "property-rights",
    title: "Property Rights",
    description: "Learn about property laws, ownership, and land disputes",
    levels: [
      {
        id: "easy",
        title: "Easy",
        description: "Ownership & Registration - 10 Questions",
        attempts: 850,
        questions: [
          {
            id: "pr-e-1",
            question: "Which Act governs property transfer in India?",
            options: [
              "The Contract Act",
              "The Transfer of Property Act",
              "The Civil Procedure Code",
              "The Negotiable Instruments Act"
            ],
            answer: "The Transfer of Property Act"
          },
          {
            id: "pr-e-2",
            question: "What is a Title Deed?",
            options: [
              "Proof of property ownership",
              "Agreement to rent property",
              "A type of tax receipt",
              "A court document"
            ],
            answer: "Proof of property ownership"
          },
          {
            id: "pr-e-3",
            question: "What does the term 'Encumbrance' mean in property law?",
            options: [
              "Ownership transfer",
              "Legal claim on property",
              "Court order to sell property",
              "Rent agreement"
            ],
            answer: "Legal claim on property"
          },
          {
            id: "pr-e-4",
            question: "Which authority is responsible for property registration?",
            options: [
              "District Magistrate",
              "Sub-Registrar Office",
              "Collector Office",
              "Revenue Department"
            ],
            answer: "Sub-Registrar Office"
          },
          {
            id: "pr-e-5",
            question: "Which tax is applicable on property purchases?",
            options: [
              "GST",
              "Stamp Duty",
              "Service Tax",
              "Income Tax"
            ],
            answer: "Stamp Duty"
          }
        ]
      }
    ]
  }
];
