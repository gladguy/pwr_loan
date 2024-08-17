import { createSlice } from "@reduxjs/toolkit";
import { MAGICEDEN_WALLET_KEY, META_WALLET_KEY, UNISAT_WALLET_KEY, XVERSE_WALLET_KEY } from "../../utils/common";

const state = {
  xverse: {
    ordinals: {},
    payment: {},
    btcBalance: 0.0,
  },
  magicEden: {
    ordinals: {},
    payment: {},
    btcBalance: 0.0,
  },
  unisat: {
    address: null,
    publicKey: null,
    btcBalance: 0.0,
  },
  meta: {
    address: null,
    publicKey: null
  },
  active: [],
  activeChain: "BTC"
};

const walletSlice = createSlice({
  name: "wallet",
  initialState: state,
  reducers: {

    setXverseCredentials: (state, action) => {
      state.xverse = action.payload;
      state.active.push(XVERSE_WALLET_KEY);
    },

    setMetaCredentials: (state, action) => {
      state.meta = action.payload;
      state.active.push(META_WALLET_KEY);
    },

    setMagicEdenCredentials: (state, action) => {
      state.magicEden = action.payload;
      state.active.push(MAGICEDEN_WALLET_KEY);
    },

    setUnisatCredentials: (state, action) => {
      state.unisat = action.payload;
      state.active.push(UNISAT_WALLET_KEY);
    },

    clearWalletState: (state) => {
      state.xverse = {
        ordinals: {},
        payment: {},
        signature: null,
        btcBalance: 0.0,
      }
      state.magicEden = {
        ordinals: {},
        payment: {},
        signature: null,
        btcBalance: 0.0,
      }
      state.meta = {
        address: null,
        publicKey: null
      }
      state.unisat = {
        address: null,
        publicKey: null,
        signature: null,
        btcBalance: 0.0,
      }
      state.active = []
    },

    setActiveChain: (state, action) => {
      state.activeChain = action.payload;
    },
  }
});

export const {
  setXverseCredentials,
  setMetaCredentials,
  setUnisatCredentials,
  setMagicEdenCredentials,
  clearWalletState,
  setActiveChain
} = walletSlice.actions;
export default walletSlice.reducer;
