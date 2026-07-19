import { Link } from "@nelyohealth/ui-foundation";

export interface AuthFooterProps {
  prompt: string;
  linkLabel: string;
  href: string;
}

export function AuthFooter({ prompt, linkLabel, href }: AuthFooterProps) {
  return (
    <p className="pt-6 text-center text-body-sm text-muted-foreground">
      {prompt}{" "}
      <Link href={href} className="font-semibold text-primary hover:underline">
        {linkLabel}
      </Link>
    </p>
  );
}
