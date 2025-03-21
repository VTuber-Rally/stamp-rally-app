import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useToast } from "@/lib/hooks/useToast";
import { useUser } from "@/lib/hooks/useUser";

export const Route = createFileRoute(
  "/_rallyists/_withUserProviderNoAutoAnonymous/reward/contest/contact",
)({
  component: ContactPage,
  validateSearch: (search) => {
    return z
      .object({
        secret: z.string(),
      })
      .parse(search);
  },
});

function ContactPage() {
  const { t } = useTranslation();
  const { user, setName, setEmail } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { secret } = Route.useSearch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: { name: string; email: string }) => {
    if (!secret) {
      toast({
        title: t("contact.error"),
        description: t("contact.missingSecret"),
      });
      return;
    }

    try {
      await setName(data.name);
      await setEmail(data.email);

      // Redirection vers la page d'inscription
      navigate({
        to: "/reward/contest/entry",
        search: { secret },
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: t("contact.error"),
        description: t("contact.errorUpdatingProfile"),
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-center rounded-lg bg-blue-50 p-4 text-blue-600">
        <h1 className="text-2xl font-bold">{t("contest.contact.title")}</h1>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <p className="mb-4 text-gray-700">{t("contest.contact.description")}</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block font-medium">
              {t("contest.contact.nameLabel")}
            </label>
            <input
              id="name"
              type="text"
              className={`w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              {...register("name", {
                required: t("contest.contact.nameRequired") as string,
              })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="mb-2 block font-medium">
              {t("contest.contact.emailLabel")}
            </label>
            <input
              id="email"
              type="email"
              className={`w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              {...register("email", {
                required: t("contest.contact.emailRequired") as string,
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: t("contest.contact.emailInvalid") as string,
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
            {t("contest.contact.privacyNotice")}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-500 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                {t("contest.contact.submitting")}
              </span>
            ) : (
              t("contest.contact.submit")
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate({ to: "/reward/contest" })}
            disabled={isSubmitting}
            className="mt-3 w-full rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-300 disabled:opacity-50"
          >
            {t("contest.contact.cancel")}
          </button>
        </form>
      </div>
    </div>
  );
}
