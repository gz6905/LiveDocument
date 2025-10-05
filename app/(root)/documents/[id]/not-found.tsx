"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function NotFound() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  const handleReturnToDashboard = () => {
    router.push("/");
  };

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h2 className="text-xl font-semibold mb-4">Document Not Found</h2>
      <p className="text-gray-600 mb-6">
        This document doesn&apos;t exist or you don&apos;t have access to it.
      </p>
      <div className="flex gap-4">
        {isSignedIn ? (
          <Button
            onClick={handleReturnToDashboard}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
          >
            Return to Dashboard
          </Button>
        ) : (
          <Button
            onClick={handleSignIn}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
          >
            Sign In to Access Documents
          </Button>
        )}
      </div>
    </div>
  );
}
