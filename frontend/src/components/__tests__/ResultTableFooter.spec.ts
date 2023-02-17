import { describe, it, expect, beforeEach, afterEach, vi, beforeAll } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import type { ComponentPublicInstance } from 'vue';
import { createPinia, setActivePinia, type Pinia } from 'pinia';
import { createTestingPinia, type TestingPinia } from '@pinia/testing';

import { useData, type DataStore } from '../../stores/DataStore.js';

import ResultTableFooter from '../ResultTableFooter.vue';

type TestWrapper<T> = VueWrapper<ComponentPublicInstance & T>;
type MockedWrapper = TestWrapper<
  Partial<{
    page: number;
    handlePageClick: (/*args: unknown[]*/ page: number, isDisabled: boolean) => Promise<void>;
    handlePageUpdate: () => void;
  }>
>;

const mockHandlePageClick = (/*...args: unknown[]*/ page: number, isDisabled: boolean) => {
  // const [page, isDisabled] = args;
  // console.log('call mockHandlePageClick with', { page, isDisabled });
  return Promise.resolve();
};

describe('Test if the ResultTableFooter renders the first page correctly.', () => {
  let pinia: Pinia;
  let wrapper: MockedWrapper;
  let dataStore: DataStore;

  // beforeAll(() => {});

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    dataStore = useData();
    dataStore.searchParams.page = 1;
    dataStore.searchParams.limit = 15;
    dataStore.count = 125;
    wrapper = mount(ResultTableFooter, {
      global: {
        plugins: [pinia],
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
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

  it('should have 9 pages', () => {
    const maxPages = wrapper.find('#pages-count');
    expect(maxPages.exists()).toBe(true);
    const maxPagesValue = (maxPages.element as HTMLSpanElement).textContent;
    expect(maxPagesValue).matches(/[0-9]+/);
    expect(Number(maxPagesValue)).toBe(9);
  });

  it('should emulate click on next with a spy on link', async () => {
    const nextPageLink = wrapper.find('.i-next');
    const spy = vi.spyOn(nextPageLink, 'trigger');
    spy.mockImplementation((event) => {
      // console.log('call mockLocal implementation of event', event);
      return Promise.resolve();
    });
    await nextPageLink.trigger('click');
    expect(spy).toHaveBeenCalledOnce();
  });

  it('should emulate click on next with a spy on handlePageClick', async () => {
    const spy = vi.spyOn(wrapper.vm, 'handlePageClick').mockImplementation(mockHandlePageClick);
    /*
    mockHandlePageClick.mockImplementation((...args: unknown[]) => {
      console.log('Mock with', { args });
    });
    */
    const nextPageLink = wrapper.find('.i-next');
    await nextPageLink.trigger('click');
    // const clickEvent = wrapper.emitted();
    // console.log('clickEvent', clickEvent.click[0]);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(2, false);
  });

  it('should input[name="page"] exists', async () => {
    const pageInput = wrapper.find('input[name="page"]');
    expect(pageInput.exists()).toBe(true);
  });

  it('should emulate input value change', async () => {
    const pageInput = wrapper.find('input[name="page"]');
    pageInput.setValue(2);
    expect(wrapper.vm.page).toBe(2);
  });

  it('should emulate input blur', async () => {
    const spy = vi.spyOn(wrapper.vm, 'handlePageUpdate').mockImplementation(vi.fn);
    const pageInput = wrapper.find('input[name="page"]');
    await pageInput.trigger('blur');
    expect(spy).toHaveBeenCalledOnce();
  });

  it('should emulate input keyup.enter', async () => {
    const spy = vi.spyOn(wrapper.vm, 'handlePageUpdate').mockImplementation(vi.fn);
    const pageInput = wrapper.find('input[name="page"]');
    await pageInput.trigger('keyup.enter');
    expect(spy).toHaveBeenCalledOnce();
  });
});

describe('Test the handlePageClick function with dataStore.fetchData mocking', () => {
  let pinia: TestingPinia;
  let wrapper: MockedWrapper;
  let dataStore: DataStore;

  // beforeAll(() => {});

  beforeEach(() => {
    pinia = createTestingPinia({
      createSpy: vi.fn,
    });
    setActivePinia(pinia);
    dataStore = useData(pinia);
    dataStore.searchParams.page = 1;
    dataStore.searchParams.limit = 15;
    dataStore.count = 125;
    wrapper = mount(ResultTableFooter, {
      global: {
        plugins: [pinia],
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('cannot call fetchData when isDisabled = true', async () => {
    const handlePageClickSpy = vi.spyOn(wrapper.vm, 'handlePageClick');
    const firstPageLink = wrapper.find('.i-first');
    // const spy = vi.spyOn(firstPageLink, 'trigger');
    await firstPageLink.trigger('click');
    // expect(spy).toHaveBeenCalledOnce();
    // The handler is called even if it couldn't
    expect(handlePageClickSpy).toHaveBeenCalledOnce();
    expect(dataStore.fetchData).not.toHaveBeenCalled();
  });

  it('should emulate input blur, then check dataStore.fetchData parameters', async () => {
    // const handlePageUpdateSpy = vi.spyOn(wrapper.vm, 'handlePageUpdate');
    const pageInput = wrapper.find('input[name="page"]');
    pageInput.setValue(2);
    await pageInput.trigger('blur');
    // expect(wrapper.vm.page).toBe(2);
    // expect(handlePageUpdateSpy).toHaveBeenCalled();
    expect(dataStore.fetchData).toHaveBeenCalledWith({ page: 2 });
  });

  it('should emulate input keyup.enter, then check dataStore.fetchData parameters', async () => {
    // const handlePageUpdateSpy = vi.spyOn(wrapper.vm, 'handlePageUpdate');
    const pageInput = wrapper.find('input[name="page"]');
    pageInput.setValue(2);
    await pageInput.trigger('keyup.enter');
    // expect(wrapper.vm.page).toBe(2);
    // expect(handlePageUpdateSpy).toHaveBeenCalled();
    expect(dataStore.fetchData).toHaveBeenCalledWith({ page: 2 });
  });

  it('cannot call fetchData when handlePageClick is called with bad page parameters', async () => {
    // const handlePageClickSpy = vi.spyOn(wrapper.vm, 'handlePageClick');
    // const firstPageLink = wrapper.find('.i-previous');
    // const spy = vi.spyOn(firstPageLink, 'trigger');
    // await firstPageLink.trigger('click');

    // The handler is called even if it couldn't
    if (wrapper.vm.handlePageClick !== undefined) {
      wrapper.vm.handlePageClick(-1, false);
      wrapper.vm.handlePageClick(dataStore.getMaxPages + 1, false);
      // expect(handlePageClickSpy).toHaveBeenCalledOnce();
      // expect(handlePageClickSpy).toHaveBeenCalledWith(-1, false);
      expect(dataStore.fetchData).not.toHaveBeenCalled();
    }
  });
});
