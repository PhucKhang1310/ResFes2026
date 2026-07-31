import { useEffect, useState } from "react";
import { FaArrowLeft, FaCheck } from "react-icons/fa6";
import { useEditableContent } from "../../hook/useEditableContent";
import { fetchMentors } from "../../api/mentorApi";
import { submitRegistration } from "../../api/registrationApi";
import Footer from "../footer/Footer";
import NavBar from "../navbar/NavBar";
import TurnstileWidget from "../turnstile/TurnstileWidget";

type RegistrationForm = {
  name: string;
  email: string;
  topic: string;
  field: string;
  mentor: string;
};

const initialForm: RegistrationForm = {
  name: "",
  email: "",
  topic: "",
  field: "",
  mentor: "",
};

const inputClass =
  "w-full rounded border border-white/15 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25";

const labelClass = "text-xs font-bold uppercase tracking-wide text-white/60";

const RegistrationPage = () => {
  const { researchFields } = useEditableContent();
  const [form, setForm] = useState<RegistrationForm>(initialForm);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<Partial<RegistrationForm>>({});
  const [mentorOptions, setMentorOptions] = useState<string[]>([]);
  const [isLoadingMentors, setIsLoadingMentors] = useState(true);
  const [mentorLoadError, setMentorLoadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetchMentors(controller.signal)
      .then((mentors) => {
        const names = mentors
          .map((mentor) => mentor.name.trim())
          .filter(Boolean);

        setMentorOptions([...new Set(names)]);
        setMentorLoadError("");
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setMentorLoadError("Could not load mentors. Please refresh and try again.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingMentors(false);
        }
      });

    return () => controller.abort();
  }, []);

  const updateForm = (field: keyof RegistrationForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus("");
  };

  const validateForm = () => {
    const nextErrors: Partial<RegistrationForm> = {};

    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!form.topic.trim()) nextErrors.topic = "Topic is required.";
    if (!form.field) nextErrors.field = "Field is required.";
    if (!form.mentor) nextErrors.mentor = "Mentor is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) {
      setStatus("Please complete all required fields.");
      return;
    }

    if (!turnstileToken) {
      setStatus("Please complete bot verification before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus("");

      const response = await submitRegistration({
        name: form.name.trim(),
        email: form.email.trim(),
        topic: form.topic.trim(),
        field: form.field,
        mentor: form.mentor,
        turnstileToken,
      });

      setForm(initialForm);
      setErrors({});
      setStatus(`${response.message}. Reference: ${response.registrationId}`);
      setTurnstileToken("");
      setTurnstileResetKey((current) => current + 1);
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Registration could not be submitted. Please try again.",
      );
      setTurnstileToken("");
      setTurnstileResetKey((current) => current + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-amber-50">
      <NavBar />
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-36">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-orange-400"
        >
          <FaArrowLeft />
          Back
        </button>

        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-400">
            SRC 2026
          </p>
          <h1 className="mt-3 text-4xl font-black text-white md:text-5xl">
            Research Registration
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded border border-white/10 bg-zinc-900 p-5 shadow-2xl md:p-8"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Name" error={errors.name}>
              <input
                className={inputClass}
                value={form.name}
                onChange={(event) => updateForm("name", event.target.value)}
                placeholder="Your full name"
                maxLength={120}
              />
            </FormField>

            <FormField label="Email" error={errors.email}>
              <input
                className={inputClass}
                type="email"
                value={form.email}
                onChange={(event) => updateForm("email", event.target.value)}
                placeholder="you@example.com"
                maxLength={254}
              />
            </FormField>

            <div className="md:col-span-2">
              <FormField label="Topic" error={errors.topic}>
                <textarea
                  className={`${inputClass} min-h-28 resize-y`}
                  value={form.topic}
                  onChange={(event) => updateForm("topic", event.target.value)}
                  placeholder="Your research topic"
                  maxLength={500}
                />
              </FormField>
            </div>

            <FormField label="Field" error={errors.field}>
              <select
                className={inputClass}
                value={form.field}
                onChange={(event) => updateForm("field", event.target.value)}
              >
                <option value="">Select a field</option>
                {researchFields.map((field) => (
                  <option key={field.id} value={field.title}>
                    {field.title}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Mentor" error={errors.mentor || mentorLoadError}>
              <select
                className={inputClass}
                value={form.mentor}
                onChange={(event) => updateForm("mentor", event.target.value)}
                disabled={isLoadingMentors || Boolean(mentorLoadError)}
              >
                <option value="">
                  {isLoadingMentors
                    ? "Loading mentors..."
                    : mentorLoadError
                      ? "Mentors unavailable"
                      : "Select a mentor"}
                </option>
                {mentorOptions.map((mentor) => (
                  <option key={mentor} value={mentor}>
                    {mentor}
                  </option>
                ))}
              </select>
            </FormField>

            <div className="md:col-span-2">
              <TurnstileWidget
                resetKey={turnstileResetKey}
                onTokenChange={(token) => {
                  setTurnstileToken(token);
                  setStatus("");
                }}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={isSubmitting || isLoadingMentors || Boolean(mentorLoadError)}
              className="inline-flex items-center justify-center gap-2 rounded bg-orange-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaCheck />
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </button>
            {status ? (
              <p className="text-sm text-white/70" role="status">
                {status}
              </p>
            ) : null}
          </div>
        </form>
      </section>
      <Footer />
    </main>
  );
};

type FormFieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

const FormField = ({ label, error, children }: FormFieldProps) => (
  <label className="grid gap-2">
    <span className={labelClass}>{label}</span>
    {children}
    {error ? <span className="text-xs text-orange-300">{error}</span> : null}
  </label>
);

export default RegistrationPage;
