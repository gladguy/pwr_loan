import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_METHODS } from "../../utils/common";
import { apiUrl } from "../../utils/common";
import Notify from "../../component/notification";

export const lendRequest = createAsyncThunk(
  "user/setLendRequests",
  async (inscriptionId) => {
    try {
      const result = await API_METHODS.get(
        `${apiUrl.Api_base_url}/${inscriptionId}`
      );
      return result.data;
    } catch (error) {
      Notify("error", error.message);
    }
  }
);
