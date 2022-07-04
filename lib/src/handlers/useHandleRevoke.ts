import type { CertificateData } from '@cardinal/certificates'
import type { AccountData } from '@cardinal/common'
import type { TokenManagerData } from '@cardinal/token-manager/dist/cjs/programs/tokenManager'
import type * as metaplex from '@metaplex-foundation/mpl-token-metadata'
import type { Wallet } from '@saberhq/solana-contrib'
import type { Cluster, PublicKey } from '@solana/web3.js'
import { useMutation } from 'react-query'
import { LinkingFlow } from '../common/LinkingFlows'

import { apiBase } from '../utils/constants'
import { handleFromTweetUrl, tweetIdFromUrl } from '../utils/verification'

export interface HandleSetParam {
  metaplexData?: {
    pubkey: PublicKey
    parsed: metaplex.MetadataData
  } | null
  tokenManager?: AccountData<TokenManagerData>
  certificate?: AccountData<CertificateData> | null
}

export const useHandleRevoke = (
  wallet: Wallet,
  cluster: Cluster,
  dev: boolean,
  setHandle: (handle: string) => void
) => {
  return useMutation(
    async ({
      verificationUrl,
    }: {
      verificationUrl?: string
    }): Promise<void> => {
      if (!verificationUrl) return
      let requestURL = ''

      if (verificationUrl.includes('twitter')) {
        const handle = handleFromTweetUrl(verificationUrl)?.toString()
        setHandle(handle || '')
        const tweetId = tweetIdFromUrl(verificationUrl)
        requestURL = `${apiBase(
          dev
        )}/namespaces/twitter/revoke?tweetId=${tweetId}&publicKey=${wallet?.publicKey.toString()}&handle=${handle}${
          cluster && `&cluster=${cluster}`
        }`
      } else if (verificationUrl.includes('discord')) {
      } else {
        throw new Error('Invalid verification URL provided')
      }

      const response = await fetch(requestURL)
      const json = await response.json()
      if (response.status !== 200) throw new Error(json.error)
    }
  )
}