import { type FC, useEffect, useState } from "react";
import { useInitData, type User } from "@telegram-apps/sdk-react";
import { MdImageNotSupported } from "react-icons/md";
import {
  Banner,
  FixedLayout,
  Image,
  Section,
} from "@telegram-apps/telegram-ui";
import { getUserClicks, updateUserClicks } from "@/helpers/clicks.helpers";

import "./PlayPage.css";

const threshold = 10;
const interval = 10000;

export const PlayPage: FC = () => {
  const initData = useInitData();
  const [user, setUser] = useState<User>({
    allowsWriteToPm: false,
    firstName: "",
    id: 0,
    languageCode: "",
    lastName: "",
    username: "",
    photoUrl: "",
  });
  const [clicks, setClicks] = useState(0);
  const [stamina, setStamina] = useState(1000);
  const [boost, setBoost] = useState(1);
  const [comboMultiplier, setComboMultiplier] = useState(1);

  useEffect(() => {
    const getUser = () => {
      return initData && initData.user ? setUser(initData.user) : {};
    };
    getUser();

    const getClicks = async () => {
      if (initData && initData.user) {
        const data = await getUserClicks(initData.user.id);
        setClicks(data.clicks);
      }
    };

    getClicks();

    initData && initData.user && console.log(initData.user);
  }, [initData]);

  useEffect(() => {
    const saveClicks = async () => {
      await updateUserClicks(user.id, clicks);
    };
    if (clicks % threshold === 0) {
      saveClicks();
    }
    const intervalId = setInterval(() => {
      if (clicks > 0) {
        saveClicks();
      }
    }, interval);

    const handleVisibilityChange = () => {
      console.log(document.visibilityState);

      if (document.visibilityState === "hidden") {
        saveClicks();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const handleBeforeUnload = () => {
      saveClicks();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [clicks]);

  useEffect(() => {
    // Update combo multiplier based on the number of clicks
    setComboMultiplier(1 + Math.floor(clicks / 100) * 0.1);
  }, [clicks]);

  const handleButtonClick = () => {
    if (stamina > 0) {
      setClicks((prev) => prev + boost * 600);
      setStamina((prev) => prev - 1);
    }
  };

  const handleBoostClick = () => {
    setBoost(boost === 1 ? 1.1 : 1);
  };

  return (
    <>
      <FixedLayout vertical='top'>
        <Banner
          before={
            <Image
              fallbackIcon={<MdImageNotSupported color='white' />}
              src={
                user.photoUrl
                  ? user.photoUrl
                  : "https://avatars.githubusercontent.com/u/84640980?v=4"
              }
              size={48}
            />
          }
          header={`${user.firstName} ${user.lastName}`}
          subheader={`@${user.username}`}
          description={`ID: ${user.id}`}
          type='section'
        />
      </FixedLayout>

      <Section
        header={`Score: ${clicks}`}
        style={{ padding: 10, marginTop: 150 }}
      >
        <div className='game-container'>
          <div className='combo-display'>
            Combo Multiplier: {comboMultiplier.toFixed(1)}x
          </div>
          <button onClick={handleButtonClick} className='click-button'>
            click
          </button>
          <div className='stamina-display'>Stamina: {stamina}/1000</div>
          <button onClick={handleBoostClick} className='boost-button'>
            Boost {boost === 1 ? "" : "Activated"}
          </button>
        </div>
      </Section>
    </>
  );
};
