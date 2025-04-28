
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, FileCheck, BookOpen, ArrowRight } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="font-serif text-2xl font-bold text-navy-800">Patent Pilot</h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-navy-900 to-navy-700 text-white py-20">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                Simplifying the Patent Application Process
              </h1>
              <p className="text-lg mb-8 text-slate-100">
                Patent Pilot helps college students and first-time inventors navigate the complex world of Indian patent filings with intuitive forms, AI-assisted drafting, and step-by-step guidance.
              </p>
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-navy-900 font-medium" asChild>
                <Link to="/login">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="md:w-1/2 max-w-md">
              <div className="bg-white rounded-lg shadow-xl p-6 transform rotate-1">
                <div className="mb-4 pb-3 border-b">
                  <h3 className="font-medium text-navy-800">Patent Form 1</h3>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-100 rounded"></div>
                  <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                  <div className="h-10 bg-slate-100 rounded w-full"></div>
                  <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-xl p-6 transform -rotate-2 -mt-10 ml-16">
                <div className="mb-4 pb-3 border-b">
                  <h3 className="font-medium text-navy-800">Draft Preview</h3>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-100 rounded"></div>
                  <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-100 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Simplify Your Patent Application Journey</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Our platform provides everything you need to prepare and submit high-quality patent applications without specialized legal knowledge.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-white rounded-lg p-8 shadow-md border border-slate-200 transform transition-transform hover:translate-y-[-5px]">
                <div className="bg-navy-50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                  <FileText className="h-8 w-8 text-navy-500" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3">Guided Form Filling</h3>
                <p className="text-slate-600">
                  Interactive forms with educational tooltips help you complete Forms 1, 2, 3, and 5 for the Indian Patent Office with confidence.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-8 shadow-md border border-slate-200 transform transition-transform hover:translate-y-[-5px]">
                <div className="bg-navy-50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                  <BookOpen className="h-8 w-8 text-navy-500" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3">AI-Assisted Drafting</h3>
                <p className="text-slate-600">
                  Our AI guides you step-by-step through each section of your patent specification, from background to claims, generating professional-quality text.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-8 shadow-md border border-slate-200 transform transition-transform hover:translate-y-[-5px]">
                <div className="bg-navy-50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                  <FileCheck className="h-8 w-8 text-navy-500" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3">Filing Guidance</h3>
                <p className="text-slate-600">
                  Complete workflow guidance from application preparation through filing with the Indian Patent Office (IPO).
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-navy-50 py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Patent Journey?
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-10">
              Join thousands of students and inventors who have successfully filed patents using our platform.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Button size="lg" variant="default" asChild>
                <Link to="/login">Create Free Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/filing-guide">View Filing Guide</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-white border-t py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="font-serif text-lg font-bold text-navy-800">
                Patent Pilot
              </h2>
              <p className="text-sm text-slate-500">
                &copy; 2025 InvnTree. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6">
              <Link to="/terms" className="text-sm text-navy-600 hover:text-navy-800">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-sm text-navy-600 hover:text-navy-800">
                Privacy Policy
              </Link>
              <Link to="/about" className="text-sm text-navy-600 hover:text-navy-800">
                About Us
              </Link>
              <Link to="/contact" className="text-sm text-navy-600 hover:text-navy-800">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
