import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { Web3Button, Web3Modal } from "@web3modal/react";
import {
  configureChains,
  createClient,
  useAccount,
  useBalance,
  useConnect,
  useNetwork,
  useSigner,
  WagmiConfig,
} from "wagmi";
import { gnosis } from "@wagmi/chains";
import { useEffect, useState } from "react";
import {
  donationsAddress,
  donationsChainIdHex,
  donationsCurrencyBlockExplorerUrls,
  donationsCurrencyDecimals,
  donationsCurrencyName,
  donationsCurrencyRpcUrls,
  donationsCurrencySymbol,
  donationsNetwork,
  donationsNetworkName,
  donationsSwap,
  rampApiKey,
  walletConnectProjectId,
} from "./config";
import { RampInstantSDK } from "@ramp-network/ramp-instant-sdk";
import "./App.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { formatEther, parseEther } from "ethers/lib/utils.js";
import { BigNumber } from "ethers";
import DonorBox from "./DonorBox";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import About from "./components/About";
import ModalBox from "./components/ModalBox";
import Overlay from "./components/Overlay";
import payment from "./assets/payment.jpg";

const chains = [gnosis]; // TODO: Make configurable

// (async () => setDonationsChain())(); // TODO: It's a hack to call it here.

// Wagmi client
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: walletConnectProjectId }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: "web3Modal", chains }),
  provider,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);

function DonateCryptoButton() {
  const { data: signer } = useSigner();
  const [open, setOpen] = useState(false);
  const { address } = useAccount();
  const { data: balanceData } = useBalance({ address }); // TODO: `useEffect`?
  const { chain } = useNetwork();
  function correctChain() {
    // duplicate code
    return chain?.network === donationsNetworkName;
  }
  const handleClickOpen = () => {
    // FIXME: getGasPrice() is sometimes slow, user may click the button several times and open several dialogs.
    wagmiClient.provider.getGasPrice().then((gasPrice) => {
      const gasAmount = BigNumber.from(21000)
        .mul(gasPrice)
        .mul(BigNumber.from(130))
        .div(BigNumber.from(100)); // +30%
      console.log("gasAmount:", formatEther(gasAmount));
      setAmount(balanceData?.value.sub(gasAmount));
      setOpen(true);
    });
  };
  // TODO: In an unknown reason after I connect to provider, `amount` remains `undefined` despite of correct value of `balanceMinusGas()`.
  // const [amount, setAmount] = useState(balanceMinusGas()); // FIXME
  const [amount, setAmount] = useState(undefined as BigNumber | undefined);
  function amountFormatted() {
    return amount !== undefined ? formatEther(amount as BigNumber) : undefined;
  }
  function isInputAmountValid(amount: string) {
    return /\d+\.(\d+)?/.test(amount);
  }
  function donate(amount: BigNumber) {
    const tx = {
      from: address,
      to: donationsAddress,
      value: amount,
      nonce: wagmiClient.provider.getTransactionCount(
        address as string,
        "latest"
      ), // FIXME: if `address === null`?
      // gasLimit: ethers.utils.hexlify(gas_limit), // 100000
      // gasPrice: gas_price,
    };
    signer?.sendTransaction(tx).then(() => {
      // FIXME: If `signer` is null or undefined?
      alert("Thank you for the donation!"); // TODO
    });
  }
  const handleClose = () => {
    setOpen(false);
  };
  const handleDonate = () => {
    setOpen(false);
    donate(amount as BigNumber);
  };
  return (
    <span>
      <Button
        onClick={handleClickOpen}
        variant="contained"
        disabled={address === undefined || !correctChain()}
      >
        donate
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Donate</DialogTitle>
        <DialogContent>
          <>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={`Amount (${balanceData?.symbol})`}
              type="number"
              fullWidth
              variant="standard"
              // defaultValue={balanceMinusGasFormatted()}
              value={amountFormatted()}
              onChange={(event) =>
                setAmount(
                  isInputAmountValid(event?.target.value)
                    ? parseEther(event?.target.value)
                    : undefined
                )
              }
            />
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleDonate}
            disabled={balanceData?.value === undefined || !correctChain()}
          >
            Donate
          </Button>{" "}
          {/* See TODO above. */}
        </DialogActions>
      </Dialog>
    </span>
  );
}

