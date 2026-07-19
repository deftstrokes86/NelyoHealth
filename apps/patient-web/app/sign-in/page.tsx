"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Fingerprint,
  Chrome,
  LifeBuoy,
  Lock,
  Mail,
  ShieldCheck,
  UsersRound
} from "lucide-react";
import { Button, Checkbox, useContent } from "@nelyohealth/ui-foundation";
import { AuthCard } from "../../src/components/auth/AuthCard";
import { AuthFooter } from "../../src/components/auth/AuthFooter";
import { AuthInput } from "../../src/components/auth/AuthInput";
import { AuthLayout } from "../../src/components/auth/AuthLayout";
import { PasswordInput } from "../../src/components/auth/PasswordInput";
import { SecurityBadge } from "../../src/components/auth/SecurityBadge";
import { SocialAuthButton } from "../../src/components/auth/SocialAuthButton";
import { TrustFeature } from "../../src/components/auth/TrustFeature";
import { signInSchema } from "../../src/lib/auth-schemas";

type SubmitState = "idle" | "submitting" | "success";

export default function SignInPage() {
  const router = useRouter();
  const brand = useContent("marketing-microcopy.brand.name");
  const hero = useContent("auth-signin.hero.headline");
  const trustControl = useContent("auth-signin.trust.control");
  const trustRoleAware = useContent("auth-signin.trust.role-aware");
  const trustSecure = useContent("auth-signin.trust.secure");
  const card = useContent("auth-signin.card.title");
  const fieldEmail = useContent("auth-signin.field.email");
  const fieldPassword = useContent("auth-signin.field.password");
  const rememberMe = useContent("auth-signin.field.remember-me");
  const forgotPassword = useContent("auth-signin.link.forgot-password");
  const ctaSignIn = useContent("auth-signin.cta.sign-in");
  const ctaSigningIn = useContent("auth-signin.cta.signing-in");
  const divider = useContent("auth-signin.divider.or-continue-with");
  const socialGoogle = useContent("auth-signin.social.google");
  const socialApple = useContent("auth-signin.social.apple");
  const socialMicrosoft = useContent("auth-signin.social.microsoft");
  const socialComingSoon = useContent("auth-signin.social.coming-soon");
  const footerNoAccount = useContent("auth-signin.footer.no-account");
  const footerCreateAccount = useContent("auth-signin.footer.create-account");
  const notePrivacy = useContent("auth-signin.note.privacy");
  const badgeEncrypted = useContent("auth-signin.badge.encrypted");
  const noteRecovery = useContent("auth-signin.note.recovery");
  const linkContactSupport = useContent("auth-signin.link.contact-support");
  const errorCredentialsInvalid = useContent("auth-signin.error.credentials-invalid");
  const errorRateLimit = useContent("auth-signin.error.rate-limit-exceeded");
  const errorGeneric = useContent("auth-signin.error.generic");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [state, setState] = useState<SubmitState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = signInSchema.safeParse({ email, password, rememberMe: remember });
    if (!parsed.success) {
      const flattened = parsed.error.flatten().fieldErrors;
      setFieldErrors({ email: flattened.email?.[0], password: flattened.password?.[0] });
      return;
    }
    setFieldErrors({});
    setState("submitting");

    try {
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: parsed.data.email, password: parsed.data.password })
      });
      const body = await response.json();

      if (!response.ok) {
        const reasonCode = body.error as string;
        if (reasonCode === "rate-limit-exceeded") {
          setFormError(errorRateLimit.title);
        } else if (reasonCode === "credentials-invalid") {
          setFormError(errorCredentialsInvalid.title);
        } else {
          setFormError(errorGeneric.title);
        }
        setState("idle");
        return;
      }

      setState("success");
      router.push(body.redirectPath ?? "/account");
    } catch {
      setFormError(errorGeneric.title);
      setState("idle");
    }
  }

  const isSubmitting = state === "submitting" || state === "success";

  return (
    <AuthLayout
      eyebrow={brand.title}
      headline={hero.title}
      body={hero.body}
      trustFeatures={
        <>
          <TrustFeature icon={ShieldCheck} title={trustControl.title} body={trustControl.body} />
          <TrustFeature icon={UsersRound} title={trustRoleAware.title} body={trustRoleAware.body} />
          <TrustFeature icon={Lock} title={trustSecure.title} body={trustSecure.body} />
        </>
      }
    >
      <AuthCard title={card.title} subtitle={card.body}>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          <AuthInput
            label={fieldEmail.title}
            icon={<Mail size={16} strokeWidth={1.9} aria-hidden />}
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={fieldErrors.email}
          />
          <PasswordInput
            label={fieldPassword.title}
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={fieldErrors.password}
          />
          <div className="flex items-center justify-between">
            <Checkbox checked={remember} onChange={(event) => setRemember(event.target.checked)}>
              {rememberMe.title}
            </Checkbox>
            <a
              href="/forgot-password"
              className="text-body-sm font-medium text-primary hover:underline"
            >
              {forgotPassword.title}
            </a>
          </div>

          {formError ? (
            <p role="alert" aria-live="polite" className="text-body-sm font-medium text-red-600">
              {formError}
            </p>
          ) : null}

          <Button type="submit" disabled={isSubmitting} className="w-full justify-center">
            {isSubmitting ? ctaSigningIn.title : ctaSignIn.title}
          </Button>

          <div className="flex items-center gap-3 py-1">
            <span className="h-px flex-1 bg-border" />
            <span className="text-caption uppercase text-muted-foreground">{divider.title}</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="flex flex-col gap-2.5">
            <SocialAuthButton
              icon={<Chrome size={17} strokeWidth={1.9} aria-hidden />}
              label={socialGoogle.title}
              comingSoonLabel={socialComingSoon.title}
            />
            <SocialAuthButton
              icon={<Fingerprint size={17} strokeWidth={1.9} aria-hidden />}
              label={socialApple.title}
              comingSoonLabel={socialComingSoon.title}
            />
            <SocialAuthButton
              icon={<Building2 size={17} strokeWidth={1.9} aria-hidden />}
              label={socialMicrosoft.title}
              comingSoonLabel={socialComingSoon.title}
            />
          </div>
        </form>

        <AuthFooter
          prompt={footerNoAccount.title}
          linkLabel={footerCreateAccount.title}
          href="/create-account"
        />

        <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5">
          <p className="text-caption text-muted-foreground">{notePrivacy.title}</p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SecurityBadge icon={Lock} label={badgeEncrypted.title} />
            <a
              href="/contact"
              className="inline-flex items-center gap-1.5 text-caption font-medium text-muted-foreground hover:text-primary"
            >
              <LifeBuoy size={14} strokeWidth={1.9} aria-hidden />
              {noteRecovery.title} {linkContactSupport.title}
            </a>
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
