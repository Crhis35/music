<template >
  <!-- Header -->
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link
        exact-active-class="no-active"
        class="text-white font-bold uppercase text-2xl mr-4"
        :to="{ name: 'Home' }"
      >
        Music
      </router-link>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <router-link
              class="px-2 text-white"
              :to="{
                name: 'About',
              }"
              >About</router-link
            >
          </li>
          <li v-if="!userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal"
              >Login / Register
            </a>
          </li>

          <template v-else>
            <li>
              <router-link
                class="px-2 text-white"
                :to="{
                  name: 'Manage',
                }"
                >Manage</router-link
              >
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="signOut">Logout </a>
            </li>
          </template>
        </ul>
        <ul class="flex flex-row mt-1 ml-auto">
          <li>
            <a href="#" class="px-2 text-white" @click.prevent="changeLocale">
              {{ currentLocale }}</a
            >
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
<script >
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'Header',
  computed: {
    ...mapState({
      userLoggedIn: (state) => state.auth.userLoggedIn,
    }),
    currentLocale() {
      return this.$i18n.locale === 'en' ? 'English' : 'Español';
    },
  },
  methods: {
    ...mapMutations(['toggleAuthModal']),
    // ...mapActions(['signOut']),
    signOut() {
      this.$store.dispatch('signOut');

      if (this.$route.meta.requiresAuth) {
        this.$router.push({ name: 'Home' });
      }
    },
    changeLocale() {
      this.$i18n.locale = this.$i18n.locale === 'en' ? 'es' : 'en';
    },
  },
};
</script>
