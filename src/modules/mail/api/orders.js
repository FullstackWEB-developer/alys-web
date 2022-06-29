import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { showMessage } from 'setup/messageSlice';
import { URL_API } from 'setup/config/env'

import axios from 'axios';

// ----------------------------------------------------------------------

export const getOrders = createAsyncThunk(
  'orders/getOrders',
  async (params, { dispatch, getState }) => {
    try {
      const response = await axios.post(URL_API, {
        operation: 'mailList',
        params
      });
      const data = await response.data;
      // dispatch(setEditData(data[0]));
      return data;
    } catch (error) {
      dispatch(
        showMessage({
          message: error.response.data,
          variant: 'error',
        })
      );
      return [];
    }
  }
);

// ----------------------------------------------------------------------

const myIdExtractor = (object) => object.contractID;

const contractsAdapter = createEntityAdapter({
  selectId: myIdExtractor,
  // sortComparer: (a, b) => a.contractID.toString().localeCompare(b.contractID.toString()),
});

export const { selectAll: selectContracts, selectById: selectContractsById } =
  contractsAdapter.getSelectors((state) => state.orders);

const slice = createSlice({
  name: 'orders',
  initialState: contractsAdapter.getInitialState({
    check: [],
  }),
  reducers: {
    setEdit: (state, action) => {
      state.edit = action.payload;
    },
  },
  extraReducers: {
    // [updateContract.fulfilled]: contractsAdapter.upsertOne,
    // [addContract.fulfilled]: contractsAdapter.addOne,
    // [removeContract.fulfilled]: (state, action) =>
    //   contractsAdapter.removeOne(state, action.payload),
  },
});

// Actions
export const {
  setEdit,
} = slice.actions;

// Reducer
export default slice.reducer;
