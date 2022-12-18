import React from 'react';
import logo from './logo.svg';
import './App.css';
import { donationsAddress, donationsNetwork } from './config';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';

async function initCardAppDonation() {
  const logo = `${document.location.protocol}//${document.location.host}${document.location.pathname}logo.svg`;
  new RampInstantSDK({
    hostAppName: 'World Science DAO Donation',
    hostLogoUrl: logo,
    swapAsset: donationsNetwork,
    userAddress: donationsAddress,
    hostApiKey: 'gd9nmr8grvvecoxerfstt3mapj35mbgcyb7krqcm',
  }).show();
}

function App() {
  return (
    <div className="App">
      <div className="mainWidget">
        <h1>World Science DAO accepts donations</h1>
        <p>To donate send xDai or any ERC-20 token to <code className="cryptoAddress">{donationsAddress}</code>
        on <span className="cryptoAddress">Gnosis</span> (formerly called <span className="cryptoAddress">Dai</span>) chain.</p>
        <p><strong>Funds send to this address on any other chain, including main Ethereum chain will be irreversibly lost!</strong></p>
        <p>Or <a href="#" onClick={initCardAppDonation}>donate by credit card</a>.</p>
        <p>Credit card donations are tax-deductible, because they are considered as donations
          to 501(c)3 Victor Porton's Foundation that are immediately and fully transfered to World Science DAO.</p>
        <p><a href="https://science-dao.vporton.name" target="_top">Return to World Science DAO.</a></p>
    </div>
    </div>
  );
}

export default App;
