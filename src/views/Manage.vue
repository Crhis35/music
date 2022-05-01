<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload ref="upload" :addSong="addSong" />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <composition-item
              v-for="(song, idx) in songs"
              :key="song.docID"
              :song="song"
              :updateSong="updateSong"
              :removeSong="removeSong"
              :updateUnsavedFlag="updateUnsavedFlag"
              :idx="idx"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// import store from '@/store';
import AppUpload from '@/components/Upload.vue';
import CompositionItem from '@/components/CompositionItem.vue';
import { getAuth } from 'firebase/auth';
// eslint-disable-next-line object-curly-newline
import { collection, query, getDocs, where } from 'firebase/firestore';
import db from '@/includes/db';

export default {
  name: 'Manage',
  components: {
    AppUpload,
    CompositionItem,
  },
  data() {
    return {
      songs: [],
      unsavedFlag: false,
    };
  },
  async created() {
    const auth = getAuth();
    const user = auth.currentUser;
    const q = query(collection(db, 'songs'), where('uid', '==', user.uid));
    const querySongs = await getDocs(q);

    querySongs.forEach(this.addSong);
  },
  methods: {
    updateSong(idx, values) {
      this.songs[idx].modified_name = values.modified_name;
      this.songs[idx].genre = values.genre;
    },
    removeSong(idx) {
      this.songs.splice(idx, 1);
    },
    addSong(document) {
      this.songs.push({
        ...document.data(),
        docID: document.id,
      });
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value;
    },
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next();
    } else {
      // eslint-disable-next-line no-alert, no-restricted-globals
      const leave = confirm('You have unsaved changes. Are you sure you want to leave?');
      next(leave);
    }
  },
  //   beforeRouteLeave(to, from, next) {
  //     this.$refs.upload.cancelUpload();
  //     next();
  //   },
  //   beforeRouteEnter(to, from, next) {
  //     if (store.state.userLoggedIn) {
  //       next();
  //     } else {
  //       next({
  //         name: 'Home',
  //       });
  //     }
  //   },
};
</script>
