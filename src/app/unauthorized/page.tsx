import Footer from "@/components/layout/footer";
import { buttonVariants } from "@/ui/button";
import { AlertTriangle, LogIn } from "lucide-react";
import Link from "next/link";

const UnauthorizedPage = async () => {
  return (
    <main className="relative h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] dark:bg-neutral-900"></div>
      <section className="flex flex-col items-center px-6 pt-16 text-center md:pt-24 lg:pt-32">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <AlertTriangle className="text-red-600 dark:text-red-400" size={36} />
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Access restricted</h1>
        </div>
        <p className="mt-4 max-w-[65ch] text-sm text-neutral-600 dark:text-neutral-300 md:text-base">
          This dashboard is restricted to authorized accounts only. If you believe you should have access, please contact the maintainer.
        </p>
        <div className="mt-6 flex items-center space-x-2">
          <Link href="/auth" className={buttonVariants({ variant: "default" })}>
            <LogIn size={18} />
            <span>Sign in</span>
          </Link>
          <a
            href="https://api.whatsapp.com/send/?phone=994507746585&text=Hello!%20Please%20grant%20access%20to%20Routaar%20dashboard."
            className={buttonVariants({ variant: "outline" })}
          >
            <span>Contact maintainer</span>
          </a>
        </div>
      </section>
      <Footer className="fixed bottom-0 mt-4 py-4" />
    </main>
  );
};

export default UnauthorizedPage; 