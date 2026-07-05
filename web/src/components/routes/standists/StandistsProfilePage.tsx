import { captureException } from "@sentry/react";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import Loader from "@/components/Loader.tsx";
import InputField from "@/components/inputs/InputField.tsx";
import { Header } from "@/components/layout/Header.tsx";
import { useCurrentUser } from "@/lib/auth.ts";
import { convexPublicApi, useDLEMutation } from "@/lib/convex.ts";
import { useBooth } from "@/lib/hooks/useBooth.ts";
import { useToast } from "@/lib/hooks/useToast.ts";

export type StandistsEditProfileForm = {
  name: string;
  description: string;
  twitter?: string;
  instagram?: string;
  twitch?: string;
  website?: string;
};

const StandistsProfilePage = () => {
  const { t } = useTranslation();
  const user = useCurrentUser();
  const booth = useBooth(user?.boothId);

  const updateBoothProfile = useMutation(
    convexPublicApi.booths.updateBoothProfile,
  );
  const { mutate: updateProfile, isLoading: isPending } =
    useDLEMutation(updateBoothProfile);

  const methods = useForm<StandistsEditProfileForm>({
    defaultValues: {
      name: booth?.name,
      description: booth?.description,
      twitter: booth?.links.twitter,
      instagram: booth?.links.instagram,
      twitch: booth?.links.twitch,
      website: booth?.links.website,
    },
  });

  const { handleSubmit, register, formState } = methods;
  const { errors } = formState;

  const { toast } = useToast();

  if (!user)
    return (
      <>
        <Header>{t("profile.title")}</Header>
        <div className={"flex flex-col items-center pt-12"}>
          <Loader size={4} />
          <p>{t("loading")}</p>
        </div>
      </>
    );

  if (!booth)
    return (
      <>
        <Header>{t("profile.title")}</Header>
        <p>{t("errors.notAStandist")}</p>
      </>
    );

  const onSubmit = (data: StandistsEditProfileForm) => {
    const { name, description, twitter, instagram, twitch, website } = data;
    updateProfile({
      name,
      description,
      links: { twitter, instagram, twitch, website },
    }).then(
      () => {
        toast({ title: t("profile.profileUpdated") });
      },
      (error) => {
        console.error(error);
        captureException(error);
        toast({ title: t("error") });
      },
    );
  };

  return (
    <>
      <Header>{t("profile.title")}</Header>
      <form className={"flex flex-col gap-4"} onSubmit={handleSubmit(onSubmit)}>
        <div className={"flex flex-col"}>
          <label htmlFor={"name"}>{t("standName")}</label>
          <InputField
            type={"text"}
            name={"name"}
            placeholder={"Stand"}
            required={true}
            register={register}
            errors={errors["name"]}
          />
        </div>
        <div className={"flex flex-col"}>
          <label htmlFor={"description"}>{t("description")}</label>
          <InputField
            inputType={"textarea"}
            type={"text"}
            name={"description"}
            placeholder={"Description"}
            register={register}
            errors={errors["description"]}
            className={"h-32"}
          />
        </div>

        <hr />
        <div>
          <h2 className={"text-2xl"}>{t("profile.socialNetworks.label")}</h2>
          <p className={"text-sm"}>{t("profile.socialNetworks.subtext")}</p>
        </div>

        <div className={"flex flex-col"}>
          <label htmlFor={"twitter"}>{t("twitter")}</label>
          <InputField
            type={"text"}
            name={"twitter"}
            placeholder={"SuperArts_twt"}
            required={false}
            register={register}
            errors={errors["twitter"]}
          />
        </div>

        <div className={"flex flex-col"}>
          <label htmlFor={"instagram"}>{t("instagram")}</label>
          <InputField
            type={"text"}
            name={"instagram"}
            placeholder={"SuperArts"}
            required={false}
            register={register}
            errors={errors["instagram"]}
          />
        </div>

        <div className={"flex flex-col"}>
          <label htmlFor={"twitch"}>{t("twitch")}</label>
          <InputField
            type={"text"}
            name={"twitch"}
            placeholder={"MyTwitchChannel"}
            required={false}
            register={register}
            errors={errors["twitch"]}
          />
        </div>

        <div className={"flex flex-col"}>
          <label htmlFor={"website"}>{t("Website")}</label>
          <InputField
            type={"url"}
            name={"website"}
            placeholder={"https://stand.com"}
            required={false}
            register={register}
            errors={errors["website"]}
          />
        </div>

        {isPending ? (
          <button
            disabled={true}
            className="mt-2 flex h-10 w-full cursor-wait items-center justify-center rounded-2xl bg-secondary/90 px-2 text-center text-xl font-bold text-black"
          >
            <div className={"flex items-center"}>
              <Loader size={1.5} className={"mr-2"} />
              {t("loading")}
            </div>
          </button>
        ) : (
          <button
            type="submit"
            className="mt-2 flex h-10 w-full cursor-pointer items-center justify-center rounded-2xl bg-secondary px-2 text-center text-xl font-bold text-black hover:bg-secondary-light"
          >
            {t("save")}
          </button>
        )}
      </form>
    </>
  );
};

export default StandistsProfilePage;
