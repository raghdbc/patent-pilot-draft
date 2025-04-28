
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function FilingGuidePage() {
  const filingSteps = [
    {
      title: "Prepare Your Application",
      description:
        "Complete all required forms and draft your patent specification using Patent Pilot.",
      details: [
        "Form 1: Application for grant of patent",
        "Form 2: Provisional/complete specification",
        "Form 3: Statement and undertaking under section 8",
        "Form 5: Declaration of inventorship",
        "Drawings (if applicable)",
        "Abstract",
      ],
    },
    {
      title: "Pay Fees",
      description:
        "Calculate and pay the required fees based on your applicant type.",
      details: [
        "Natural person: ₹1,600 (e-filing)",
        "Small entity: ₹4,000 (e-filing)",
        "Large entity: ₹8,000 (e-filing)",
        "Fee payment can be made online through the IPO website",
      ],
    },
    {
      title: "File Your Application",
      description: "Submit your application to the Indian Patent Office (IPO).",
      details: [
        "Create an account on the IPO e-filing portal",
        "Upload all completed forms and documents",
        "Submit application and obtain application number",
        "Track your application status online",
      ],
    },
    {
      title: "Request Examination",
      description:
        "File a request for examination within 48 months of priority date or filing date.",
      details: [
        "File Form 18 to request examination",
        "Pay examination fee",
        "Monitor status through the IPO website",
      ],
    },
    {
      title: "Respond to Office Actions",
      description:
        "Address any objections or requirements raised by the patent examiner.",
      details: [
        "First Examination Report (FER) will be issued",
        "Respond to all objections within 6 months (extendable by 3 months)",
        "Make necessary amendments to the application",
        "Submit supporting documents if requested",
      ],
    },
    {
      title: "Grant and Publication",
      description:
        "Once all requirements are met, your patent will be granted and published.",
      details: [
        "Patent grant will be published in the Patent Journal",
        "Pay renewal fees to maintain the patent",
        "Patent remains in force for 20 years from filing date",
      ],
    },
  ];

  return (
    <MainLayout>
      <div className="main-section">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Indian Patent Filing Guide
          </h1>
          <p className="text-muted-foreground">
            A step-by-step guide to filing your patent with the Indian Patent
            Office
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              The patent filing process in India
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Filing a patent in India involves several steps, from preparing
              your application to responding to examination reports and finally
              obtaining a granted patent. This guide will walk you through the
              entire process to help you navigate the patent system effectively.
            </p>
            <p>
              The Indian Patent Office (IPO) operates under the Controller
              General of Patents, Designs and Trademarks, and has branches in
              Delhi, Mumbai, Chennai, and Kolkata. Patent applications can be
              filed online through the IPO's e-filing portal, which is the
              recommended method as it offers reduced fees and faster
              processing.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {filingSteps.map((step, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center mr-3">
                    {index + 1}
                  </div>
                  {step.title}
                </CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex}>{detail}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Important Resources</CardTitle>
            <CardDescription>
              Official links and additional information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <a
                  href="https://ipindia.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Indian Patent Office (IPO) Official Website
                </a>
              </li>
              <li>
                <a
                  href="https://ipindiaservices.gov.in/PatentSearch/PatentSearch/ViewApplicationStatus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Patent Application Status Inquiry
                </a>
              </li>
              <li>
                <a
                  href="https://ipindiaservices.gov.in/ePatentfiling/user/login.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  IPO E-Filing Portal
                </a>
              </li>
              <li>
                <a
                  href="https://ipindia.gov.in/writereaddata/Portal/IPOFormUpload/1_11_1/1_20_1.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Patent Rules, 2003 (as amended)
                </a>
              </li>
              <li>
                <a
                  href="https://ipindia.gov.in/writereaddata/Portal/IPOAct/1_31_1_patent-act-1970-11march2015.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  The Patents Act, 1970 (as amended)
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
