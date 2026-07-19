import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
      <SignIn
        routing="path"
        path="/sign-in"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-neutral-900 border border-neutral-800 shadow-xl rounded-xl",
            headerTitle: "text-white",
            headerSubtitle: "text-neutral-400",
            socialButtonsBlockButton: "border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-white",
            socialButtonsBlockButtonText: "text-white font-medium",
            dividerLine: "bg-neutral-800",
            dividerText: "text-neutral-500",
            formFieldLabel: "text-neutral-300",
            formFieldInput: "bg-neutral-950 border-neutral-800 text-white focus:border-indigo-500 focus:ring-indigo-500",
            formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white",
            footerActionText: "text-neutral-400",
            footerActionLink: "text-indigo-400 hover:text-indigo-300",
            identityPreviewText: "text-white",
            identityPreviewEditButton: "text-indigo-400 hover:text-indigo-300",
          },
        }}
      />
    </div>
  );
}
