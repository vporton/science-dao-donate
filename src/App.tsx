import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { Web3Button, Web3Modal } from "@web3modal/react";
import { configureChains, createClient, useAccount, useBalance, useConnect, useNetwork, useSigner, WagmiConfig } from "wagmi";
import { gnosis } from "@wagmi/chains";
import { useEffect, useState } from 'react';
import { donationsAddress, donationsChainIdHex, donationsCurrencyBlockExplorerUrls, donationsCurrencyDecimals, donationsCurrencyName, donationsCurrencyRpcUrls, donationsCurrencySymbol, donationsNetwork, donationsNetworkName, donationsSwap, rampApiKey, walletConnectProjectId } from './config';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';
import './App.css';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { formatEther, parseEther } from "ethers/lib/utils.js";
import { BigNumber } from "ethers";

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
  const {data: signer} = useSigner();
  const [open, setOpen] = useState(false);
  const { address } = useAccount();
  const { data: balanceData } = useBalance({ address }); // TODO: `useEffect`?
  const { chain } = useNetwork();
  function correctChain() { // duplicate code
    return chain?.network === donationsNetworkName;
  }
  const handleClickOpen = () => {
    wagmiClient.provider.getGasPrice().then(gasPrice => {
      const gasAmount = BigNumber.from(21000).mul(gasPrice).mul(BigNumber.from(130)).div(BigNumber.from(100)); // +30%
      console.log('gasAmount:', formatEther(gasAmount));
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
      nonce: wagmiClient.provider.getTransactionCount(address as string, "latest"), // FIXME: if `address === null`?
      // gasLimit: ethers.utils.hexlify(gas_limit), // 100000
      // gasPrice: gas_price,
    };
    signer?.sendTransaction(tx).then(() => { // FIXME: If `signer` is null or undefined?
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
        variant='contained'
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
            onChange={event => setAmount(isInputAmountValid(event?.target.value) ? parseEther(event?.target.value) : undefined)}
          />
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDonate} disabled={balanceData?.value === undefined || !correctChain()}>Donate</Button> {/* See TODO above. */}
        </DialogActions>
      </Dialog>
    </span>
  );
}

async function setDonationsChain() {
  try {
    await window.ethereum?.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: donationsChainIdHex }],
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum?.request({
          method: 'wallet_addEthereumChain',
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
  useEffect(() => {
    async function initCardAppDonation() {
      rampContainer().replaceChildren("");
      const logo = `${document.location.protocol}//${document.location.host}${document.location.pathname}logo.svg`;
      new RampInstantSDK({
        hostAppName: 'World Science DAO Donation',
        hostLogoUrl: logo,
        swapAsset: donationsSwap,
        userAddress: address,
        hostApiKey: rampApiKey,
        variant: window.innerWidth >= 895 ? 'embedded-desktop' : 'embedded-mobile',
        containerNode: rampContainer(),
      }).show();
    }
    initCardAppDonation().then(() => {}); // FIXME: called two times
  }, [address]);
  function rampContainer() {
    return document.getElementById('rampContainer') as HTMLElement;
  }
  function correctChain() { // duplicate code
    return chain?.network === donationsNetworkName;
  }
  return (
    <>
      <div className="mainWidget">
        <p>Connected wallet: <span style={{display: 'inline-block', verticalAlign: 'middle'}}><Web3Button /></span></p>
        <p>Funds on your wallet: {balanceData?.formatted} {balanceData?.symbol}</p>
        <h1>World Science DAO accepts donations</h1>
        {correctChain() ? "" : <p><span className="danger">Wrong chain selected, should be {donationsNetwork} chain.</span></p>}
        <p>To donate send xDai or any ERC-20 token to <code className="cryptoAddress">{donationsAddress}</code> {' '}
        on <span className="cryptoAddress">Gnosis</span> (formerly called <span className="cryptoAddress">Dai</span>) chain.</p>
        <p><strong className="danger">Funds sent to this address on any other chain, including main Ethereum chain, will be irreversibly lost!</strong></p>
        <p>To send xDai to correct chain and correct address you can use <span style={{display: 'inline-block'}}><DonateCryptoButton/></span> button.</p>
        <p style={{textAlign: 'left'}}>Before donating xDai, you may need to buy xDai. First create an Ethereum account by clicking {' '}
          <q>Connect wallet</q> above and choosing any of offered wallets.
          There are <a href="https://www.coinbase.com/how-to-buy/xdaistable" target='_blank' rel="noreferrer">several ways to buy xDai</a> {' '}
          to your Ethereum account:</p>
        <ul>
          <li>(Beginners' option) <a href="#rampContainer">Buy xDai by <strong>credit card</strong> or SEPA, etc.</a></li>
          <li>(Requires some knowledge of crypto) You can first <a href="https://coinmarketcap.com/currencies/wxdai/markets/" target="markets">purchase wxDai</a> {' '}
            and then <a href="https://app.openocean.finance/CLASSIC#/XDAI/WXDAI/XDAI" target="markets">swap it for xDai</a>.</li>
          <li>(Requires expertise in using crypto exchanges) You can first {' '}
            <a href="https://www.google.com/search?q=how+to+purchase+USDT" target="_blank" rel="noreferrer">buy USDT</a> and then use {' '}
            <a href="https://ascendex.com/en/cashtrade-spottrading/usdt/xdai" target="markets">AscendEX to exchange it for xDai.</a></li>
        </ul>
        { address !== undefined ? (
          <p><em>Because you connected your crypto wallet, purchased xDai will go to that account, you don't need to enter a crypto address
            while purchasing. Don't forget to donate after purchasing.</em></p>
        ) : "" }
      </div>
      <div id="rampContainer" style={{height: "667px"}}></div> {/* minimum height on mobile */}
      <div className="mainWidget">
        <p><a href="https://science-dao.vporton.name" target="_top">Return to World Science DAO.</a></p>
        <p><a href="https://github.com/vporton/science-dao-donate" target='_blank' rel="noreferrer">
          <img src="github-mark.svg" width="16" height="16" alt="GitHub"/></a>
        </p>
      </div>
    </>
  );
}

function App() {
  useEffect(() => {
    document.title = 'Donations - World Science DAO';
  }, []);
  return (
    <div className="App">
      <WagmiConfig client={wagmiClient}>
        <AppMainPart/>
      </WagmiConfig>
      <Web3Modal
        projectId={walletConnectProjectId}
        ethereumClient={ethereumClient}
      />
    </div>
  );
}

export default App;
