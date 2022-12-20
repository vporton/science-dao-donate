import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { Web3Button, Web3Modal } from "@web3modal/react";
import { configureChains, createClient, useAccount, useBalance, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, polygon } from "wagmi/chains";

import { useEffect, useState } from 'react';
import { donationsAddress, donationsNetwork, rampApiKey, walletConnectProjectId } from './config';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';
import './App.css';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { formatEther, parseEther } from "ethers/lib/utils.js";
import { BigNumber } from "ethers";

const chains = [arbitrum, mainnet, polygon]; // FIXME

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
  const [open, setOpen] = useState(false);
  const { address } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const [amount, setAmount] = useState(balanceData?.value)
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  function balanceMinusGas() {
    return balanceData?.value.sub(21000); // for simple transfers, we assume contract has no hook here
  }
  function balanceMinusGasFormatted() {
    const balance = balanceMinusGas();
    return balance !== undefined ? formatEther(balance as BigNumber) : undefined;
  }
  function isInputAmountValid(amount: string) {
    return /\d+\.(\d+)?/.test(amount);
  }
  return (
    <span>
      <Button
        onClick={handleClickOpen}
        variant='contained'
        disabled={address === undefined}
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
            defaultValue={balanceMinusGasFormatted()}
            onChange={event => setAmount(isInputAmountValid(event?.target.value) ? parseEther(event?.target.value) : undefined)}
          />
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose} disabled={amount === undefined}>Donate</Button>
        </DialogActions>
      </Dialog>
    </span>
  );

}

async function initCardAppDonation() {
  const logo = `${document.location.protocol}//${document.location.host}${document.location.pathname}logo.svg`;
  new RampInstantSDK({
    hostAppName: 'World Science DAO Donation',
    hostLogoUrl: logo,
    swapAsset: donationsNetwork,
    userAddress: donationsAddress,
    hostApiKey: rampApiKey,
  }).show();
}

function AppMainPart() {
  const { address } = useAccount();
  const { data: balanceData } = useBalance({ address });
  return (
    <>
      <p>Connected wallet: <span style={{display: 'inline-block', verticalAlign: 'middle'}}><Web3Button /></span></p>
      <p>Funds on your wallet: {balanceData?.formatted} {balanceData?.symbol}</p>
      <h1>World Science DAO accepts donations</h1>
      <p><strong className="danger">WRONG CHAIN</strong></p>
      <p><strong>Donate by crypto or credit card.</strong></p>
      <p>To <span style={{display: 'inline-block'}}><DonateCryptoButton/></span> send xDai or any ERC-20 token to <code className="cryptoAddress">{donationsAddress}</code> {' '}
      on <span className="cryptoAddress">Gnosis</span> (formerly called <span className="cryptoAddress">Dai</span>) chain.</p>
      <p><strong className="danger">Funds sent to this address on any other chain, including main Ethereum chain, will be irreversibly lost!</strong></p>
      <p>You can first <a href="https://coinmarketcap.com/currencies/wxdai/markets/" target="markets">purchase wxDai</a> {' '}
        and then <a href="https://app.openocean.finance/CLASSIC#/XDAI/WXDAI/XDAI" target="markets">swap it for xDai</a>.</p>
      <p>Or <button onClick={initCardAppDonation}>donate by <strong>credit card</strong> or SEPA, etc.</button></p>
      <p>Credit card, SEPA, etc. donations are tax-deductible, because they are considered as donations
        to 501(c)3 Victor Porton's Foundation that are immediately and fully transfered to World Science DAO.</p>
      <p><a href="https://science-dao.vporton.name" target="_top">Return to World Science DAO.</a></p>
      <p><a href="https://github.com/vporton/science-dao-donate" target='_blank' rel="noreferrer">
        <img src="github-mark.svg" width="16" height="16" alt="GitHub"/></a>
      </p>
    </>
  );
}

function App() {
  useEffect(() => {
    document.title = 'Donations - World Science DAO';
  }, []);
  return (
    <div className="App">
      <div className="mainWidget">
        <WagmiConfig client={wagmiClient}>
          <AppMainPart/>
        </WagmiConfig>
        <Web3Modal
          projectId={walletConnectProjectId}
          ethereumClient={ethereumClient}
        />
      </div>
    </div>
  );
}

export default App;
