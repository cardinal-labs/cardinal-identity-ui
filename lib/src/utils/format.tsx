import { shortenAddress } from '@cardinal/namespaces'
import { PublicKey } from '@solana/web3.js'
import { apiBase } from './constants'

export const formatIdentityLink = (
  handle: string | undefined,
  namespace: string | undefined
) => {
  if (!handle || !namespace) return <></>
  if (namespace === 'twitter') {
    return (
      <a
        href={`https://twitter.com/${handle}`}
        onClick={() => window.open(`https://twitter.com/${handle}`)}
        style={{ color: '#177ddc' }}
        target="_blank"
        rel="noreferrer"
      >
        {handle}
      </a>
    )
  } else if (namespace === 'discord') {
    return (
      <a
        href={`https://discord.com/channels/@me`}
        onClick={() => window.open('https://discord.com/channels/@me')}
        style={{ color: '#177ddc' }}
        target="_blank"
        rel="noreferrer"
      >
        {handle}
      </a>
    )
  }
}

export function shortPubKey(pubkey: PublicKey | string | null | undefined) {
  if (!pubkey) return ''
  return `${pubkey?.toString().substring(0, 4)}..${pubkey
    ?.toString()
    .substring(pubkey?.toString().length - 4)}`
}

export const tryPublicKey = (
  publicKeyString: PublicKey | string | string[] | undefined | null
): PublicKey | null => {
  if (publicKeyString instanceof PublicKey) return publicKeyString
  if (!publicKeyString) return null
  try {
    return new PublicKey(publicKeyString)
  } catch (e) {
    return null
  }
}

export const formatShortAddress = (address: PublicKey | undefined) => {
  if (!address) return <></>
  return (
    <a
      href={`https://explorer.solana.com/address/${address.toString()}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {shortenAddress(address.toString())}
    </a>
  )
}

export async function tryGetImageUrl(
  namespace: string,
  name: string,
  dev?: boolean
): Promise<string | undefined> {
  if (namespace === 'twitter') {
    const response = await fetch(
      `${apiBase(
        dev
      )}/twitter/proxy?url=https://api.twitter.com/2/users/by&usernames=${name}&user.fields=profile_image_url&namespace=${namespace}`
    )
    const json = (await response.json()) as {
      data: { profile_image_url: string }[]
    }
    return json?.data[0]?.profile_image_url.replace('_normal', '') as string
  } else if (namespace === 'discord') {
    return encodeURI(
      `https://${
        dev ? 'dev-nft' : 'nft'
      }.cardinal.so/img/?text=@${encodeURIComponent(
        name
      )}:${namespace}&proxy=true${dev ? `&cluster=devnet` : ''}`
    )
  } else {
    return undefined
  }
}

export async function tryGetProfile(
  handle: string,
  dev?: boolean
): Promise<
  | { profile_image_url: string; username: string; id: string; name: string }
  | undefined
> {
  try {
    const response = await fetch(
      `${apiBase(
        dev
      )}/namespaces/twitter/proxy?url=https://api.twitter.com/2/users/by&usernames=${handle}&user.fields=profile_image_url`
    )
    const json = (await response.json()) as {
      data: {
        profile_image_url: string
        username: string
        id: string
        name: string
      }[]
    }
    return {
      profile_image_url: json?.data[0]?.profile_image_url.replace(
        '_normal',
        ''
      ) as string,
      username: json?.data[0]?.username as string,
      id: json?.data[0]?.id as string,
      name: json?.data[0]?.name as string,
    }
  } catch (e) {
    return undefined
  }
}
