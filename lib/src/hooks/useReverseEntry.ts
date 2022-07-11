import type { AccountData } from '@cardinal/common'
import {
  findReverseEntryId,
  getReverseEntry,
  ReverseEntryData,
} from '@cardinal/namespaces'
import { findNamespaceId } from '@cardinal/namespaces'
import type { Connection, PublicKey } from '@solana/web3.js'
import { useQuery } from 'react-query'

export const useReverseEntry = (
  connection: Connection | undefined,
  namespaceName: string,
  pubkey: PublicKey | undefined
) => {
  return useQuery<AccountData<ReverseEntryData> | undefined>(
    ['useReverseEntry', namespaceName, pubkey?.toString()],
    async () => {
      if (!pubkey || !connection) return
      const [namespaceId] = await findNamespaceId(namespaceName)
      const reverseEntry = await getReverseEntry(
        connection,
        pubkey,
        namespaceId,
        true
      )
      return reverseEntry || undefined
    },
    { refetchOnMount: false, refetchOnWindowFocus: false }
  )
}
