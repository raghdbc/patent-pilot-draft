
import { PatentFormValues } from "./patentFormSchema";

// Initialize empty form values
export const emptyValuesFactory = (): Partial<PatentFormValues> => ({
  applicationType: "provisional",
  inventors: [
    {
      name: "",
      gender: "prefer_not_to_say",
      nationality: "Indian",
      residency: "Indian",
      state: "",
      address: ""
    }
  ],
  wantToPreConfigure: "no",
  applicantMode: "no_applicant_configured",
  applicants: {
    fromInventors: [],
    additionalApplicants: []
  },
  title: "",
  sheetCounts: {
    patentDocumentSheets: 0,
    abstractSheets: 0,
    claimsSheets: 0,
    drawingSheets: 0
  },
  others: {
    numberOfClaims: 0,
    numberOfDrawings: 0
  },
  agentDetails: {
    inpaNo: "",
    agentName: "",
    agentMobile: "",
    agentEmail: ""
  },
  addressForService: {
    serviceName: "",
    postalAddress: "",
    telephone: "",
    mobile: "",
    email: ""
  }
});
