import { FC, useEffect, useState } from "react";
import { TabsList, Button, Section } from "@telegram-apps/telegram-ui";
import "./StorePage.css";
import { TabsItem } from "@telegram-apps/telegram-ui/dist/components/Navigation/TabsList/components/TabsItem/TabsItem";
import {
  getUserClicks,
  storeUpgrade,
  updateUserClicks,
  getUpgrades,
} from "@/helpers/clicks.helpers";
import { useInitData, type User } from "@telegram-apps/sdk-react";

interface Upgrade {
  name: string;
  cost: number;
  passiveClicks: number;
}

const upgradeCategories: { [key: string]: Upgrade[] } = {
  Small: [
    { name: "Sample 1", cost: 100, passiveClicks: 1 },
    { name: "Sample 2", cost: 500, passiveClicks: 2 },
  ],
  Medium: [
    { name: "Sample 3", cost: 1000, passiveClicks: 10 },
    { name: "Sample 4", cost: 2000, passiveClicks: 20 },
  ],
  Large: [
    { name: "Sample 5", cost: 5000, passiveClicks: 50 },
    { name: "Sample 6", cost: 10000, passiveClicks: 100 },
  ],
};

export const StorePage: FC = () => {
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
  const [passiveClicks, setPassiveClicks] = useState(0);
  const [purchasedUpgrades, setPurchasedUpgrades] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState("Small");

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

    const fetchUpgrades = async () => {
      if (initData && initData.user) {
        console.log("Fetching upgrades for user:", initData.user.id);
        const upgrades = await getUpgrades(initData.user.id);
        console.log("Fetched upgrades:", upgrades);
        setPurchasedUpgrades(upgrades);
      }
    };

    getClicks();
    fetchUpgrades();

    initData && initData.user && console.log(initData.user);
  }, [initData]);

  useEffect(() => {
    console.log("Current purchasedUpgrades:", purchasedUpgrades);
  }, [purchasedUpgrades]);

  useEffect(() => {
    const fetchUpgrades = async () => {
      if (initData && initData.user) {
        console.log("Fetching upgrades for user:", initData.user.id);
        const upgrades = await getUpgrades(initData.user.id);
        console.log("Fetched upgrades:", upgrades);
        setPurchasedUpgrades(upgrades);
      }
    };

    fetchUpgrades();
  }, [initData]);
  useEffect(() => {
    console.log("Current purchasedUpgrades:", purchasedUpgrades);
  }, [purchasedUpgrades]);
  const buyUpgrade = async (upgrade: Upgrade) => {
    if (clicks >= upgrade.cost) {
      try {
        // Update clicks in the backend
        const updatedClicks = clicks - upgrade.cost;
        await updateUserClicks(user.id, updatedClicks);

        // Store the upgrade name in the backend
        console.log("Storing upgrade:", upgrade.name, "for user:", user.id);
        await storeUpgrade(user.id, upgrade.name);

        // Update local state
        setClicks(updatedClicks);
        setPassiveClicks((prev) => prev + upgrade.passiveClicks);
        setPurchasedUpgrades((prev) => [...prev, upgrade.name]);

        // Fetch upgrades again to ensure we have the latest data
        const latestUpgrades = await getUpgrades(user.id);
        console.log("Latest upgrades after purchase:", latestUpgrades);
        setPurchasedUpgrades(latestUpgrades);
      } catch (error) {
        console.error("Error buying upgrade:", error);
      }
    }
  };
  console.log(user.id, "1238712389172389");
  return (
    <div className='placeholder-page'>
      <Section header='Store'>
        <p>Stored Clicks: {clicks}</p>
        <p>Passive Clicks per Hour: {passiveClicks}</p>

        <TabsList>
          {Object.keys(upgradeCategories).map((category) => (
            <TabsItem
              key={category}
              onClick={() => setSelectedTab(category)}
              selected={selectedTab === category}
            >
              {category}
            </TabsItem>
          ))}
        </TabsList>

        <Section header={`${selectedTab} Upgrades`}>
          <ul className='upgrade-list'>
            {upgradeCategories[selectedTab].map((upgrade) => (
              <li key={upgrade.name} className='upgrade-item'>
                <span className='upgrade-info'>
                  {upgrade.name} - Cost: {upgrade.cost} - Passive Clicks:{" "}
                  {upgrade.passiveClicks}
                </span>
                <Button
                  onClick={() => buyUpgrade(upgrade)}
                  disabled={
                    clicks < upgrade.cost ||
                    purchasedUpgrades.includes(upgrade.name)
                  }
                  mode='filled'
                >
                  {purchasedUpgrades.includes(upgrade.name) ? "Owned" : "Buy"}
                </Button>
              </li>
            ))}
          </ul>
        </Section>

        <Section header='Purchased Upgrades'>
          <ul className='purchased-upgrades'>
            {purchasedUpgrades.map((upgradeName, index) => (
              <li key={index} className='purchased-upgrade-item'>
                {upgradeName}
              </li>
            ))}
          </ul>
        </Section>
      </Section>
    </div>
  );
};
