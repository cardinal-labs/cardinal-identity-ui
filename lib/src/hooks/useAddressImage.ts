import { breakName } from '@cardinal/namespaces'
import type { Connection, PublicKey } from '@solana/web3.js'
import { useMemo, useState } from 'react'

import { tryGetImageUrl } from '../utils/format'
import { useAddressName } from './useAddressName'

export const useAddressImage = (
  connection: Connection,
  address: PublicKey | undefined,
  dev?: boolean
): {
  addressImage: string | undefined
  loadingImage: boolean
  addressNamespaceName: string | undefined
} => {
  const [addressImage, setAddressImage] = useState<string | undefined>(
    undefined
  )
  const [loadingImage, setLoadingImage] = useState<boolean>(true)
  const { displayName, addressNamespaceName, loadingName } = useAddressName(
    connection,
    address
  )

  const refreshImage = async (displayName: string | undefined) => {
    try {
      setLoadingImage(true)
      const [_namespace, handle] = displayName ? breakName(displayName) : []
      if (handle && addressNamespaceName) {
        const imageUrl = await tryGetImageUrl(addressNamespaceName, handle, dev)
        setAddressImage(imageUrl)
      } else {
        setAddressImage(undefined)
      }
    } finally {
      setLoadingImage(false)
    }
  }

  useMemo(() => {
    void refreshImage(displayName)
  }, [displayName, addressNamespaceName])

  return {
    addressImage,
    loadingImage: loadingImage || loadingName,
    addressNamespaceName,
  }
}
