import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHeader from '@/components/AppHeader.vue'

describe('AppHeader - search input', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(AppHeader, {
      props: {
        modelValue: '',
      },
      global: {
        stubs: {
          RouterLink: {
            template: '<a class="title" @click="$emit(\'click\')"><slot /></a>',
          },
        },
      },
    })
  })

  it('emits update:modelValue when typing in search input', async () => {
    const input = wrapper.find('.search-input')
    await input.setValue('breaking bad')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted![0]).toEqual(['breaking bad'])
  })

  it('reflects modelValue prop changes in the input', async () => {
    await wrapper.setProps({ modelValue: 'game of thrones' })
    const inputEl = wrapper.find('.search-input').element as HTMLInputElement
    expect(inputEl.value).toBe('game of thrones')
  })

  it('clears the search when title is clicked', async () => {
    await wrapper.setProps({ modelValue: 'westworld' })
    await wrapper.find('.title').trigger('click')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    // First emit might be from initial input binding; assert the last emission is clear
    const last = emitted![emitted!.length - 1]
    expect(last).toEqual([''])
  })
})
