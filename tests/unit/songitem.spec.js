import { shallowMount, RouterLinkStub } from '@vue/test-utils';
import SongItem from '@/components/SongItem.vue';

describe('SongItem.vue', () => {
  let wrapper;
  const song = {
    display_name: 'test',
    docID: 'abc',
  };
  beforeEach(() => {
    wrapper = shallowMount(SongItem, {
      props: {
        song,
      },
      global: {
        components: {
          'router-link': RouterLinkStub,
        },
      },
    });
  });
  it('render song.display_name', () => {
    const compositionAuthor = wrapper.find('.text-gray-500');

    expect(compositionAuthor.text()).toBe(song.display_name);
  });
  it('render song.docId in id attribute', () => {
    expect(wrapper.attributes().id).toBe(`song-id-${song.docID}`);
    // expect(wrapper.classes()).toContain(`song-id-${song.docID}`);
  });
});
