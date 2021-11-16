import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import {
  Switch,
  Route
} from "react-router-dom";
import IpfsRouter from 'ipfs-react-router'

import './i18n';
import interestTheme from './theme';

import Account from './components/account';
import Footer from './components/footer';
import ActualFooter from './components/actualfooter';
import Home from './components/home';
import Stake from './components/stake';
import RewardsPools from './components/rewardPools';
import Header from './components/header';
import Propose from './components/propose';
import Claim from './components/claim';
import Vote from './components/vote';
import VersionToggle from './components/versionToggle';

import {
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  CONFIGURE,
  CONFIGURE_RETURNED,
  GET_BALANCES_PERPETUAL,
  GET_BALANCES_PERPETUAL_RETURNED
} from './constants'

import { injected } from "./stores/connectors";

import Store from "./stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class App extends Component {

  walletAuthorized = false;

  state = {
    account: null,
    headerValue: null
  };

  setHeaderValue = (newValue) => {
    this.setState({ headerValue: newValue })
  };

  componentWillMount() {
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.on(CONFIGURE_RETURNED, this.configureReturned);
    emitter.on(GET_BALANCES_PERPETUAL_RETURNED, this.getBalancesReturned);
    injected.isAuthorized().then(isAuthorized => {
      if (isAuthorized) {
        injected.activate()
        .then((a) => {
          store.setStore({ account: { address: a.account }, web3context: { library: { provider: a.provider } } })
          emitter.emit(CONNECTION_CONNECTED);
          console.log(a);
          //this.walletAuthorized = true;
        })
        .catch((e) => {
          console.log(e)
        })
      } else {
        //emitter.emit(CONNECTION_DISCONNECTED);
      }
    });      
    //this.checkconnIv = setInterval(this.checkWalletConn, 2000);
  }

  componentWillUnmount() {
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned);
    emitter.removeListener(GET_BALANCES_PERPETUAL_RETURNED, this.getBalancesReturned);
    //if (this.checkconnIv) clearInterval(this.checkconnIv);
  };

  getBalancesReturned = () => {
    window.setTimeout(() => {
      dispatcher.dispatch({ type: GET_BALANCES_PERPETUAL, content: {} })
    }, 15000)
  }

  configureReturned = () => {
    dispatcher.dispatch({ type: GET_BALANCES_PERPETUAL, content: {} })
  }

  connectionConnected = () => {
    this.setState({ account: store.getStore('account') })
    dispatcher.dispatch({ type: CONFIGURE, content: {} })    
  };

  connectionDisconnected = () => {
    this.setState({ account: store.getStore('account') })    
    console.log("disconnected");
  }

  render() {

    const { headerValue, account } = this.state

    return (
      <MuiThemeProvider theme={ createMuiTheme(interestTheme) }>
        <CssBaseline />
        <IpfsRouter>
          { !account &&
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              minWidth: '100vw',
              justifyContent: 'center',
              alignItems: 'center',
              background: "rgb(202, 226, 185)"
            }}>
              <Account />
            </div>
          }
          { account &&
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',              
              alignItems: 'center',
              //background: 'radial-gradient(50% 50% at 50% 50%, rgba(56, 67, 205, 0.1) 0%, rgba(37, 34, 98, 0) 100%)',
              background: "rgb(56, 67, 205)",
              //background: 'rgb(2,0,36)';
              background: 'linear-gradient(6deg, rgba(2,0,36,1) 0%, rgba(9,9,121,0.8463760504201681) 0%, rgba(0,212,255,1) 100%)',  
              //backgroundPosition: '0px -30vh',
              backgroundRepeat: 'no-repeat',                                          
            }}>
              <Switch>
                <Route path="/stake">
                  <Footer />
                  <Stake />
                  <ActualFooter />
                </Route>
                <Route path="/stake">
                  <Footer />
                  <RewardsPools />
                  <ActualFooter />
                </Route>
                <Route path="/vote">
                  <Footer />
                  <Vote />
                  <ActualFooter />
                </Route>
                <Route path="/propose">
                  <Footer />
                  <Propose />
                  <ActualFooter />
                </Route>
                <Route path="/">
                  <Footer />
                  {/*<Home />*/}
                  <RewardsPools />
                  <ActualFooter />
                </Route>
              </Switch>
            </div>
          }
        </IpfsRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
