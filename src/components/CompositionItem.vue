<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button
        @click.prevent="deleteSong"
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        @click.prevent="showForm = !showForm"
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showForm">
      <div
        class="text-white text-center font-bold p-4 mb-4"
        :class="alert_variant"
        v-if="show_alert"
      >
        {{ alert_message }}
      </div>
      <vee-form :validation-schema="schema" :initial-values="song" @submit="edit">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            name="modified_name"
            type="text"
            class="
              block
              w-full
              py-1.5
              px-3
              text-gray-800
              border border-gray-300
              transition
              duration-500
              focus:outline-none focus:border-black
              rounded
            "
            placeholder="Enter Song Title"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage name="modified_name" class="text-red-600" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            name="genre"
            type="text"
            class="
              block
              w-full
              py-1.5
              px-3
              text-gray-800
              border border-gray-300
              transition
              duration-500
              focus:outline-none focus:border-black
              rounded
            "
            placeholder="Enter Genre"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage name="genre" class="text-red-600" />
        </div>
        <button
          :disabled="in_submission"
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
        >
          Submit
        </button>
        <button
          :disabled="in_submission"
          @click.prevent="showForm = false"
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import db from '@/includes/db';
import { getStorage, ref, deleteObject } from 'firebase/storage';

export default {
  name: 'CompositionItem',
  props: {
    song: {
      type: Object,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
    },
    removeSong: {
      type: Function,
      required: true,
    },
    idx: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      showForm: false,
      schema: {
        modified_name: 'required|min:3',
        genre: 'alpha_spaces',
      },
      in_submission: false,
      show_alert: false,
      alert_variant: 'bg-blue-500',
      alert_message: 'Please wait...',
    };
  },
  methods: {
    async edit(data) {
      this.in_submission = true;
      this.show_alert = true;
      this.alert_variant = 'bg-blue-500';

      try {
        const songRef = doc(db, 'songs', data.docID);
        await updateDoc(songRef, data);

        this.updateSong(this.idx, data);
      } catch (error) {
        console.error(error);
        this.alert_variant = 'bg-red-500';
        this.alert_message = 'Something went wrong';
        this.in_submission = false;
        return;
      } finally {
        this.updateUnsavedFlag(false);
      }
      this.in_submission = false;
      this.alert_message = 'Song updated successfully';
      this.alert_variant = 'bg-green-500';
    },
    async deleteSong() {
      this.in_submission = true;
      this.show_alert = true;
      this.alert_variant = 'bg-blue-500';

      try {
        const storage = getStorage();
        const storageRef = ref(storage, `songs/${this.song.original_name}`);

        await deleteObject(storageRef);

        const songRef = doc(db, 'songs', this.song.docID);
        await deleteDoc(songRef);
        this.removeSong(this.idx);
      } catch (error) {
        console.error(error);
        this.alert_variant = 'bg-red-500';
        this.alert_message = 'Something went wrong';
        this.in_submission = false;
        return;
      }
      this.in_submission = false;
      this.alert_message = 'Song updated successfully';
      this.alert_variant = 'bg-green-500';
    },
  },
};
</script>
