<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="
          w-full
          px-10
          py-20
          rounded
          text-center
          cursor-pointer
          border border-dashed border-gray-400
          text-gray-400
          transition
          duration-500
          hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid
        "
        :class="{
          'bg-green-400 border-green-400 border-solid': is_dragover,
        }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dragover = false"
        @dragenter.prevent.stop="is_dragover = true"
        @dragover.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <input type="file" multiple @change="upload($event)" />
      <hr class="my-6" />
      <!-- Progress Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.text_class">
          <i :class="upload.icon" />
          {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: upload.current_progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import db from '@/includes/db';
// eslint-disable-next-line object-curly-newline
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { getAuth } from 'firebase/auth';
import { collection, addDoc, getDoc } from 'firebase/firestore';

export default {
  name: 'Upload',
  props: {
    addSong: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      is_dragover: false,
      uploads: [],
    };
  },
  methods: {
    upload($event) {
      try {
        this.is_dragover = false;

        const files = $event.dataTransfer
          ? [...$event.dataTransfer.files]
          : [...$event.target.files];

        files.forEach((file, idx) => {
          if (!file.type.includes('audio')) {
            return;
          }

          if (!navigator.onLine) {
            this.uploads({
              task: {},
              current_progress: 100,
              name: file.name,
              variant: 'bg-red-400',
              icon: 'fas fa-times',
              text_class: 'text-red-400',
            });

            return;
          }

          const storage = getStorage();
          const storageRef = ref(storage, `songs/${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          this.uploads.push({
            uploadTask,
            current_progress: 0,
            name: file.name,
            variant: 'bg-blue-400',
            icon: 'fas fa-spinner fa-spin',
            text_class: '',
          });

          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              this.uploads[idx].current_progress = progress;
            },
            (error) => {
              this.uploads[idx].variant = 'bg-red-400';
              this.uploads[idx].icon = 'fas fa-times';
              this.uploads[idx].text_class = 'text-red-400';
              console.error(error);
            },
            async () => {
              const auth = getAuth();
              const song = {
                uid: auth.currentUser.uid,
                display_name: auth.currentUser.displayName,
                original_name: uploadTask.snapshot.metadata.name,
                modified_name: uploadTask.snapshot.metadata.name,
                genre: '',
                comment_count: 0,
                url: await getDownloadURL(storageRef),
              };

              const document = await addDoc(collection(db, 'songs'), song);
              const songSnapshot = await getDoc(document);

              this.addSong(songSnapshot);

              this.uploads[idx].variant = 'bg-green-400';
              this.uploads[idx].icon = 'fas fa-check';
              this.uploads[idx].text_class = 'text-green-400';
            },
          );
        });

        this.is_dragover = false;
      } catch (error) {
        console.error(error);
      }
    },
    cancelUpload() {
      this.uploads.forEach((upload) => {
        upload.uploadTask.cancel();
      });
    },
  },
  beforeUnmount() {
    this.uploads.forEach((upload) => {
      upload.uploadTask.cancel();
    });
  },
};
</script>
