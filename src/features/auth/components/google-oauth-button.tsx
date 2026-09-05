import { Button } from "@/components/ui/button";
import { getGoogleOAuthUrl } from "@/features/auth/api/auth-api";

export function GoogleOAuthButton() {
  return (
    <Button asChild variant="outline" className="w-full">
      <a href={getGoogleOAuthUrl()}>
        <span aria-hidden="true" className="text-base font-semibold">G</span>
        Continue with Google
      </a>
    </Button>
  );
}
