import { type FC, useEffect, useState } from "react";
import { useInitData, type User } from "@telegram-apps/sdk-react";
import { MdImageNotSupported } from "react-icons/md";
import {
  Banner,
  FixedLayout,
  Image,
  Section,
  Button,
  Input,
} from "@telegram-apps/telegram-ui";
import { getFriends, addFriend } from "@/helpers/clicks.helpers";
import "./InvitePage.css";

export const InvitePage: FC = () => {
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
  const [invitationCode, setInvitationCode] = useState("");
  const [totalFriends, setTotalFriends] = useState(0);

  useEffect(() => {
    const getUser = () => {
      if (initData && initData.user) {
        setUser(initData.user);
        fetchFriends(initData.user.id);
      }
    };
    getUser();
  }, [initData]);

  const fetchFriends = async (userID: number) => {
    try {
      const friends = await getFriends(userID);
      console.log("Fetched friends:", friends); // Debugging log
      setTotalFriends(friends.length);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const handleInvite = async () => {
    if (user.id && invitationCode) {
      try {
        // Add logic to process invitation code and update friends
        // For now, we will just add a friend with a dummy ID for demonstration
        await addFriend(user.id, parseInt(invitationCode));
        fetchFriends(user.id); // Update total friends after adding
        setInvitationCode("");
      } catch (error) {
        console.error("Error adding friend:", error);
      }
    }
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
        header={`Invite Friends and Earn Clicks`}
        style={{ padding: 10, marginTop: 150 }}
      >
        <div className='invite-container'>
          <Input
            value={invitationCode}
            onChange={(e) => setInvitationCode(e.target.value)}
            placeholder="Enter friend's ID or invite code"
            style={{ marginBottom: 10 }}
          />
          <Button onClick={handleInvite}>Send Invite</Button>
          <div className='earned-clicks'>Total Friends: {totalFriends}</div>
        </div>
      </Section>
    </>
  );
};
