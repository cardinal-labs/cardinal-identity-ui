import type { CertificateData } from '@cardinal/certificates'
import type { AccountData } from '@cardinal/common'
import type { TokenManagerData } from '@cardinal/token-manager/dist/cjs/programs/tokenManager'
import type * as metaplex from '@metaplex-foundation/mpl-token-metadata'
import type { Wallet } from '@saberhq/solana-contrib'
import type { Cluster, PublicKey } from '@solana/web3.js'
import { useMutation } from 'react-query'

import { apiBase } from '../utils/constants'
import {
  discordCodeFromUrl,
  handleFromTweetUrl,
  tweetIdFromUrl,
} from '../utils/verification'

export interface HandleSetParam {
  metaplexData?: {
    pubkey: PublicKey
    parsed: metaplex.MetadataData
  } | null
  tokenManager?: AccountData<TokenManagerData>
  certificate?: AccountData<CertificateData> | null
}

export const useHandleVerify = (
  wallet: Wallet,
  cluster: Cluster,
  dev: boolean,
  accessToken: string,
  namespace: string,
  setAccessToken: (handle: string) => void,
  setHandle: (handle: string) => void
) => {
  return useMutation(
    async ({
      verificationUrl,
    }: {
      verificationUrl?: string
    }): Promise<void> => {
      if (!verificationUrl) return

      if (verificationUrl.includes('twitter')) {
        const handle = handleFromTweetUrl(verificationUrl)?.toString()
        setHandle(handle || '')
        const tweetId = tweetIdFromUrl(verificationUrl)
        const response = await fetch(
          encodeURI(
            `${apiBase(
              dev
            )}/twitter/verify?tweetId=${tweetId}&publicKey=${wallet?.publicKey.toString()}&handle=${handle}&namespace=${namespace}${
              cluster && `&cluster=${cluster}`
            }`
          )
        )
        const json = await response.json()
        if (response.status !== 200) throw new Error(json.message)
        console.log('Twiiter verification response: ', json)
      } else if (verificationUrl.includes('discord')) {
        const code = discordCodeFromUrl(verificationUrl)
        if (!code) throw new Error('No code found in url')
        const response = await fetch(
          encodeURI(
            `${apiBase(
              dev
            )}/twitter/verify?publicKey=${wallet?.publicKey.toString()}&namespace=${namespace}&code=${code}&accessToken=${accessToken}${
              cluster && `&cluster=${cluster}`
            }`
          )
        )
        const json = await response.json()
        if (response.status !== 200) throw new Error(json.message)
        setHandle(json.info.username || '')
        setAccessToken(json.info.accessToken || '')
        console.log('Discord verification response: ', json)
      } else {
        throw new Error('Invalid verification URL provided')
      }
    },
    {
      onError: (e) => {
        console.log(e)
      },
    }
  )
}
