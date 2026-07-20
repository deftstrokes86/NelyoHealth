"use client";

import { useState, type FormEvent } from "react";
import { CircleCheck, Mail, ShieldCheck, User } from "lucide-react";
import { Button, Checkbox, Link, useContent } from "@nelyohealth/ui-foundation";
import { AuthCard } from "../../src/components/auth/AuthCard";
import { AuthFooter } from "../../src/components/auth/AuthFooter";
import { AuthInput } from "../../src/components/auth/AuthInput";
import { AuthLayout } from "../../src/components/auth/AuthLayout";
import { PasswordInput } from "../../src/components/auth/PasswordInput";
import { SecurityBadge } from "../../src/components/auth/SecurityBadge";
import { signUpSchema } from "../../src/lib/auth-schemas";

type SubmitState = "idle" | "submitting" | "success";

export default function CreateAccountPage() {
  const brand = useContent("marketing-microcopy.brand.name");
  const hero = useContent("auth-create-account.hero.headline");
  const trustEssentials = useContent("auth-create-account.trust.essentials");
  const trustControl = useContent("auth-create-account.trust.control");
  const trustEveryRole = useContent("auth-create-account.trust.every-role");
  const card = useContent("auth-create-account.card.title");
  const fieldName = useContent("auth-create-account.field.name");
  const fieldEmail = useContent("auth-create-account.field.email");
  const fieldPassword = useContent("auth-create-account.field.password");
  const fieldConfirmPassword = useContent("auth-create-account.field.confirm-password");
  const notePrivacy = useContent("auth-create-account.note.privacy");
  const linkTerms = useContent("auth-create-account.link.terms");
  const linkPrivacy = useContent("auth-create-account.link.privacy");
  const ctaCreate = useContent("auth-create-account.cta.create-account");
  const ctaCreating = useContent("auth-create-account.cta.creating-account");
  const footerHaveAccount = useContent("auth-create-account.footer.have-account");
  const footerSignIn = useContent("auth-create-account.footer.sign-in");
  const badgeNdpr = useContent("auth-create-account.badge.ndpr");
  const noteConsentSettings = useContent("auth-create-account.note.consent-settings");
  const successCheckEmail = useContent("auth-create-account.success.check-email");
  const errorGeneric = useContent("auth-create-account.error.generic");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    termsAccepted?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [state, setState] = useState<SubmitState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = signUpSchema.safeParse({
      fullName,
      email,
      password,
      confirmPassword,
      termsAccepted
    });
    if (!parsed.success) {
      const flattened = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        fullName: flattened.fullName?.[0],
        email: flattened.email?.[0],
        password: flattened.password?.[0],
        confirmPassword: flattened.confirmPassword?.[0],
        termsAccepted: flattened.termsAccepted?.[0]
      });
      return;
    }
    setFieldErrors({});
    setState("submitting");

    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: parsed.data.fullName,
          email: parsed.data.email,
          password: parsed.data.password
        })
      });
      const body = await response.json();

      if (!response.ok) {
        setFormError(errorGeneric.title);
        setState("idle");
        return;
      }

      setState("success");
    } catch {
      setFormError(errorGeneric.title);
      setState("idle");
    }
  }

  const isSubmitting = state === "submitting" || state === "success";

  const heroImage = {
    src: "/assets/create-account-hero.png",
    alt: `${brand.title} — ${hero.title}`,
    width: 597,
    height: 1402
  };
  const srOnlyDescription = (
    <>
      {hero.body} {trustEssentials.title} {trustEssentials.body} {trustControl.title}{" "}
      {trustControl.body} {trustEveryRole.title} {trustEveryRole.body}
    </>
  );

  if (state === "success") {
    return (
      <AuthLayout image={heroImage} srOnlyDescription={srOnlyDescription}>
        <AuthCard title={successCheckEmail.title} subtitle={successCheckEmail.body}>
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ds-brand-50 text-ds-brand-600">
              <CircleCheck size={28} strokeWidth={1.8} aria-hidden />
            </span>
            <p className="text-body-sm text-muted-foreground">{noteConsentSettings.title}</p>
          </div>
          <AuthFooter
            prompt={footerHaveAccount.title}
            linkLabel={footerSignIn.title}
            href="/sign-in"
          />
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout image={heroImage} srOnlyDescription={srOnlyDescription}>
      <AuthCard title={card.title} subtitle={card.body}>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          <AuthInput
            label={fieldName.title}
            icon={<User size={16} strokeWidth={1.9} aria-hidden />}
            autoComplete="name"
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            error={fieldErrors.fullName}
          />
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
            autoComplete="new-password"
            required
            showStrength
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={fieldErrors.password}
          />
          <PasswordInput
            label={fieldConfirmPassword.title}
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            error={fieldErrors.confirmPassword}
          />

          <div className="flex flex-col gap-2 rounded-2xl bg-ds-brand-50 px-4 py-3.5">
            <p className="text-body-sm font-medium text-ds-brand-800">{notePrivacy.title}</p>
            <p className="text-caption text-ds-brand-700">{notePrivacy.body}</p>
          </div>

          <div className="flex flex-col gap-1">
            <Checkbox
              checked={termsAccepted}
              onChange={(event) => setTermsAccepted(event.target.checked)}
              variant={fieldErrors.termsAccepted ? "error" : "default"}
              aria-label={`I agree to the ${linkTerms.title} and ${linkPrivacy.title}.`}
            >
              <span className="text-body-sm text-foreground">
                I agree to the{" "}
                <Link href="/legal-and-regulatory-notices" className="font-semibold">
                  {linkTerms.title}
                </Link>{" "}
                and{" "}
                <Link href="/privacy-overview" className="font-semibold">
                  {linkPrivacy.title}
                </Link>
                .
              </span>
            </Checkbox>
            {fieldErrors.termsAccepted ? (
              <p role="alert" className="text-caption font-medium text-red-600">
                {fieldErrors.termsAccepted}
              </p>
            ) : null}
          </div>

          {formError ? (
            <p role="alert" aria-live="polite" className="text-body-sm font-medium text-red-600">
              {formError}
            </p>
          ) : null}

          <Button type="submit" disabled={isSubmitting} className="w-full justify-center">
            {isSubmitting ? ctaCreating.title : ctaCreate.title}
          </Button>
        </form>

        <AuthFooter
          prompt={footerHaveAccount.title}
          linkLabel={footerSignIn.title}
          href="/sign-in"
        />

        <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5">
          <SecurityBadge icon={ShieldCheck} label={badgeNdpr.title} />
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
