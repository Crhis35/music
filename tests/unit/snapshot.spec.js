import { shallowMount, RouterLinkStub } from '@vue/test-utils';
import SongItem from '@/components/SongItem.vue';

describe('Snapshots SongItem.vue', () => {
  it('renders correctly', () => {
    const song = {
      docID: 'abc',
      modified_name: 'modified_name',
      display_name: 'display_name',
      comment_count: 1,
    };
    const wrapper = shallowMount(SongItem, {
      props: {
        song,
      },
      global: {
        components: {
          'router-link': RouterLinkStub,
        },
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
