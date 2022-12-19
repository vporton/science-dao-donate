import { useEffect } from 'react';
import { donationsAddress, donationsNetwork, rampApiKey } from './config';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';
import './App.css';

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

function App() {
  useEffect(() => {
    document.title = 'Donations - World Science DAO';
  }, []);
  return (
    <div className="App">
      <div className="mainWidget">
        <h1>World Science DAO accepts donations</h1>
        <p><strong>Donate by crypto or credit card.</strong></p>
        <p>To donate send xDai or any ERC-20 token to <code className="cryptoAddress">{donationsAddress}</code> {' '}
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
      </div>
    </div>
  );
}

export default App;
