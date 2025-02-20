<template>
  <o-tabs v-model="activeTab" expanded>
    <!-- properties tab -->
    <o-tab-item value="0" label="Properties" class="py-4">
      <o-table
        v-if="nftMetadata?.attributes.length"
        :data="nftMetadata?.attributes"
        hoverable>
        <o-table-column v-slot="props" field="value" label="Trait">
          {{ props.row.value }}
        </o-table-column>
        <o-table-column v-slot="props" field="trait_type" label="Section">
          {{ props.row.trait_type }}
        </o-table-column>
      </o-table>
    </o-tab-item>

    <!-- description tab -->
    <o-tab-item value="1" label="Description" class="p-5">
      <div class="mb-3 is-flex">
        <span class="mr-2">Made By:</span>
        <a
          v-if="nft?.issuer"
          :href="`/${urlPrefix}/u/${nft?.issuer}`"
          target="_blank"
          rel="noopener noreferrer"
          class="has-text-weight-bold">
          <Identity ref="identity" :address="nft?.issuer" />
        </a>
      </div>

      <!-- TODO: render with markdown component -->
      <div>{{ nftMetadata?.description }}</div>
    </o-tab-item>

    <!-- details tab -->
    <o-tab-item value="2" label="Details" class="p-5">
      <!-- <div class="is-flex is-justify-content-space-between">
        <p>Contract Address</p>
        <p>--</p>
      </div> -->
      <div class="is-flex is-justify-content-space-between">
        <p>Creator</p>
        <a
          v-if="nft?.issuer"
          :href="`/${urlPrefix}/u/${nft?.issuer}`"
          target="_blank"
          rel="noopener noreferrer"
          class="has-text-weight-bold">
          <Identity ref="identity" :address="nft?.issuer" />
        </a>
      </div>
      <div class="is-flex is-justify-content-space-between">
        <p>Blockchain</p>
        <p>{{ urlPrefix }}</p>
      </div>
      <!-- <div class="is-flex is-justify-content-space-between">
        <p>Token Standard</p>
        <p>--</p>
      </div> -->
      <div v-if="nft?.royalty" class="is-flex is-justify-content-space-between">
        <p>Royalties</p>
        <p>{{ nft?.royalty }}%</p>
      </div>
      <hr class="my-2" />
      <div class="is-flex is-justify-content-space-between">
        <p>Media</p>
        <a
          :href="nftAnimation || nftImage"
          target="_blank"
          rel="noopener noreferrer"
          >{{ nftMimeType }}</a
        >
      </div>
      <div class="is-flex is-justify-content-space-between">
        <p>Metadata</p>
        <a :href="metadataURL" target="_blank" rel="noopener noreferrer">{{
          metadataMimeType
        }}</a>
      </div>
    </o-tab-item>
  </o-tabs>
</template>

<script setup lang="ts">
import { OTabItem, OTable, OTableColumn, OTabs } from '@oruga-ui/oruga'
import Identity from '@/components/identity/IdentityIndex.vue'
import { sanitizeIpfsUrl } from '@/components/rmrk/utils'

import { useGalleryItem } from './useGalleryItem'

const { urlPrefix } = usePrefix()
const { nft, nftMimeType, nftMetadata, nftImage, nftAnimation } =
  useGalleryItem()

const activeTab = ref('0')
const metadataMimeType = ref('application/json')
const metadataURL = ref('')

watchEffect(async () => {
  if (nft.value?.metadata) {
    const sanitizeMetadata = sanitizeIpfsUrl(nft.value?.metadata)
    const response = await fetch(sanitizeMetadata, {
      method: 'HEAD',
    })

    metadataMimeType.value =
      response.headers.get('content-type') || 'application/json'
    metadataURL.value = sanitizeMetadata
  }
})
</script>
