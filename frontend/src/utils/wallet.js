export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      return accounts[0];
    } catch (error) {
      console.error("User rejected wallet connection:", error);
      return null;
    }
  } else {
    alert("Please install MetaMask to use this feature.");
    return null;
  }
};
