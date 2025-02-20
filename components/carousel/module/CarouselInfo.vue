<template>
  <div class="carousel-info is-flex is-flex-direction-column">
    <nuxt-link
      :to="urlOf({ id: item.id, url, chain: item.chain })"
      :title="item.name"
      :class="[
        'has-text-weight-bold carousel-info-name',
        { 'carousel-info-collection': isCollection },
      ]">
      <span>{{ item.name }}</span>
      <span v-if="isCollection" class="carousel-info-arrow">----></span>
    </nuxt-link>

    <nuxt-link
      v-if="!isCollection && item.collectionName && item.collectionId"
      :title="item.collectionName"
      :to="
        urlOf({ id: item.collectionId, url: 'collection', chain: item.chain })
      "
      class="is-size-7 carousel-info-name">
      {{ item.collectionName }}
    </nuxt-link>

    <div v-if="showPrice" class="carousel-meta">
      <CommonTokenMoney
        :custom-token-id="getTokenId(item.chain)"
        :value="item.price"
        class="has-text-weight-bold" />
      <p class="is-size-7">{{ chainName }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
import type { CarouselNFT } from '@/components/base/types'
import { getKusamaAssetId } from '@/utils/api/bsx/query'

import { useCarouselUrl } from '../utils/useCarousel'

const props = defineProps<{
  item: CarouselNFT
}>()
const { urlPrefix } = usePrefix()
const { urlOf } = useCarouselUrl()
const url = inject('itemUrl') as string
const isCollection = inject<boolean>('isCollection')
const chainName = computed(() => {
  const name = {
    rmrk: 'RMRK',
    snek: 'Snek (Rococo)',
    bsx: 'Basilisk',
  }

  return name[props.item.chain || urlPrefix.value]
})

const showPrice = computed((): boolean => {
  return Number(props.item.price) > 0 && !isCollection
})
const getTokenId = (chain?: string) => {
  return chain && getKusamaAssetId(chain)
}
</script>
