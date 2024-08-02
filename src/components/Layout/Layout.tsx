import { useThemeParams } from "@telegram-apps/sdk-react";
import { Tabbar } from "@telegram-apps/telegram-ui";
import { useState, type FC } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  FaGamepad,
  FaUser,
  FaWallet,
  FaStore,
  FaUserFriends,
} from "react-icons/fa";

const tabs = [
  { id: "/", text: "Home", Icon: FaWallet },
  { id: "/Play", text: "Play", Icon: FaGamepad },
  { id: "/init-data", text: "Profile", Icon: FaUser },
  { id: "/store", text: "Store", Icon: FaStore },
  { id: "/invite", text: "Invite", Icon: FaUserFriends },
  // { id: "/theme-params", text: "Theme", Icon: FaPaintRoller },
];

export const Layout: FC = () => {
  const [currentTab, setCurrentTab] = useState(tabs[0].id);
  const navigate = useNavigate();
  const themeParams = useThemeParams();
  const { bgColor } = themeParams.getState();

  return (
    <>
      <Outlet />
      <Tabbar style={{ backgroundColor: bgColor }}>
        {tabs.map(({ id, Icon }) => (
          <Tabbar.Item
            key={id}
            selected={id === currentTab}
            onClick={() => {
              setCurrentTab(id);
              navigate(id);
            }}
          >
            <Icon
              style={{
                fontSize: 22,
                paddingTop: 4,
                paddingBottom: 4,
              }}
            />
          </Tabbar.Item>
        ))}
      </Tabbar>
    </>
  );
};
