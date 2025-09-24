import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { cn } from "@/utils";

import { sharedAnimationCards } from "@/components/auth/animation-cards";
import SocialLogin from "@/components/auth/social-login";
import Logo from "@/components/icons/logo";
import { headers } from "next/headers";

const AuthLoginPage = () => {
  const hdrs = headers();
  const error = hdrs.get("referer")?.includes("error=OAuthAccountNotLinked")
    ? "OAuthAccountNotLinked"
    : undefined;

  return (
    <Card className={cn("w-full max-w-sm", sharedAnimationCards)}>
      <CardHeader className="flex items-center justify-center text-center">
        <Logo className="mb-2 h-10 w-10" />
        <CardTitle className="text-2xl font-medium duration-500 animate-in fade-in-20">
          Log in to Routaar
        </CardTitle>
        <CardDescription className="duration-500 animate-in fade-in-30">
          Log in with your favorite social provider to get started:
        </CardDescription>
        {error === "OAuthAccountNotLinked" && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            The selected provider is not linked to your existing account. Try a different provider or contact support.
          </p>
        )}
      </CardHeader>
      <CardContent className="grid gap-4 duration-500 animate-in fade-in-30">
        <SocialLogin />
      </CardContent>
    </Card>
  );
};

export default AuthLoginPage;
