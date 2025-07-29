import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";

// -------- Global Styles --------
const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Inter', 'Roboto', Arial, sans-serif;
    margin: 0; background: linear-gradient(115deg, #24243e 0%, #302b63 47%, #0f0c29 100%);
    color: #f3f8fa; min-height: 100vh;
  }
`;

// -------- Styled components --------
const Container = styled.div`
  max-width: 900px;
  margin: 20px auto;
  background: rgba(20, 20, 40, 0.95);
  border-radius: 12px;
  padding: 20px 30px 40px 30px;
  box-shadow: 0 0 14px #007868aa;
`;
const Heading = styled.h1`
  color: #31c491;
  font-family: 'Orbitron', sans-serif;
  text-align: center;
`;
const Button = styled.button`
  background: #31c491;
  border: none;
  padding: 10px 18px;
  color: #060f07;
  border-radius: 7px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 0 3px 15px #32dfa6cc;
  transition: background 0.3s;
  &:hover {
    background: #56e3a7;
  }
  &:disabled {
    background: #355b45; color: #8ed3be; cursor: not-allowed;
    box-shadow: none;
  }
`;
const Input = styled.input`
  padding: 8px 10px;
  font-size: 1rem;
  border-radius: 8px;
  border: none;
  margin: 5px 5px 15px 0;
  width: 100%;
  box-sizing: border-box;
`;
const TextArea = styled.textarea`
  font-size: 1rem;
  border-radius: 8px;
  border: none;
  padding: 10px;
  width: 100%;
  margin-bottom: 15px;
  box-sizing: border-box;
  resize: vertical;
`;
const Label = styled.label`
  font-weight: 600;
  margin-bottom: 5px;
  display: block;
`;
const Section = styled.div`
  margin-bottom: 25px;
`;
const OptionLabel = styled.label`
  display: block;
  margin-bottom: 10px;
  cursor: pointer;
  user-select: none;
  color: ${({ checked }) => (checked ? "#6df59a" : "#d1f7d9")};
`;
const ReviewItem = styled.div`
  padding: 12px 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  border-left: 5px solid ${({ correct }) => (correct ? "#50d890" : "#f14855")};
  background: ${({ correct }) => (correct ? "#153928" : "#401617")};
`;
const AnswerText = styled.p`
  margin: 6px 0;
