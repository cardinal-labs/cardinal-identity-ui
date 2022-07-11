import { tryGetName } from '@cardinal/namespaces'
import type { Connection, PublicKey } from '@solana/web3.js'
import { useMemo, useState } from 'react'

import { useWalletIdentity } from '../providers/WalletIdentityProvider'

export const useAddressName = (
  connection: Connection,
  address: PublicKey | undefined
): {
  displayName: string | undefined
  addressNamespaceName: string | undefined
  loadingName: boolean
  refreshName: () => void
} => {
  const { handle } = useWalletIdentity()
  const [displayName, setDisplayName] = useState<string | undefined>()
  const [addressNamespaceName, setAddressNamespaceName] = useState<
    string | undefined
  >()
  const [loadingName, setLoadingName] = useState<boolean>(true)

  const refreshName = async () => {
    try {
      setLoadingName(true)
      if (address) {
        const data = await tryGetName(connection, address) // [em, nm]
        setDisplayName(data && data[0])
        setAddressNamespaceName(data && data[1])
      }
    } finally {
      setLoadingName(false)
    }
  }

  useMemo(() => {
    void refreshName()
  }, [connection, address?.toString(), handle])

  return { displayName, addressNamespaceName, loadingName, refreshName }
}
