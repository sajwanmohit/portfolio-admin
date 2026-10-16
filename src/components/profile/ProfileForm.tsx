import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import {
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Pencil,
  Save,
  UserRound,
  X,
} from "lucide-react";
import { getProfile, saveProfile, type ProfileDetails } from "../../api/profile";
import { apiToast } from "../../utils/apiToast";

const emptyProfile: ProfileDetails = {
  name: "",
  designation: "",
  about: "",
  ownerGithubProfileURL: "",
  ownerLinkedinProfileURL: "",
  ownerEmailAddress: "",
};

function normalizeProfile(value: unknown): ProfileDetails {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ...emptyProfile };
  }

  const data = value as Record<string, unknown>;
  return {
    name: typeof data.name === "string" ? data.name : "",
    designation:
      typeof data.designation === "string" ? data.designation : "",
    about: typeof data.about === "string" ? data.about : "",
    ownerGithubProfileURL:
      typeof data.ownerGithubProfileURL === "string"
        ? data.ownerGithubProfileURL
        : "",
    ownerLinkedinProfileURL:
      typeof data.ownerLinkedinProfileURL === "string"
        ? data.ownerLinkedinProfileURL
        : "",
    ownerEmailAddress:
      typeof data.ownerEmailAddress === "string" ? data.ownerEmailAddress : "",
  };
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return initials.toUpperCase() || "P";
}

function getExternalUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

export default function ProfileForm() {
  const [profile, setProfile] = useState<ProfileDetails>(emptyProfile);
  const [form, setForm] = useState<ProfileDetails>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    setLoadError(null);

    try {
      const res = await getProfile();
      const details = normalizeProfile(res);
      setProfile(details);
      setForm(details);
    } catch (error) {
      console.error("Failed to load profile", error);
      if (axios.isAxiosError(error)) {
        setLoadError(
          error.response
            ? `The server returned HTTP ${error.response.status}.`
            : error.code === "ECONNABORTED" || error.code === "ETIMEDOUT"
              ? "The request timed out. Check your connection and try again."
              : "Could not reach the profile service. Check your connection and try again.",
        );
      } else {
        setLoadError("An unexpected error occurred while loading your profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProfile();
  }, []);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleEdit = () => {
    setForm(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setForm(profile);
    setIsEditing(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    const result = await apiToast(
      saveProfile(form).then(() => form),
      {
        loading: "Saving profile...",
        success: "Profile saved",
        error: "Failed to save profile",
      },
    );

    if (result) {
      setProfile(form);
      setIsEditing(false);
      setLoadError(null);
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-sm text-gray-500 shadow-sm">
        Loading profile...
      </div>
    );
  }

  if (loadError && !isEditing) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
        <p className="font-medium text-gray-900">Could not load your profile</p>
        <p className="mt-1 text-sm text-gray-500">{loadError}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void fetchProfile()}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Try again
          </button>
          <button
            type="button"
            onClick={() => {
              setProfile({ ...emptyProfile });
              setForm({ ...emptyProfile });
              setIsEditing(true);
            }}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            Continue with empty form
          </button>
        </div>
      </div>
    );
  }

  const hasProfileDetails = Object.values(profile).some((value) => value.trim());
  const githubUrl = getExternalUrl(profile.ownerGithubProfileURL);
  const linkedinUrl = getExternalUrl(profile.ownerLinkedinProfileURL);

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-blue-600">
          Personal information
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          Profile
        </h1>
        <p className="mt-2 text-gray-500">
          Manage the details that represent you across your portfolio.
        </p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 border-b border-gray-100 bg-gradient-to-br from-blue-50 via-white to-white p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-semibold text-white shadow-sm">
            {getInitials(profile.name)}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-500">Portfolio owner</p>
            <h2 className="mt-1 break-words text-2xl font-bold text-gray-900">
              {profile.name || "Your name"}
            </h2>
            <p className="mt-1 text-gray-600">
              {profile.designation || "Add a professional title"}
            </p>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Pencil size={16} />
              {hasProfileDetails ? "Edit profile" : "Add profile details"}
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">
            {loadError && (
              <p
                role="alert"
                className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
              >
                The saved profile could not be loaded. This form starts empty;
                saving it may replace details already stored on the server.
              </p>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Full name
                </span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Morgan"
                  autoComplete="name"
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Designation
                </span>
                <input
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  placeholder="e.g. Product designer"
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                About
              </span>
              <textarea
                name="about"
                value={form.about}
                onChange={handleChange}
                placeholder="Write a short introduction..."
                rows={5}
                className="w-full resize-y rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  GitHub profile URL
                </span>
                <input
                  type="url"
                  name="ownerGithubProfileURL"
                  value={form.ownerGithubProfileURL}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  LinkedIn profile URL
                </span>
                <input
                  type="url"
                  name="ownerLinkedinProfileURL"
                  value={form.ownerLinkedinProfileURL}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Email address
                </span>
                <input
                  type="email"
                  name="ownerEmailAddress"
                  value={form.ownerEmailAddress}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-7 p-6 sm:p-8">
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                About
              </h3>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-700">
                {profile.about || "Your introduction will appear here."}
              </p>
            </section>

            <section className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Contact & links
              </h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {profile.ownerEmailAddress && (
                  <a
                    href={`mailto:${profile.ownerEmailAddress}`}
                    className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-200 p-4 text-sm text-gray-700 transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    <span className="rounded-lg bg-blue-50 p-2 text-blue-600">
                      <Mail size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-medium text-gray-500">
                        Email
                      </span>
                      <span className="mt-0.5 block truncate font-medium">
                        {profile.ownerEmailAddress}
                      </span>
                    </span>
                  </a>
                )}

                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-200 p-4 text-sm text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                  >
                    <span className="rounded-lg bg-gray-100 p-2 text-gray-700">
                      <Github size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-medium text-gray-500">
                        GitHub
                      </span>
                      <span className="mt-0.5 block truncate font-medium">
                        {profile.ownerGithubProfileURL}
                      </span>
                    </span>
                    <ExternalLink size={15} className="shrink-0 text-gray-400" />
                  </a>
                )}

                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-200 p-4 text-sm text-gray-700 transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    <span className="rounded-lg bg-blue-50 p-2 text-blue-600">
                      <Linkedin size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-medium text-gray-500">
                        LinkedIn
                      </span>
                      <span className="mt-0.5 block truncate font-medium">
                        {profile.ownerLinkedinProfileURL}
                      </span>
                    </span>
                    <ExternalLink size={15} className="shrink-0 text-gray-400" />
                  </a>
                )}

                {!profile.ownerEmailAddress && !githubUrl && !linkedinUrl && (
                  <p className="text-sm text-gray-500 sm:col-span-2">
                    Add an email address or social profile to show your contact
                    links here.
                  </p>
                )}
              </div>
            </section>

            {!hasProfileDetails && (
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                <UserRound size={18} className="shrink-0 text-gray-400" />
                <span>
                  Your profile is ready to set up. Add your details to see them
                  displayed here.
                </span>
              </div>
            )}

          </div>
        )}
      </div>
    </section>
  );
}
