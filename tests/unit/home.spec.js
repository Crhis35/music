import { shallowMount } from '@vue/test-utils';
import Home from '@/views/Home.vue';
import SongItem from '@/components/SongItem.vue';

describe('Home.vue', () => {
  it('renders list of songs', () => {
    const songs = [{}, {}, {}];
    Home.methods.getSongs = jest.fn().mockResolvedValue(false);

    const wrapper = shallowMount(Home, {
      data() {
        return {
          songs,
        };
      },
      global: {
        mocks: {
          $t: jest.fn().mockResolvedValue(false),
        },
      },
    });
    const items = wrapper.findAllComponents(SongItem);
    expect(items).toHaveLength(songs.length);

    items.forEach((item, i) => {
      expect(item.props().song).toStrictEqual(songs[i]);
    });
  });
});
