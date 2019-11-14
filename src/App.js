import React, { Component } from "react";
import Box from "3box";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const getThreeBox = async (address) => {
  const profile = await Box.getProfile(address);
  return profile;
};

export default class App extends Component {

  state = {
    needToAWeb3Browser : false,
  }
  async getAddressFromMetaMask() {
    if (typeof window.ethereum == "undefined") {
      this.setState({ needToAWeb3Browser: true });
    } else {
      window.ethereum.autoRefreshOnNetworkChange = false; //silences warning about no autofresh on network change
      const accounts = await window.ethereum.enable();
      this.setState({ accounts });
    }
  }
  async componentDidMount() {
    await this.getAddressFromMetaMask();
    if (this.state.accounts) {
      //using the address saved in getAddressFromMetaMask func
      // open 3Box buy authenticating a user https://docs.3box.io/build/web-apps/auth/3box
      // This method will trigger the users ETH wallet  to sign a message
      // Once the user has approved, they can update, decrypt, and interact  
      // with their 3Box profile store.
      const box = await Box.openBox(this.state.accounts[0], window.ethereum);
      // Sync 3Box
      await box.syncDone
      console.log("3Box synced"); 
    }
  }
  render() {

    if(this.state.needToAWeb3Browser){
      return <h1>Please install metamask</h1>
    }

    return (
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
            </ul>
          </nav>

          <Switch>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

function Home() {
  return <h2>Home</h2>;
}

class Profile extends Component {
  render() {
    return <h2>Profile </h2>;
  }
}
