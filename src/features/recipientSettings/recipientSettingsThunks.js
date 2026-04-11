import { createAsyncThunk } from '@reduxjs/toolkit';
import { getRecipientProfile, updateRecipientProfile, changeRecipientPassword } from '../../api/recipient.api';
import { selectRecipientToken } from '../../store/recipientAuth/recipientAuthSelectors';
import { recipientLoginSuccess } from '../../store/recipientAuth/recipientAuthSlice';

export const submitUpdateProfile = createAsyncThunk(
  'recipientSettings/submitUpdateProfile',
  async ({ name }, { getState, dispatch, rejectWithValue }) => {
    try {
      const token = selectRecipientToken(getState());
      const data = await updateRecipientProfile(token, { name });
      const recipient = data.recipient ?? data;
      dispatch(recipientLoginSuccess({ token, recipient }));
      return recipient;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const submitChangePassword = createAsyncThunk(
  'recipientSettings/submitChangePassword',
  async ({ current_password, new_password }, { getState, rejectWithValue }) => {
    try {
      const token = selectRecipientToken(getState());
      const data = await changeRecipientPassword(token, { current_password, new_password });
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchRecipientProfile = createAsyncThunk(
  'recipientSettings/fetchRecipientProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = selectRecipientToken(getState());
      const data = await getRecipientProfile(token);
      return data.profile ?? data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
