<template>
  <main>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"
      ></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">{{ $t('home.listen') }}</h1>
          <p class="w-full md:w-8/12 mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et dolor mollis,
            congue augue non, venenatis elit. Nunc justo eros, suscipit ac aliquet imperdiet,
            venenatis et sapien. Duis sed magna pulvinar, fringilla lorem eget, ullamcorper urna.
          </p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="assets/img/introduction-music.png"
      />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <!-- <div
          class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
          v-icon:full.right="'headphones-alt'"
        > -->
        <div
          class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
          v-icon-secondary="{ icon: 'headphones-alt', right: true }"
        >
          <span class="card-title">Songs</span>
          <!-- Icon -->
        </div>

        <ol id="playlist">
          <song-item v-for="(song, idx) in songs" :key="song.docID" :song="song" :idx="idx" />
        </ol>
      </div>
    </section>
  </main>
</template>

<script>
import {
  collection,
  getDocs,
  query,
  limit,
  startAfter,
  doc,
  getDoc,
  orderBy,
} from 'firebase/firestore';
import db from '@/includes/db';
import SongItem from '@/components/SongItem.vue';
import IconSecondaryDirective from '@/directives/icon-secondary';

export default {
  name: 'Home',
  components: {
    SongItem,
  },
  directives: {
    iconSecondary: IconSecondaryDirective,
  },
  data() {
    return {
      songs: [],
      maxPerPage: 10,
      pendingRequest: false,
    };
  },
  async created() {
    await this.getSongs();

    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    async getSongs() {
      if (this.pendingRequest) return;
      this.pendingRequest = true;
      let q;
      if (this.songs.length > 0) {
        const lastDoc = await getDoc(
          doc(collection(db, 'songs'), this.songs[this.songs.length - 1].docID),
        );
        q = query(
          collection(db, 'songs'),
          limit(this.maxPerPage),
          orderBy('modified_name'),
          startAfter(lastDoc),
        );
      } else {
        q = query(collection(db, 'songs'), limit(this.maxPerPage), orderBy('modified_name'));
      }

      const snapshots = await getDocs(q);

      snapshots.forEach((document) => {
        this.songs.push({
          docID: document.id,
          ...document.data(),
        });
      });
      this.pendingRequest = false;
    },
    handleScroll() {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const { body } = document;
      const html = document.documentElement;
      const docHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight,
      );

      if (scrollTop + windowHeight >= docHeight - 100) {
        this.getSongs();
      }
    },
  },
};
</script>
