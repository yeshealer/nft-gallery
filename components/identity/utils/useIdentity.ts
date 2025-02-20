import { get, update } from 'idb-keyval'
import { hexToString, isHex } from '@polkadot/util'
import { GenericAccountId } from '@polkadot/types/generic/AccountId'
import { onApiConnect } from '@kodadot1/sub-api'

import { emptyObject } from '@/utils/empty'
import { identityStore } from '@/utils/idbStore'
import shortAddress from '@/utils/shortAddress'

type Address = string | GenericAccountId | undefined
type IdentityFields = Record<string, string>

const resolveAddress = (account: Address): string => {
  return account instanceof GenericAccountId
    ? account.toString()
    : account || ''
}

const handleRaw = (display): string => {
  if (display?.isRaw) {
    return display.asRaw.toHuman() as string
  }

  if (isHex(display?.Raw)) {
    return hexToString(display?.Raw)
  }

  return display?.toString()
}

const fetchIdentity = async (address: string): Promise<IdentityFields> => {
  if (!address) {
    return emptyObject<IdentityFields>()
  }

  const { apiInstance } = useApi()
  const api = await apiInstance.value
  const optionIdentity = await api?.query.identity?.identityOf(address)
  const identityFresh = optionIdentity?.unwrapOrDefault()

  if (!identityFresh?.size) {
    return emptyObject<IdentityFields>()
  }

  const final = Array.from(identityFresh.info)
    .filter(([, value]) => !Array.isArray(value) && !value.isEmpty)
    .reduce((acc, [key, value]) => {
      acc[key] = handleRaw(value)
      return acc
    }, {} as IdentityFields)

  update(address, () => final, identityStore)

  return final
}

const displayName = ({
  customNameOption,
  identity,
  shortenedAddress,
}): string => {
  if (customNameOption) {
    return customNameOption
  }

  const display = identity.value.display
  if (display?.length > 20) {
    return shortAddress(display)
  }

  return display || shortenedAddress.value
}

export default function useIdentity({ address, customNameOption }) {
  const { apiUrl } = useApi()
  const identity = ref<IdentityFields>({})
  const isFetchingIdentity = ref(false)
  const twitter = computed(() => identity?.value?.twitter)
  const discord = computed(() => identity?.value?.discord)
  const display = computed(() => identity?.value?.display)
  const shortenedAddress = computed(() => shortAddress(address))
  const name = computed(() =>
    displayName({ customNameOption, identity, shortenedAddress })
  )

  const whichIdentity = async () => {
    const identityCached = await get(resolveAddress(address), identityStore)

    if (identityCached) {
      identity.value = identityCached
    } else {
      isFetchingIdentity.value = true

      // better if get data from indexer
      // reference: https://github.com/kodadot/nft-gallery/issues/3783
      onApiConnect(apiUrl.value, async () => {
        identity.value = await fetchIdentity(address)
        isFetchingIdentity.value = false
      })
    }
  }

  onMounted(whichIdentity)

  return {
    identity,
    isFetchingIdentity,
    shortenedAddress,
    twitter,
    discord,
    display,
    name,
  }
}

export function useIdentitySoldData({ address }) {
  const nftEntities = ref({})

  const { data }: any = useGraphql({
    queryName: 'nftListSold',
    variables: {
      account: address,
      limit: 3,
      orderBy: 'price_DESC',
    },
  })

  const fetchLastBought = () => {
    nftEntities.value = data.value.nftEntities
  }

  watch(data, fetchLastBought)
  return { nftEntities }
}
