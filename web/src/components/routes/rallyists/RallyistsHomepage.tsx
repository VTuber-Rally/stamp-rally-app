import type { SubmissionWithId } from "@vtube-stamp-rally/shared-lib/models/Submission.ts";

import Logo from "@/assets/logo.png";
import HomepageLaunchpad from "@/components/HomepageLaunchpad.tsx";
import Intro from "@/components/Intro.tsx";
import { Stamp } from "@/lib/stampStore.ts";

type RallyistsHomepageProps = {
  stamps?: Stamp[];
  submissions?: SubmissionWithId[];
};

const RallyistsHomepage = ({
  stamps = [],
  submissions = [],
}: RallyistsHomepageProps) => {
  const showIntro =
    stamps.length === 0 && (!submissions || submissions.length === 0);

  return (
    <div className={"flex flex-col items-center"}>
      <img src={Logo} alt="logo" className={"w-80"} />

      {showIntro && <Intro />}
      <div className={"mt-4 w-80"}>
        <HomepageLaunchpad />
      </div>
    </div>
  );
};

export default RallyistsHomepage;
