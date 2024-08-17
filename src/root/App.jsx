import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { WalletStandardProvider } from "@wallet-standard/react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import LoadingWrapper from "../component/loading-wrapper";
import store, { persistor } from "../redux/store";
import "./../App.css";
import MainLayout from "./layout";

const App = () => {
  const wallets = [new PetraWallet()];

  return (
    <React.Fragment>
      <Provider store={store}>
        <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
          <PersistGate loading={null} persistor={persistor}>
            <LoadingWrapper>
              <Router>
                <WalletStandardProvider>
                  <MainLayout />
                </WalletStandardProvider>
              </Router>
            </LoadingWrapper>
          </PersistGate>
        </AptosWalletAdapterProvider>
      </Provider>
    </React.Fragment>
  );
};

export default App;
