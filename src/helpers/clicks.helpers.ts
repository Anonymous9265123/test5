export const updateUserClicks = async (userID: number, clicks: number) => {
  try {
    const response = await fetch("http://localhost:3000/api/clicks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID, clicks }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Something went wrong");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user clicks:", error);
    throw error;
  }
};

export const getUserClicks = async (userID: number) => {
  const response = await fetch(
    `http://localhost:3000/api/clicks?userID=${userID}`
  );
  const data = await response.json();

  return data;
};

export const storeUpgrade = async (userID: number, upgradeName: string) => {
  try {
    const response = await fetch("http://localhost:3000/api/upgrades", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID, upgradeName }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Something went wrong");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error storing upgrade:", error);
    throw error;
  }
};

export const getUpgrades = async (userID: number) => {
  try {
    console.log(`Fetching upgrades for userID: ${userID}`);
    const response = await fetch(
      `http://localhost:3000/api/upgrades?userID=${userID}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch upgrades");
    }

    const upgrades = await response.json();
    console.log("Raw upgrades data:", upgrades);
    return upgrades.map((upgrade: any) => upgrade.upgradeName || upgrade.name);
  } catch (error) {
    console.error("Error fetching upgrades:", error);
    return [];
  }
};

export const getFriends = async (userID: number) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/friends?userID=${userID}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch friends");
    }

    const data = await response.json();
    return data.friends; // Return the friends array
  } catch (error) {
    console.error("Error fetching friends:", error);
    throw error;
  }
};

// Helper function to add a friend
export const addFriend = async (userID: number, friendID: number) => {
  try {
    const response = await fetch("http://localhost:3000/api/friends/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID, friendID }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add friend");
    }

    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error("Error adding friend:", error);
    throw error;
  }
};