`;

// -------- Full question set for "Anti-cancer drug" --------
// (76 questions converted from your CSV, with id, text, 4 options, correct index, and explanation)
const fullAntiCancerQuestions = [
  {
    id: "1",
    text: "Which of the following is an alkylating agent?",
    options: ["Cyclophosphamide", "Methotrexate", "Vincristine", "Doxorubicin"],
    correct: 0,
    explanation: "Cyclophosphamide is a commonly used alkylating agent."
  },
  {
    id: "2",
    text: "Methotrexate primarily inhibits which enzyme?",
    options: ["DNA polymerase", "Thymidylate synthase", "Dihydrofolate reductase", "Topoisomerase II"],
    correct: 2,
    explanation: "Methotrexate inhibits dihydrofolate reductase, blocking DNA synthesis."
  },
  {
    id: "3",
    text: "Which anti-neoplastic agent is a Vinca alkaloid?",
    options: ["Vincristine", "Bleomycin", "Cytarabine", "Tamoxifen"],
    correct: 0,
    explanation: "Vincristine disrupts microtubules and is a Vinca alkaloid."
  },
  {
    id: "4",
    text: "Doxorubicin is best classified as:",
    options: ["Alkylating agent", "Antitumor antibiotic", "Antimetabolite", "Hormonal agent"],
    correct: 1,
    explanation: "Doxorubicin is a widely used antitumor antibiotic."
  },
  {
    id: "5",
    text: "Cisplatin is most useful in the treatment of:",
    options: ["Leukemia", "Testicular cancer", "Retinoblastoma", "Prostate cancer"],
    correct: 1,
    explanation: "Cisplatin is an effective agent for testicular cancer."
  },
  {
    id: "6",
    text: "Bleomycin causes dose-limiting toxicity in which organ?",
    options: ["Liver", "Bone marrow", "Lungs", "Kidney"],
    correct: 2,
    explanation: "Pulmonary fibrosis is a known side effect due to bleomycin."
  },
  {
    id: "7",
    text: "Which drug is a monoclonal antibody against CD20?",
    options: ["Rituximab", "Trastuzumab", "Bevacizumab", "Cetuximab"],
    correct: 0,
    explanation: "Rituximab targets the CD20 antigen on B cells."
  },
  {
    id: "8",
    text: "Tamoxifen is used primarily to treat:",
    options: ["Breast cancer", "Prostate cancer", "Lung cancer", "Colon cancer"],
    correct: 0,
    explanation: "Tamoxifen is used mainly in estrogen receptor-positive breast cancer."
  },
  {
    id: "9",
    text: "Vinblastine disrupts which cellular structure?",
    options: ["DNA", "Microtubules", "Ribosomes", "Mitochondria"],
    correct: 1,
    explanation: "Vinblastine inhibits microtubule formation, arresting mitosis."
  },
  {
    id: "10",
    text: "5-Fluorouracil (5-FU) primarily inhibits:",
    options: ["DNA polymerase", "Thymidylate synthase", "Topoisomerase II", "RNA polymerase"],
    correct: 1,
    explanation: "5-FU inhibits thymidylate synthase, disrupting DNA synthesis."
  },
  {
    id: "11",
    text: "Which agent is an antimetabolite?",
    options: ["Cyclophosphamide", "Methotrexate", "Vincristine", "Procarbazine"],
    correct: 1,
    explanation: "Methotrexate is an antimetabolite that disrupts folate metabolism."
  },
  {
    id: "12",
    text: "What is the mechanism of action of paclitaxel?",
    options: ["Microtubule stabilization", "DNA alkylation", "Topoisomerase inhibition", "Folate antagonism"],
    correct: 0,
    explanation: "Paclitaxel stabilizes microtubules and prevents cell division."
  },
  {
    id: "13",
    text: "Which side effect is common with anthracyclines like doxorubicin?",
    options: ["Nephrotoxicity", "Cardiotoxicity", "Neurotoxicity", "Ototoxicity"],
    correct: 1,
    explanation: "Doxorubicin can cause dose-dependent cardiotoxicity."
  },
  {
    id: "14",
    text: "Which alkylating agent crosses the blood-brain barrier?",
    options: ["Carmustine", "Cyclophosphamide", "Melphalan", "Busulfan"],
    correct: 0,
    explanation: "Carmustine penetrates the CNS and is used for brain tumors."
  },
  {
    id: "15",
    text: "The dose-limiting toxicity of vincristine is:",
    options: ["Myelosuppression", "Neurotoxicity", "Nephrotoxicity", "Cardiotoxicity"],
    correct: 1,
    explanation: "Vincristine commonly causes peripheral neuropathy."
  },
  {
    id: "16",
    text: "Fluorouracil is primarily used to treat which cancer?",
    options: ["Colon cancer", "Leukemia", "Breast cancer", "Lymphoma"],
    correct: 0,
    explanation: "5-FU is a mainstay treatment in colon and other solid tumors."
  },
  {
    id: "17",
    text: "Which drug acts as a tyrosine kinase inhibitor?",
    options: ["Imatinib", "Methotrexate", "Bleomycin", "Paclitaxel"],
    correct: 0,
    explanation: "Imatinib targets BCR-ABL tyrosine kinase in CML."
  },
  {
    id: "18",
    text: "What is the primary toxicity of cisplatin?",
    options: ["Nephrotoxicity", "Neurotoxicity", "Cardiotoxicity", "Hepatotoxicity"],
    correct: 0,
    explanation: "Nephrotoxicity limits its clinical dosing."
  },
  {
    id: "19",
    text: "Etoposide inhibits which enzyme?",
    options: ["Topoisomerase I", "Topoisomerase II", "DNA polymerase", "RNA polymerase"],
    correct: 1,
    explanation: "Etoposide is a topoisomerase II inhibitor causing DNA breaks."
  },
  {
    id: "20",
    text: "Tamoxifen acts as an antagonist at which receptor?",
    options: ["Estrogen receptor", "Progesterone receptor", "Androgen receptor", "Glucocorticoid receptor"],
    correct: 0,
    explanation: "Tamoxifen blocks estrogen receptor in breast tissue."
  },
  {
    id: "21",
    text: "Which is a side effect of bleomycin?",
    options: ["Pulmonary fibrosis", "Peripheral neuropathy", "Cardiotoxicity", "Ototoxicity"],
    correct: 0,
    explanation: "Bleomycin causes lung fibrosis due to oxidative damage."
  },
  {
    id: "22",
    text: "Which drug is a folate antagonist?",
    options: ["Methotrexate", "Vincristine", "Etoposide", "Paclitaxel"],
    correct: 0,
    explanation: "Methotrexate inhibits dihydrofolate reductase."
  },
  {
    id: "23",
    text: "What is the drug class of cytarabine?",
    options: ["Alkylating agent", "Antimetabolite", "Antitumor antibiotic", "Hormone antagonist"],
    correct: 1,
    explanation: "Cytarabine is a pyrimidine antimetabolite."
  },
  {
    id: "24",
    text: "Procarbazine causes which major side effect?",
    options: ["Myelosuppression", "Peripheral neuropathy", "Disulfiram-like reaction", "Cardiotoxicity"],
    correct: 2,
    explanation: "Procarbazine causes a disulfiram-like reaction with alcohol."
  },
  {
    id: "25",
    text: "Trastuzumab targets which receptor in breast cancer?",
    options: ["HER2/neu", "Estrogen receptor", "Progesterone receptor", "EGFR"],
    correct: 0,
    explanation: "Trastuzumab targets HER2 receptor overexpressed in some breast cancers."
  },
  {
    id: "26",
    text: "Which is cell cycle-specific drug?",
    options: ["Methotrexate", "Cisplatin", "Dacarbazine", "Cyclophosphamide"],
    correct: 0,
    explanation: "Methotrexate is S-phase specific."
  },
  {
    id: "27",
    text: "Which drug is associated with pulmonary fibrosis?",
    options: ["Bleomycin", "Vincristine", "Doxorubicin", "Methotrexate"],
    correct: 0,
    explanation: "Pulmonary toxicity is a limiting side effect of bleomycin."
  },
  {
    id: "28",
    text: "Which alkylating agent requires mesna to prevent hemorrhagic cystitis?",
    options: ["Ifosfamide", "Busulfan", "Melphalan", "Carmustine"],
    correct: 0,
    explanation: "Mesna is used to detoxify acrolein from ifosfamide."
  },
  {
    id: "29",
    text: "Vincristine primarily causes which toxicity?",
    options: ["Nephrotoxicity", "Neurotoxicity", "Myelosuppression", "Cardiotoxicity"],
    correct: 1,
    explanation: "Vincristine causes peripheral neuropathy."
  },
  {
    id: "30",
    text: "Which drug acts by intercalating DNA and inhibiting topoisomerase II?",
    options: ["Doxorubicin", "Methotrexate", "Cyclophosphamide", "Vinblastine"],
    correct: 0,
    explanation: "Doxorubicin intercalates into DNA and inhibits topoisomerase II."
  },
  {
    id: "31",
    text: "What is the mechanism of action of chlorambucil?",
    options: ["Alkylates DNA", "Inhibits DNA polymerase", "Blocks microtubule formation", "Topoisomerase inhibitor"],
    correct: 0,
    explanation: "Chlorambucil is an alkylating agent damaging DNA."
  },
  {
    id: "32",
    text: "Pentostatin is used primarily for:",
    options: ["Hairy cell leukemia", "Breast cancer", "Lung cancer", "Colon cancer"],
    correct: 0,
    explanation: "Pentostatin is an adenosine deaminase inhibitor used in hairy cell leukemia."
  },
  {
    id: "33",
    text: "Which drug is used in chronic myeloid leukemia targeting BCR-ABL?",
    options: ["Imatinib", "Vincristine", "Methotrexate", "Doxorubicin"],
    correct: 0,
    explanation: "Imatinib inhibits the BCR-ABL tyrosine kinase in CML."
  },
  {
    id: "34",
    text: "Asparaginase acts by:",
    options: ["Degrading asparagine", "DNA crosslinking", "Inhibiting microtubules", "Alkylating DNA"],
    correct: 0,
    explanation: "It depletes asparagine, which leukemia cells need."
  },
  {
    id: "35",
    text: "Carmustine is used for:",
    options: ["Brain tumors", "Testicular cancer", "Leukemia", "Lymphoma"],
    correct: 0,
    explanation: "Carmustine crosses the blood-brain barrier."
  },
  {
    id: "36",
    text: "Which drug causes Fanconi syndrome as a side effect?",
    options: ["Ifosfamide", "Cyclophosphamide", "Busulfan", "Carmustine"],
    correct: 0,
    explanation: "Ifosfamide can damage renal tubules causing Fanconi syndrome."
  },
  {
    id: "37",
    text: "Trastuzumab is contraindicated in patients with:",
    options: ["Heart failure", "Renal failure", "Liver failure", "Pulmonary fibrosis"],
    correct: 0,
    explanation: "It can worsen cardiac function."
  },
  {
    id: "38",
    text: "Gemcitabine is a:",
    options: ["Nucleoside analog", "Alkylating agent", "Monoclonal antibody", "Hormone antagonist"],
    correct: 0,
    explanation: "Gemcitabine is a nucleoside analog used mainly for pancreatic cancer."
  },
  {
    id: "39",
    text: "Mitomycin C is an example of:",
    options: ["Antitumor antibiotic", "Antimetabolite", "Alkylating agent", "Microtubule inhibitor"],
    correct: 0,
    explanation: "Mitomycin C crosslinks DNA and acts as an antitumor antibiotic."
  },
  {
    id: "40",
    text: "Which medication is used as a rescue agent after methotrexate therapy?",
    options: ["Leucovorin", "Mesna", "Filgrastim", "Amifostine"],
    correct: 0,
    explanation: "Leucovorin rescues normal cells from methotrexate toxicity."
  },
  {
    id: "41",
    text: "Which drug is a proteasome inhibitor?",
    options: ["Bortezomib", "Imatinib", "Paclitaxel", "Vinblastine"],
    correct: 0,
    explanation: "Bortezomib inhibits the proteasome leading to apoptosis."
  },
  {
    id: "42",
    text: "Taxanes act by:",
    options: ["Stabilizing microtubules", "Depolymerizing microtubules", "Inhibiting DNA synthesis", "Alkylating DNA"],
    correct: 0,
    explanation: "Taxanes prevent microtubule disassembly."
  },
  {
    id: "43",
    text: "Which agent is associated with hand-foot syndrome?",
    options: ["Capecitabine", "Cyclophosphamide", "Vincristine", "Doxorubicin"],
    correct: 0,
    explanation: "Capecitabine commonly causes hand-foot syndrome."
  },
  {
    id: "44",
    text: "Which chemotherapy drug is derived from the periwinkle plant?",
    options: ["Vincristine", "Doxorubicin", "Bleomycin", "Methotrexate"],
    correct: 0,
    explanation: "Vincristine and vinblastine are derived from Catharanthus roseus."
  },
  {
    id: "45",
    text: "Anthracyclines induce cardiotoxicity mainly due to:",
    options: ["Free radical formation", "MGMT depletion", "DNA crosslinking", "Microtubule inhibition"],
    correct: 0,
    explanation: "Free radicals cause oxidative damage to cardiac cells."
  },
  {
    id: "46",
    text: "Which agent is useful for treating hormone receptor-positive breast cancer?",
    options: ["Tamoxifen", "Cisplatin", "Vincristine", "Methotrexate"],
    correct: 0,
    explanation: "Tamoxifen blocks estrogen receptors in breast tissue."
  },
  {
    id: "47",
    text: "Topoisomerase I inhibitors include:",
    options: ["Irinotecan", "Etoposide", "Doxorubicin", "Bleomycin"],
    correct: 0,
    explanation: "Irinotecan blocks topoisomerase I."
  },
  {
    id: "48",
    text: "Which of the following is NOT a side effect of cyclophosphamide?",
    options: ["Hemorrhagic cystitis", "Neurotoxicity", "Myelosuppression", "Alopecia"],
    correct: 1,
    explanation: "Neurotoxicity is not common with cyclophosphamide."
  },
  {
    id: "49",
    text: "Which drugs are known as spindle poisons?",
    options: ["Vincristine and Paclitaxel", "Bleomycin and Doxorubicin", "Methotrexate and 5-FU", "Cisplatin and Carboplatin"],
    correct: 0,
    explanation: "Vincristine disrupts microtubules; Paclitaxel stabilizes them."
  },
  {
    id: "50",
    text: "Which alkylating agent is cell-cycle nonspecific and requires exposure during any phase?",
    options: ["Carmustine", "Methotrexate", "Vinblastine", "Paclitaxel"],
    correct: 0,
    explanation: "Carmustine cross-links DNA regardless of cell cycle phase."
  },
  {
    id: "51",
    text: "Mitoxantrone is similar to which drug class?",
    options: ["Anthracyclines", "Vinca alkaloids", "Antimetabolites", "Alkylating agents"],
    correct: 0,
    explanation: "Mitoxantrone is an anthracenedione related to anthracyclines."
  },
  {
    id: "52",
    text: "Which agent is used to treat acute promyelocytic leukemia?",
    options: ["All-trans retinoic acid", "Imatinib", "Vincristine", "Bleomycin"],
    correct: 0,
    explanation: "ATRA induces differentiation in APL cells."
  },
  {
    id: "53",
    text: "Besides alkylation, which action does busulfan primarily have?",
    options: ["Myelosuppression", "Cardiotoxicity", "Neurotoxicity", "Pulmonary fibrosis"],
    correct: 3,
    explanation: "Busulfan can cause pulmonary fibrosis."
  },
  {
    id: "54",
    text: "Etoposide is mainly active in which phase of the cell cycle?",
    options: ["S phase", "G2 phase", "M phase", "G1 phase"],
    correct: 1,
    explanation: "Etoposide is cell-cycle specific to G2."
  },
  {
    id: "55",
    text: "Which drug is NOT a DNA topoisomerase inhibitor?",
    options: ["Doxorubicin", "Etoposide", "Irinotecan", "Cyclophosphamide"],
    correct: 3,
    explanation: "Cyclophosphamide is an alkylating agent."
  },
  {
    id: "56",
    text: "The dose-limiting toxicity of methotrexate is:",
    options: ["Liver toxicity", "Renal toxicity", "Myelosuppression", "Neurotoxicity"],
    correct: 2,
    explanation: "Methotrexate commonly causes myelosuppression."
  },
  {
    id: "57",
    text: "Which drug requires folinic acid (leucovorin) rescue?",
    options: ["Methotrexate", "Cyclophosphamide", "Doxorubicin", "Vinblastine"],
    correct: 0,
    explanation: "Leucovorin rescues normal cells from methotrexate toxicity."
  },
  {
    id: "58",
    text: "Which drug inhibits microtubule assembly?",
    options: ["Vincristine", "Paclitaxel", "Doxorubicin", "Bleomycin"],
    correct: 0,
    explanation: "Vincristine prevents microtubule polymerization."
  },
  {
    id: "59",
    text: "Imatinib is most effective in treating:",
    options: ["Chronic myeloid leukemia", "Lymphoma", "Melanoma", "Lung cancer"],
    correct: 0,
    explanation: "It targets BCR-ABL kinase specific to CML."
  },
  {
    id: "60",
    text: "Capecitabine is converted in the body to:",
    options: ["5-Fluorouracil", "Methotrexate", "Vinblastine", "Cyclophosphamide"],
    correct: 0,
    explanation: "Capecitabine is a prodrug of 5-FU."
  },
  {
    id: "61",
    text: "Which drug is used as an anti-metabolite in cancer therapy?",
    options: ["Methotrexate", "Bleomycin", "Vincristine", "Cisplatin"],
    correct: 0,
    explanation: "Methotrexate interrupts DNA synthesis by antimetabolite action."
  },
  {
    id: "62",
    text: "A major side effect of cisplatin is:",
    options: ["Nephrotoxicity", "Neutropenia", "Neurotoxicity", "Hepatotoxicity"],
    correct: 0,
    explanation: "Kidney damage limits cisplatin dosing."
  },
  {
    id: "63",
    text: "Which drug combination includes a topoisomerase I inhibitor?",
    options: ["Irinotecan and 5-FU", "Vincristine and Bleomycin", "Methotrexate and Cyclophosphamide", "Paclitaxel and Doxorubicin"],
    correct: 0,
    explanation: "Irinotecan is a topo I inhibitor used in combination therapies."
  },
  {
    id: "64",
    text: "Which drug class do paclitaxel and docetaxel belong to?",
    options: ["Taxanes", "Alkylating agents", "Vinca alkaloids", "Anthracyclines"],
    correct: 0,
    explanation: "Taxanes stabilize microtubules."
  },
  {
    id: "65",
    text: "Which chemo agent is known to cause peripheral neuropathy?",
    options: ["Vincristine", "Methotrexate", "Bleomycin", "Cisplatin"],
    correct: 0,
    explanation: "Vincristine causes sensory and motor neuropathy."
  },
  {
    id: "66",
    text: "The antidote Mesna is used to reduce toxicity caused by:",
    options: ["Ifosfamide", "Methotrexate", "Vinblastine", "Bleomycin"],
    correct: 0,
    explanation: "Mesna neutralizes urotoxic metabolites of ifosfamide."
  },
  {
    id: "67",
    text: "Which agent acts as a monoclonal antibody against HER2?",
    options: ["Trastuzumab", "Rituximab", "Cetuximab", "Bevacizumab"],
    correct: 0,
    explanation: "Trastuzumab targets HER2-positive breast cancers."
  },
  {
    id: "68",
    text: "Which drug acts by binding to tubulin and inhibiting depolymerization?",
    options: ["Paclitaxel", "Vincristine", "Etoposide", "Cyclophosphamide"],
    correct: 0,
    explanation: "Paclitaxel stabilizes microtubules."
  },
  {
    id: "69",
    text: "Which drug is part of the anti-metabolite class?",
    options: ["5-Fluorouracil", "Bleomycin", "Carmustine", "Vinblastine"],
    correct: 0,
    explanation: "5-FU interferes with nucleotide synthesis."
  },
  {
    id: "70",
    text: "Which agent is used in Hodgkin's lymphoma and derived from podophyllotoxin?",
    options: ["Etoposide", "Cisplatin", "Methotrexate", "Doxorubicin"],
    correct: 0,
    explanation: "Etoposide is a topoisomerase II inhibitor derived from podophyllotoxin."
  },
  {
    id: "71",
    text: "Which drug is associated with cardiotoxicity related to cumulative dose?",
    options: ["Doxorubicin", "Vincristine", "Methotrexate", "Bleomycin"],
    correct: 0,
    explanation: "Anthracyclines like doxorubicin have dose-limiting cardiotoxicity."
  },
  {
    id: "72",
    text: "The mechanism of action of irinotecan is inhibiting:",
    options: ["Topoisomerase I", "DNA polymerase", "Topoisomerase II", "RNA polymerase"],
    correct: 0,
    explanation: "Irinotecan is a topoisomerase I inhibitor."
  },
  {
    id: "73",
    text: "Which agent is a folate analog?",
    options: ["Methotrexate", "Vinblastine", "Doxorubicin", "Bleomycin"],
    correct: 0,
    explanation: "Methotrexate is a folate analog that inhibits dihydrofolate reductase."
  },
  {
    id: "74",
    text: "Which drug is renowned for causing myelosuppression as dose-limiting toxicity?",
    options: ["Methotrexate", "Paclitaxel", "Cisplatin", "Vincristine"],
    correct: 0,
    explanation: "Methotrexate and many chemo drugs cause bone marrow suppression."
  },
  {
    id: "75",
    text: "Which drug is an antitumor antibiotic used in Hodgkin lymphoma?",
    options: ["Doxorubicin", "Bleomycin", "Methotrexate", "Vinblastine"],
    correct: 1,
    explanation: "Bleomycin is an antitumor antibiotic used in Hodgkin lymphoma."
  },
  {
    id: "76",
    text: "Which chemotherapy drug exhibits a disulfiram-like effect?",
    options: ["Procarbazine", "Vincristine", "Cyclophosphamide", "Doxorubicin"],
    correct: 0,
    explanation: "Procarbazine causes disulfiram-like reactions with alcohol intake."
  }
];


// Group all tests/folders here, you can add more folders
const initialTestData = {
  "Anti-cancer drug": fullAntiCancerQuestions,
};

// -------- App Component --------
export default function App() {
  const [tests, setTests] = useState(() => {
    const data = localStorage.getItem("mockTests");
    return data ? JSON.parse(data) : initialTestData;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoginVisible, setAdminLoginVisible] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoginError, setAdminLoginError] = useState("");
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { questionId: optionIndex }
  const [showResults, setShowResults] = useState(false);

  const [newFolderName, setNewFolderName] = useState("");
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    options: ["", "", "", ""],
    correct: 0,
    explanation: ""
  });

  useEffect(() => {
    localStorage.setItem("mockTests", JSON.stringify(tests));
  }, [tests]);

  useEffect(() => {
    if (!currentFolder) return;
    setCurrentQuestions(tests[currentFolder] || []);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setShowResults(false);
  }, [currentFolder, tests]);

  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    if (adminUsername === "admin" && adminPassword === "admin123") {
      setIsAdmin(true);
      setAdminLoginVisible(false);
      setAdminUsername("");
      setAdminPassword("");
      setAdminLoginError("");
    } else {
      setAdminLoginError("Invalid username or password");
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setCurrentFolder(null);
  };

  const addFolder = () => {
    const name = newFolderName.trim();
    if (!name) {
      alert("Folder name cannot be empty");
      return;
    }
    if (tests[name]) {
      alert("Folder already exists");
      return;
    }
    setTests(prev => ({ ...prev, [name]: [] }));
    setNewFolderName("");
  };

  const addNewQuestion = () => {
    if (!currentFolder) {
      alert("Select or create a folder first!");
      return;
    }
    if (!newQuestion.text.trim() || newQuestion.options.some(opt => !opt.trim())) {
      alert("Fill all question and option fields");
      return;
    }
    const id = Date.now().toString();
    const questionToAdd = { ...newQuestion, id };

    setTests(prev => ({
      ...prev,
      [currentFolder]: [...(prev[currentFolder] || []), questionToAdd]
    }));

    setNewQuestion({
      text: "",
      options: ["", "", "", ""],
      correct: 0,
      explanation: ""
    });
  };

  const selectAnswer = (questionId, optionIdx) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const calculateScore = () => {
    if (!currentFolder) return 0;
    const questions = tests[currentFolder];
    return questions.reduce((score, q) => (userAnswers[q.id] === q.correct ? score + 1 : score), 0);
  };

  if (isAdmin) {
    return (
      <Container>
        <Heading>Admin Panel - Mock Test Management</Heading>
        <Button onClick={handleAdminLogout}>Logout Admin</Button>

        <Section>
          <h2>Create New Folder / Test</h2>
          <Input
            placeholder="Folder name"
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
          />
          <Button onClick={addFolder}>Add Folder</Button>
        </Section>

        <Section>
          <h2>Folders / Tests</h2>
          {Object.keys(tests).length === 0 && <p>No folders created yet.</p>}
          <ul>
            {Object.keys(tests).map(folder => (
              <li key={folder} style={{marginBottom: "10px"}}>
                <b>{folder}</b> ({tests[folder].length} questions)
                <Button style={{marginLeft:"10px"}} onClick={() => setCurrentFolder(folder)}>
                  Manage Questions
                </Button>
              </li>
            ))}
          </ul>
        </Section>

        {currentFolder && (
          <>
            <Section>
              <h2>Manage Questions for "{currentFolder}"</h2>

              <h3>Add New Question</h3>
              <Label>Question:</Label>
              <TextArea
                rows={3}
                value={newQuestion.text}
                onChange={e => setNewQuestion({ ...newQuestion, text: e.target.value })}
              />

              <Label>Options:</Label>
              {newQuestion.options.map((opt, idx) => (
                <div key={idx} style={{marginBottom: "10px"}}>
                  <Input
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    value={opt}
                    onChange={e => {
                      const newOptions = [...newQuestion.options];
                      newOptions[idx] = e.target.value;
                      setNewQuestion({ ...newQuestion, options: newOptions });
                    }}
                  />
                  <label>
                    <input
                      type="radio"
                      name="correctOption"
                      checked={newQuestion.correct === idx}
                      onChange={() => setNewQuestion({ ...newQuestion, correct: idx })}
                    />{" "}
                    Mark as correct
                  </label>
                </div>
              ))}

              <Label>Explanation (shown for wrong answers):</Label>
              <TextArea
                rows={2}
                value={newQuestion.explanation}
                onChange={e => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
              />

              <Button onClick={addNewQuestion}>Add Question</Button>
            </Section>

            <Section>
              <h3>Existing Questions</h3>
              {tests[currentFolder].length === 0 && <p>No questions in this folder yet.</p>}
              <ul>
                {tests[currentFolder].map(q => (
                  <li key={q.id} style={{marginBottom:"10px"}}>
                    <b>{q.text}</b> (Answer: {String.fromCharCode(65 + q.correct)})
                  </li>
                ))}
              </ul>
            </Section>
          </>
        )}
      </Container>
    );
  }

  if (!currentFolder) {
    return (
      <Container>
        <Heading>Mock Test App</Heading>

        {!adminLoginVisible ? (
          <>
            <Button
              onClick={() => setAdminLoginVisible(true)}
              style={{ marginBottom: "20px", background: "#c33", color: "#fff" }}
            >
              Admin Login
            </Button>

            <h2>Select a Test Folder</h2>
            {Object.keys(tests).length === 0 && <p>No test folders available</p>}
            <ul>
              {Object.keys(tests).map(folder => (
                <li key={folder} style={{marginBottom: "10px"}}>
                  <Button style={{width: "100%", fontSize: "1.1rem"}} onClick={() => setCurrentFolder(folder)}>
                    {folder} ({tests[folder].length} Questions)
                  </Button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <form onSubmit={handleAdminLoginSubmit} style={{ maxWidth: "300px", margin: "auto" }}>
            <Label>Admin Username:</Label>
            <Input
              type="text"
              required
              value={adminUsername}
              onChange={e => setAdminUsername(e.target.value)}
            />

            <Label>Admin Password:</Label>
            <Input
              type="password"
              required
              value={adminPassword}
              onChange={e => setAdminPassword(e.target.value)}
            />

            {adminLoginError && <p style={{ color: "red" }}>{adminLoginError}</p>}

            <Button type="submit" style={{ width: "100%" }}>
              Log In
            </Button>
            <Button type="button" onClick={() => setAdminLoginVisible(false)} style={{ marginTop: "8px", width: "100%" }}>
              Cancel
            </Button>
          </form>
        )}
      </Container>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const total = currentQuestions.length;

    return (
      <Container>
        <Heading>Test Results: {currentFolder}</Heading>

        <p>
          You scored {score} out of {total} ({((score / total) * 100).toFixed(2)}%)
        </p>

        <Button
          onClick={() => {
            setShowResults(false);
            setCurrentQuestionIdx(0);
            setUserAnswers({});
          }}
        >
          Retake Test
        </Button>
        <Button onClick={() => setCurrentFolder(null)} style={{ marginLeft: "10px" }}>
          Back to Folder Selection
        </Button>

        <Section>
          <h2>Review Your Answers</h2>
          {currentQuestions.map((q, i) => {
            const userAns = userAnswers[q.id];
            const isCorrect = userAns === q.correct;
            return (
              <ReviewItem key={q.id} correct={isCorrect}>
                <p>
                  <b>
                    Q{i + 1}: {q.text}
                  </b>
                </p>
                <AnswerText>Your answer: {userAns != null ? q.options[userAns] : "Not answered"} {!isCorrect && "(Wrong)"}</AnswerText>
                <AnswerText>Correct answer: {q.options[q.correct]}</AnswerText>
                {!isCorrect && q.explanation && <AnswerText><i>Explanation: {q.explanation}</i></AnswerText>}
              </ReviewItem>
            );
          })}
        </Section>
      </Container>
    );
  }

  const question = currentQuestions[currentQuestionIdx];

  return (
    <Container>
      <Heading>Test: {currentFolder}</Heading>
      <Button onClick={() => setCurrentFolder(null)} style={{ marginBottom: "15px" }}>
        Back to Folder Selection
      </Button>

      <p>
        Question {currentQuestionIdx + 1} of {currentQuestions.length}
      </p>
      <p style={{ fontWeight: "600", fontSize: "1.2rem", marginBottom: "16px" }}>{question.text}</p>

      <ul style={{ paddingLeft: 0, listStyleType: "none" }}>
        {question.options.map((opt, idx) => (
          <li key={idx} style={{ marginBottom: "12px" }}>
            <OptionLabel checked={userAnswers[question.id] === idx}>
              <input
                type="radio"
                name={`answer-${question.id}`}
                checked={userAnswers[question.id] === idx}
                onChange={() => selectAnswer(question.id, idx)}
                style={{ marginRight: "10px" }}
              />
              {String.fromCharCode(65 + idx)}. {opt}
            </OptionLabel>
          </li>
        ))}
      </ul>

      <div>
        <Button onClick={() => setCurrentQuestionIdx(i => Math.max(i - 1, 0))} disabled={currentQuestionIdx === 0}>
          Previous
        </Button>
        <Button
          onClick={() => setCurrentQuestionIdx(i => Math.min(i + 1, currentQuestions.length - 1))}
          disabled={currentQuestionIdx === currentQuestions.length - 1}
          style={{ marginLeft: "10px" }}
        >
          Next
        </Button>

        <Button
          onClick={() => setShowResults(true)}
          style={{ marginLeft: "20px" }}
          disabled={currentQuestions.length === 0}
        >
          Submit Test
        </Button>
      </div>

      <p style={{ marginTop: "20px" }}>
        Selected Answer: {userAnswers[question.id] != null ? question.options[userAnswers[question.id]] : "None"}
      </p>
    </Container>
  );
}
