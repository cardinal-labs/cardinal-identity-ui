import { withRevokeCertificateV2 } from '@cardinal/certificates'
import type { AccountData } from '@cardinal/common'
import { getNameEntry, ReverseEntryData } from '@cardinal/namespaces'
import {
  withInvalidateExpiredNameEntry,
  withInvalidateExpiredReverseEntry,
} from '@cardinal/namespaces'
import * as namespaces from '@cardinal/namespaces'
import type { Wallet } from '@saberhq/solana-contrib'
import type { Connection } from '@solana/web3.js'
import {
  PublicKey,
  sendAndConfirmRawTransaction,
  Transaction,
} from '@solana/web3.js'
import { useMutation } from 'react-query'

import { nameFromMint } from '../components/NameManager'
import type { UserTokenData } from '../hooks/useUserNamesForNamespace'

export const useHandleUnlink = (
  connection: Connection,
  wallet: Wallet,
  namespaceName: string,
  userTokenData: UserTokenData
) => {
  return useMutation(
    async ({
      reverseNameEntryData,
    }: {
      reverseNameEntryData?: AccountData<ReverseEntryData>
    }): Promise<string> => {
      const [namespaceId] = await namespaces.findNamespaceId(namespaceName)
      const transaction = new Transaction()
      const entryMint = new PublicKey(userTokenData.metaplexData?.parsed.mint!)
      const [, entryName] = nameFromMint(
        userTokenData.metaplexData?.parsed.data.name!,
        userTokenData.metaplexData?.parsed.data.uri!
      )
      if (userTokenData.certificate) {
        await withRevokeCertificateV2(connection, wallet, transaction, {
          certificateMint: entryMint,
          revokeRecipient: namespaceId,
        })
      } else if (userTokenData.tokenManager) {
        // invalidate token manager
      }
      if (reverseNameEntryData) {
        await withInvalidateExpiredReverseEntry(
          transaction,
          connection,
          wallet,
          {
            namespaceName,
            mintId: entryMint,
            entryName: reverseNameEntryData.parsed.entryName,
            reverseEntryId: reverseNameEntryData.pubkey,
          }
        )
      }
      console.log(await getNameEntry(connection, namespaceName, entryName))
      await withInvalidateExpiredNameEntry(transaction, connection, wallet, {
        namespaceName,
        mintId: entryMint,
        entryName: entryName,
      })
      transaction.feePayer = wallet.publicKey
      transaction.recentBlockhash = (
        await connection.getRecentBlockhash('max')
      ).blockhash
      await wallet.signTransaction(transaction)
      return sendAndConfirmRawTransaction(connection, transaction.serialize(), {
        skipPreflight: true,
      })
    }
  )
}
