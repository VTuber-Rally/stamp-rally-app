import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Header } from "@/components/Header.tsx";
import InputField from "@/components/InputField.tsx";
import Loader from "@/components/Loader.tsx";
import { useStandist } from "@/lib/hooks/useStandist.ts";
import { useToast } from "@/lib/hooks/useToast.ts";
import { useUpdateStandistProfile } from "@/lib/hooks/useUpdateStandistProfile.ts";
import { useUser } from "@/lib/hooks/useUser.ts";
import { Standist } from "@/lib/models/Standist.ts";

export type StandistsEditProfileForm = Pick<
  Standist,
  "description" | "twitch" | "twitter" | "instagram"
>;

const StandistsProfilePage = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { $id } = user || {};
  const artist = useStandist($id);

  const { mutate, isPending } = useUpdateStandistProfile();

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

  const onSubmit = async (data: StandistsEditProfileForm) => {
    try {
      mutate({ ...data, userId: $id });
      toast({
        title: t("profile.profileUpdated"),
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t("error"),
      });
    }
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
            className="text-center bg-secondary/90 text-black px-2 w-full flex justify-center items-center rounded-2xl font-bold h-10 text-xl mt-2 cursor-wait"
          >
            <div className={"flex items-center"}>
              <Loader size={1.5} className={"mr-2"} />
              {t("loading")}
            </div>
          </button>
        ) : (
          <button
            type="submit"
            className="text-center bg-secondary text-black px-2 w-full flex justify-center items-center rounded-2xl font-bold h-10 text-xl mt-2 hover:bg-secondary-light cursor-pointer"
          >
            {t("save")}
          </button>
        )}
      </form>
    </>
  );
};

export default StandistsProfilePage;
