import { withRevokeCertificateV2 } from '@cardinal/certificates'
import { AccountData, findAta, tryGetAccount } from '@cardinal/common'
import {
  findNameEntryId,
  findNamespaceId,
  getNameEntry,
  NAMESPACES_IDL,
  NAMESPACES_PROGRAM,
  NAMESPACES_PROGRAM_ID,
  ReverseEntryData,
  withInvalidateExpiredNameEntry,
} from '@cardinal/namespaces'
import { withInvalidateExpiredReverseEntry } from '@cardinal/namespaces'
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
import { AnchorProvider, Program } from '@project-serum/anchor'

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
      return handleUnlink(connection, wallet, {
        namespaceName: namespaceName,
        userTokenData: userTokenData,
        reverseNameEntryData: reverseNameEntryData
      })
    }
  )
}

export async function handleUnlink(
  connection: Connection,
  wallet: Wallet,
  params: {
    namespaceName: string,
    userTokenData: UserTokenData,
    reverseNameEntryData?: AccountData<ReverseEntryData>
  }
): Promise<string> {
  const [namespaceId] = await namespaces.findNamespaceId(params.namespaceName)
  const transaction = new Transaction()
  const entryMint = new PublicKey(params.userTokenData.metaplexData?.parsed.mint!)
  const [, entryName] = nameFromMint(
    params.userTokenData.metaplexData?.parsed.data.name!,
    params.userTokenData.metaplexData?.parsed.data.uri!
  )
  if (params.userTokenData.certificate) {
    await withRevokeCertificateV2(connection, wallet, transaction, {
      certificateMint: entryMint,
      revokeRecipient: namespaceId,
    })
  } else if (params.userTokenData.tokenManager) {
    // invalidate token manager
  }
  if (params.reverseNameEntryData) {
    await withInvalidateExpiredReverseEntry(
      transaction,
      connection,
      wallet,
      {
        namespaceName: params.namespaceName,
        mintId: entryMint,
        entryName: params.reverseNameEntryData.parsed.entryName,
        reverseEntryId: params.reverseNameEntryData.pubkey,
      }
    )
  }
  await withInvalidateExpiredNameEntry(transaction, connection, wallet, {
    namespaceName: params.namespaceName,
    mintId: entryMint,
    entryName,
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