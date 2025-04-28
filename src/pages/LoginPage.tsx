
import { AuthForm } from "@/components/auth/AuthForm";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="bg-navy-800 text-white md:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4">Patent Pilot</h1>
          <p className="text-xl mb-6">
            Streamline the patent application process for first-time inventors and students
          </p>
          <ul className="space-y-4">
            <li className="flex items-center">
              <svg className="h-5 w-5 mr-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Guided form filling for Indian patents
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 mr-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              AI-assisted patent drafting
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 mr-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Educational tooltips and guidance
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 mr-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Complete filing workflow guidance
            </li>
          </ul>
          <div className="mt-8 text-sm opacity-75">
            Developed by InvnTree &copy; 2025
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          <AuthForm />
          <div className="mt-8 text-center text-sm">
            <p>
              By using Patent Pilot, you agree to our{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