async function setDonationsChain() {
  try {
    await window.ethereum?.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: donationsChainIdHex }],
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum?.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: donationsChainIdHex,
              chainName: donationsNetwork,
              nativeCurrency: {
                name: donationsCurrencyName,
                symbol: donationsCurrencySymbol,
                decimals: donationsCurrencyDecimals,
              },
              rpcUrls: donationsCurrencyRpcUrls,
              blockExplorerUrls: donationsCurrencyBlockExplorerUrls,
              iconUrls: undefined,
            },
          ],
        });
      } catch (addError: any) {
        // handle "add" error
        return;
      }
    }
    // handle other "switch" errors
    return;
  }
  // It does not work when MetaMask isn't installed:
  // connect({
  //   connector: new InjectedConnector(),
  //   chainId: donationsChainId,
  // });
}

function AppMainPart() {
  // setDonationsChain().then(() => {});
  const { address } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const { isSuccess: successfullyConnected } = useConnect();
  const { chain } = useNetwork();

  useEffect(() => {
    if (successfullyConnected) {
      setDonationsChain();
    }
  }, [successfullyConnected]);
  async function initCardAppDonation() {
    const logo = `${document.location.protocol}//${document.location.host}${document.location.pathname}logo.svg`;
    new RampInstantSDK({
      hostAppName: "World Science DAO Donation",
      hostLogoUrl: logo,
      swapAsset: donationsSwap,
      userAddress: address,
      hostApiKey: rampApiKey,
      variant: "auto",
    }).show();
  }
  function correctChain() {
    // duplicate code
    return chain?.network === donationsNetworkName;
  }

  const [isOpen, setIsopen] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("");

  const handleModal = () => {
    setIsopen(!isOpen);
  };

  const onChange = (e: any) => {
    setAmount(e.target.value);
  };

  const handleSelect = (e: any) => {
    setCurrency(e.target.value);
    console.log(currency);
  };

  return (
    <div className="relative bg-white">
      {isOpen ? (
        <>
          <Overlay handleModal={handleModal} />
          <ModalBox amount={amount} />
        </>
      ) : null}
      <Navbar amount={amount} handleModal={handleModal} onChange={onChange} />
      <Hero handleModal={handleModal} />

      {/* <div className="container absolute -left-[50%] -translate-x-[50%] -top-[50%] "><DonorBox /></div> */}

      <div
        className="bg-no-repeat bg-cover py-8 md:py-16 "
        style={{
          backgroundImage: `url('https://science-dao.org/wp-content/uploads/sites/10/2021/01/cts-slider.jpg')`,
          background: "white",
        }}
        id="top"
      >
        <div className="w-[90%] md:w-[80%] mx-auto flex flex-col text-center md:flex-row md:justify-center items-center md:items-start ">
          <div className="md:w-[50%] md:ml-32">
            {/* <DonorBox /> */}

            <h4 className="text-2xl md:text-4xl text-black font-black md:mb-4 mt-6">
              DONATE WITH YOUR CREDITCARD HERE
            </h4>

            <div className="flex items-center space-x-4 md:mb-4  mt-4 justify-center">
              {/* <div className="bg-white flex justify-between items-center px-8 rounded-lg shadow-lg border">
                <select
                  className="py-4 w-full outline-none"
                  value={currency}
                  onChange={handleSelect}
                >
                  <option value="USD">US Dollars (USD)</option>
                  <option value="EUR">Euros (EUR)</option>
                </select>
              </div> */}

              <div className="bg-white flex justify-between items-center px-8 py- rounded-lg shadow-lg border md:mt-0">
                <input
                  name="amount"
                  value={amount}
                  className="bg-transparent w-[95%] outline-none py-4"
                  type="number"
                  placeholder="Enter your amount..."
                  onChange={onChange}
                />
                <div className="bg-transparent border w-max rounded-lg p-2">
                  $$
                </div>
              </div>

              <button
                onClick={handleModal}
                className="h-11 w-40 bg-red-700  text-white  font-montserrat font-medium  rounded transform scale-100 hover:scale-110 transition ease-out duration-700  lg:mr-6 mb-10 md:mb-6 lg:mb-0"
              >
                Donate Now
              </button>
            </div>

            <img
              className="w-36 md:w-80 mb-8 m-auto md:mt-8"
              src={payment}
              alt="payment"
            />
          </div>

          <div className="container pb-8 text-center md:text-left space-y-4 text-black md:text-[16px] -mt-20 md:mt-0">
            <div>
              <h4 className="text-2xl md:text-4xl text-black font-black mb-4">
                OR DONATE BY CRYPTO{" "}
              </h4>
              <p className="font-bold text-black text-left text-xl mb-4">
                Funds on your wallet: {balanceData?.formatted}{" "}
                {balanceData?.symbol}
              </p>
              <div>
                <Web3Button />
              </div>
            </div>
            {correctChain() || !chain ? (
              ""
            ) : (
              <p>
                <span className="danger text-black mt-4">
                  Wrong chain selected, should be {donationsNetwork} chain.
                </span>
              </p>
            )}

            <div className="flex items-start space-x-1 text-left">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-black ">
                To donate send xDai or any ERC-20 token to{" "}
                <span className="text-xs font-bold md:text-base">
                  {donationsAddress}
                </span>{" "}
                on <span className="">Gnosis</span> (formerly called{" "}
                <span className="">Dai</span>) chain.
              </p>
            </div>

            <div className="flex items-center space-x-1 text-left">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <p className="">
                <strong className="danger">
                  Funds sent to this address on any other chain, including main
                  Ethereum chain, will be irreversibly lost!
                </strong>
              </p>
            </div>

            <div className="flex items-center space-x-1 text-left">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <p className="mt-4 text-black">
                To send xDai to the correct chain and the correct address you
                can use{" "}
                <span style={{ display: "inline-block", margin: "12px 0" }}>
                  <DonateCryptoButton />
                </span>{" "}
                button (after you buy xDai).
              </p>
            </div>

            <p className="mt-8 text-black font-medium">
              Before donating xDai, you may need to buy xDai. First create an
              Ethereum account by clicking <q>Connect wallet</q> above and
              choosing any of offered wallets. There are{" "}
              <a
                href="https://www.coinbase.com/how-to-buy/xdaistable"
                target="_blank"
                rel="noreferrer"
              >
                several ways to buy xDai
              </a>{" "}
              to your Ethereum account:
            </p>

            <ul className=" font-medium">
              <li className="text-black">
                (Beginners' option){" "}
                <Button variant="contained" onClick={initCardAppDonation}>
                  {" "}
                  Buy xDai by credit card or SEPA, etc.
                </Button>
                {address !== undefined ? (
                  <>
                    {" "}
                    <em>
                      Because you connected your crypto wallet, purchased xDai
                      will go to that account, you don't need to enter a crypto
                      address while purchasing. Don't forget to donate after
                      purchasing.
                    </em>
                  </>
                ) : (
                  ""
                )}
              </li>
              <li className="text-black">
                (Requires some knowledge of crypto) You can first{" "}
                <a
                  href="https://coinmarketcap.com/currencies/wxdai/markets/"
                  target="markets"
                >
                  purchase wxDai
                </a>{" "}
                and then{" "}
                <a
                  href="https://app.openocean.finance/CLASSIC#/XDAI/WXDAI/XDAI"
                  target="markets"
                >
                  swap it for xDai
                </a>
                .
              </li>
              <li className="text-black">
                (Requires expertise in using crypto exchanges) You can first{" "}
                <a
                  href="https://www.google.com/search?q=how+to+purchase+USDT"
                  target="_blank"
                  rel="noreferrer"
                >
                  buy USDT
                </a>{" "}
                and then use{" "}
                <a
                  href="https://ascendex.com/en/cashtrade-spottrading/usdt/xdai"
                  target="markets"
                >
                  AscendEX to exchange it for xDai.
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <About />
      <Footer />
    </div>
  );
}

function App() {
  useEffect(() => {
    document.title = "Donations - World Science DAO";
  }, []);
  return (
    <div className="App">
      <WagmiConfig client={wagmiClient}>
        <AppMainPart />
      </WagmiConfig>
      <Web3Modal
        projectId={walletConnectProjectId}
        ethereumClient={ethereumClient}
      />
    </div>
  );
}

export default App;
