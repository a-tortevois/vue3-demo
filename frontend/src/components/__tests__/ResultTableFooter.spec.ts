import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import type { ComponentPublicInstance } from 'vue';
import { createPinia, setActivePinia, type Pinia } from 'pinia';

import { useData } from '../../stores/DataStore.js';

import ResultTableFooter from '../ResultTableFooter.vue';

type TestWrapper<T> = VueWrapper<ComponentPublicInstance & T>;

const handlePageClick = (/*...args: unknown[]*/ page: number, isDisabled: boolean) => {
  // const [page, isDisabled] = args;
  console.log('Mock handlePageClick with', { page, isDisabled });
};

describe('ResultTableFooter is rendering properly the first page', () => {
  let pinia: Pinia;
  let wrapper: TestWrapper<Partial<{ handlePageClick: (/*args: unknown[]*/ page: number, isDisabled: boolean) => void }>>; // handlePageClick: () => void

  beforeEach(() => {
    // Enable pinia
    pinia = createPinia();
    setActivePinia(pinia);

    // Initialize dataStore
    const dataStore = useData();
    dataStore.searchParams.page = 1;
    dataStore.searchParams.limit = 15;
    dataStore.count = 125;

    // Mount
    wrapper = mount(ResultTableFooter, {
      global: {
        plugins: [pinia],
      },
    });
  });

  it('should set the selector limit to 15', () => {
    const limitSelector = wrapper.find('select[name="limit"]');
    expect(limitSelector.exists()).toBe(true);
    const limitSelectorValue = (limitSelector.element as HTMLSelectElement).value;
    expect(limitSelectorValue).matches(/[0-9]+/);
    expect(Number(limitSelectorValue)).toBe(15);
  });

  it('should set the page input value to 1', () => {
    const pageInput = wrapper.find('input[name="page"]');
    expect(pageInput.exists()).toBe(true);
    const pageInputValue = (pageInput.element as HTMLInputElement).value;
    expect(pageInputValue).matches(/[0-9]+/);
    expect(Number(pageInputValue)).toBe(1);
  });

  it('should display the rows count', () => {
    const rowsSpan = wrapper.find('#rows-count');
    expect(rowsSpan.exists()).toBe(true);
    const rowsSpanValue = (rowsSpan.element as HTMLSpanElement).textContent;
    expect(rowsSpanValue).matches(/[0-9]+/);
    expect(Number(rowsSpanValue)).toBe(125);
  });

  it('should disable the first page link', () => {
    const firstPageLink = wrapper.find('.i-first');
    expect(firstPageLink.exists()).toBe(true);
    expect(firstPageLink.classes()).toContain('disabled');
  });

  it('should disable the previous page link', () => {
    const previousPageLink = wrapper.find('.i-previous');
    expect(previousPageLink.exists()).toBe(true);
    expect(previousPageLink.classes()).toContain('disabled');
  });

  it('should enable the next page link', () => {
    const nextPageLink = wrapper.find('.i-next');
    expect(nextPageLink.exists()).toBe(true);
    expect(nextPageLink.classes()).not.toContain('disabled');
  });

  it('should enable the last page link', () => {
    const lastPageLink = wrapper.find('.i-last');
    expect(lastPageLink.exists()).toBe(true);
    expect(lastPageLink.classes()).not.toContain('disabled');
  });

  it('should simulate click on next', async () => {
    const nextPageLink = wrapper.find('.i-next');
    const spy = vi.spyOn(nextPageLink, 'trigger');
    spy.mockImplementation((event) => {
      console.log('mock event', event);
      return new Promise((resolve) => resolve());
    });
    await nextPageLink.trigger('click');
    expect(spy).toHaveBeenCalledOnce();
  });

  it('should simulate click on next with a spy', async () => {
    const mockHandlePageClick = vi.spyOn(wrapper.vm, 'handlePageClick').mockImplementation(handlePageClick);
    /*
    mockHandlePageClick.mockImplementation((...args: unknown[]) => {
      console.log('Mock with', { args });
    });
    */
    const nextPageLink = wrapper.find('.i-next');
    await nextPageLink.trigger('click');
    // const clickEvent = wrapper.emitted();
    // console.log('clickEvent', clickEvent.click[0]);
    expect(mockHandlePageClick).toHaveBeenCalled();
    expect(mockHandlePageClick).toHaveBeenCalledWith(2, false);
  });
});
