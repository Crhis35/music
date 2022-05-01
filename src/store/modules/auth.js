import * as firebase from '@/includes/firebase';
import db from '@/includes/db';
import { doc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

const AuthModule = {
  //   namespaced: true,
  state: {
    authModalShow: false,
    userLoggedIn: false,
  },
  mutations: {
    toggleAuthModal(state) {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuth(state) {
      state.userLoggedIn = !state.userLoggedIn;
    },
  },
  actions: {
    async register({ commit }, payload) {
      const auth = firebase.getAuth();

      const userCred = await firebase.createUserWithEmailAndPassword(
        auth,
        payload.email,
        payload.password,
      );
      await setDoc(doc(db, 'users', userCred.user.uid), {
        name: payload.name,
        email: payload.email,
        age: payload.age,
        country: payload.country,
      });
      await updateProfile(auth.currentUser, {
        displayName: payload.name,
      });

      commit('toggleAuth');
      commit('toggleAuthModal');
    },
    async login({ commit }, payload) {
      const auth = firebase.getAuth();

      await firebase.signInWithEmailAndPassword(auth, payload.email, payload.password);
      commit('toggleAuth');
      commit('toggleAuthModal');
    },
    init_login({ commit }) {
      const auth = firebase.getAuth();
      const user = auth.currentUser;
      if (user) {
        commit('toggleAuth');
      }
    },
    async signOut({ commit }) {
      const auth = firebase.getAuth();

      await auth.signOut();
      commit('toggleAuth');
    },
  },
};

export default AuthModule;
