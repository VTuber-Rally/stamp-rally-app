import { captureException } from "@sentry/react";
import { Standist } from "@vtuber-stamp-rally/shared-lib/models/Standist.ts";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import Loader from "@/components/Loader.tsx";
import InputField from "@/components/inputs/InputField.tsx";
import { Header } from "@/components/layout/Header.tsx";
import { useStandist } from "@/lib/hooks/useStandist.ts";
import { useToast } from "@/lib/hooks/useToast.ts";
import { useUpdateStandistProfile } from "@/lib/hooks/useUpdateStandistProfile.ts";
import { useUser } from "@/lib/hooks/useUser.ts";

export type StandistsEditProfileForm = Pick<
  Standist,
  "description" | "twitch" | "twitter" | "instagram"
>;

const StandistsProfilePage = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { $id } = user || {};
  const artist = useStandist($id);

  const { mutate: updateProfile, isPending } = useUpdateStandistProfile();

  const methods = useForm<StandistsEditProfileForm>({
    defaultValues: {
      description: artist?.description,
      twitter: artist?.twitter,
      instagram: artist?.instagram,
      twitch: artist?.twitch,
    },
  });

  const { handleSubmit, register, formState } = methods;
  const { errors } = formState;

  const { toast } = useToast();

  if (!$id)
    return (
      <>
        <Header>{t("profile.title")}</Header>
        <div className={"flex flex-col items-center pt-12"}>
          <Loader size={4} />
          <p>{t("loading")}</p>
        </div>
      </>
    );

  if (!artist)
    return (
      <>
        <Header>{t("profile.title")}</Header>
        <p>{t("errors.notAStandist")}</p>
      </>
    );

  const onSubmit = (data: StandistsEditProfileForm) => {
    updateProfile(
      { ...data, userId: $id },
      {
        onSuccess: () => {
          toast({
            title: t("profile.profileUpdated"),
          });
        },
        onError: (error) => {
          console.error(error);
          captureException(error);
          toast({
            title: t("error"),
          });
        },
      },
    );
  };

  return (
    <>
      <Header>{t("profile.title")}</Header>
      <form className={"flex flex-col gap-4"} onSubmit={handleSubmit(onSubmit)}>
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
            placeholder={"@japexvtuberally"}
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
            placeholder={"japexvtubestamprally"}
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
            placeholder={"https://twitch.tv/sedeto"}
            required={false}
            register={register}
            errors={errors["twitch"]}
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
