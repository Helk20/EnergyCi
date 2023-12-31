import axios from 'axios';
import { createAsyncThunk, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';



import { AUTHORITIES } from 'app/config/constants';


import { cleanEntity } from 'app/shared/util/entity-utils';
import { IQueryParams, createEntitySlice, EntityState, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { IConsommation, defaultValue } from 'app/shared/model/consommation.model';

const initialState: EntityState<IConsommation> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entitiesByUser:[],
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

const apiUrl = 'api/consommations';

// eslint-disable-next-line eqeqeq
const isAdmin = AUTHORITIES.ADMIN == "ROLE_ADMIN"; // Replace hasAuthority with your actual logic to check the user's authority.


// Actions

export const getEntities= createAsyncThunk('consommation/fetch_entity_list', async ({ page, size, sort }: IQueryParams) => {
  // eslint-disable-next-line no-console
  console.log(isAdmin);
  const requestUrl = isAdmin  ? `${apiUrl}?cacheBuster=${new Date().getTime()}` : `${apiUrl}/user`;

  return axios.get<IConsommation[]>(requestUrl);
});

export const getEntitiesByUser = createAsyncThunk('consommation/fetch_entity_list_by_user', async ({ page, size, sort }: IQueryParams) => {
  const requestUrl = `${apiUrl}/user`;

  return axios.get<IConsommation[]>(requestUrl);
});

export const getEntity = createAsyncThunk(
  'consommation/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    return axios.get<IConsommation>(requestUrl);
  },
  { serializeError: serializeAxiosError }
);

export const createEntity = createAsyncThunk(
  'consommation/create_entity',
  async (entity: IConsommation, thunkAPI) => {
    const result = await axios.post<IConsommation>(apiUrl, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const updateEntity = createAsyncThunk(
  'consommation/update_entity',
  async (entity: IConsommation, thunkAPI) => {
    const result = await axios.put<IConsommation>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const partialUpdateEntity = createAsyncThunk(
  'consommation/partial_update_entity',
  async (entity: IConsommation, thunkAPI) => {
    const result = await axios.patch<IConsommation>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const deleteEntity = createAsyncThunk(
  'consommation/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`;
    const result = await axios.delete<IConsommation>(requestUrl);
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError }
);

// slice

export const ConsommationSlice = createEntitySlice({
  name: 'consommation',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(getEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          loading: false,
          entities: data,
        };
      })
      .addMatcher(isFulfilled(getEntitiesByUser), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          loading: false,
          entitiesByUser: data,
        };
      })
      .addMatcher(isFulfilled(createEntity, updateEntity, partialUpdateEntity), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
      })
      .addMatcher(isPending(getEntities, getEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      })
      .addMatcher(isPending(createEntity, updateEntity, partialUpdateEntity, deleteEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      });
  },
});

export const { reset } = ConsommationSlice.actions;

// Reducer
export default ConsommationSlice.reducer;
function hasAuthority(ADMIN: string) {
  throw new Error('Function not implemented.');
}

