import type { CertificateData } from '@cardinal/certificates'
import type { AccountData } from '@cardinal/common'
import type { TokenManagerData } from '@cardinal/token-manager/dist/cjs/programs/tokenManager'
import type * as metaplex from '@metaplex-foundation/mpl-token-metadata'
import type { Wallet } from '@saberhq/solana-contrib'
import type { Cluster, Connection, PublicKey } from '@solana/web3.js'
import { sendAndConfirmRawTransaction, Transaction } from '@solana/web3.js'
import { useMutation } from 'react-query'

import { apiBase } from '../utils/constants'
import { tweetIdFromUrl } from '../utils/verification'

export interface HandleSetParam {
  metaplexData?: {
    pubkey: PublicKey
    parsed: metaplex.MetadataData
  } | null
  tokenManager?: AccountData<TokenManagerData>
  certificate?: AccountData<CertificateData> | null
}

export const useHandleClaimTransaction = (
  connection: Connection,
  wallet: Wallet,
  cluster: Cluster,
  dev: boolean,
  accessToken: string,
  handle: string,
  namespace: string
) => {
  return useMutation(
    [wallet.publicKey.toString()],
    async ({
      verificationUrl,
    }: {
      verificationUrl?: string
    }): Promise<string> => {
      if (!verificationUrl) throw new Error('No verification url provided')
      let requestURL = ''

      if (namespace === 'twitter') {
        const tweetId = tweetIdFromUrl(verificationUrl)
        requestURL = encodeURI(
          `${apiBase(
            dev
          )}/twitter/claim?tweetId=${tweetId}&publicKey=${wallet?.publicKey.toString()}&handle=${handle}&namespace=${namespace}${
            cluster && `&cluster=${cluster}`
          }`
        )
      } else if (namespace === 'discord') {
        let formattedHandle: string | string[] = handle.split('#')
        formattedHandle =
          formattedHandle.slice(0, -1).join() + '>' + formattedHandle.pop()
        requestURL = encodeURI(
          `${apiBase(
            dev
          )}/twitter/claim?publicKey=${wallet?.publicKey.toString()}&handle=${formattedHandle}&namespace=${namespace}&accessToken=${accessToken}${
            cluster && `&cluster=${cluster}`
          }`
        )
      } else {
        throw new Error('Invalid verification URL provided')
      }
      const response = await fetch(requestURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account: wallet.publicKey.toString(),
        }),
      })
      const json = await response.json()
      if (response.status !== 200 || json.error) throw new Error(json.error)
      const { transaction } = json
      const buffer = Buffer.from(decodeURIComponent(transaction), 'base64')
      const tx = Transaction.from(buffer)
      await wallet.signTransaction!(tx)
      return sendAndConfirmRawTransaction(connection, tx.serialize(), {
        skipPreflight: true,
      })
    }
  )
}
