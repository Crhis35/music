import PlayerModule from '@/store/modules/player';
import { cloneDeep } from 'lodash';
import { createStore } from 'vuex';
import AuthModule from '@/store/modules/auth';

jest.mock('@/includes/db', () => {});
jest.mock('@/includes/firebase', () => ({
  getAuth: jest.fn().mockReturnValue({}),
  signInWithEmailAndPassword: jest.fn().mockResolvedValue(true),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: () => Promise.resolve(),
  enableIndexedDbPersistence: () => Promise.resolve(),
}));

describe('Vuex Store', () => {
  let store;
  beforeEach(() => {
    store = createStore({
      modules: {
        auth: cloneDeep(AuthModule),
      },
    });
  });
  it('toggleAuth mutation sets userLoggedIn to true', () => {
    expect(store.state.auth.userLoggedIn).not.toBe(true);
    store.commit('toggleAuth');
    expect(store.state.auth.userLoggedIn).toBe(true);
  });
  it('login action sets userLoggedIn to true', async () => {
    expect(store.state.auth.userLoggedIn).toBe(false);
    await store.dispatch('login', { email: '', password: '' });
    expect(store.state.auth.userLoggedIn).toBe(true);
  });
  it('playin returns tru if audio is playing', () => {
    const state = {
      sound: {
        playing: () => true,
      },
    };
    const result = PlayerModule.getters.playing(state);
    expect(result).toEqual(true);
  });
});
