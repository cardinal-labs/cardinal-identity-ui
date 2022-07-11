import type { Wallet } from '@saberhq/solana-contrib'
import { Button } from '../common/Button'
import { LinkingFlow } from '../common/LinkingFlows'

import { useWalletIdentity } from '../providers/WalletIdentityProvider'

export const PostTweet = ({
  wallet,
  appName,
  appTwitter,
  disabled,
  callback,
  cluster,
}: {
  wallet?: Wallet
  appTwitter?: string | undefined
  appName?: string | undefined
  disabled: boolean
  callback?: () => void
  cluster?: string | undefined
}) => {
  const { linkingFlow } = useWalletIdentity()
  const link = useGenerateLink(
    linkingFlow,
    wallet?.publicKey?.toString(),
    appName,
    appTwitter,
    cluster
  )
  return (
    <a
      href={link}
      onClick={() => {
        window.open(link, '_blank')
        callback && callback()
      }}
      target="_blank"
      rel="noreferrer noopener"
    >
      <Button
        style={{ marginTop: '5px', padding: '0px 20px 0px 20px' }}
        variant="primary"
        bgColor={linkingFlow?.colors.primary}
        disabled={disabled}
      >
        <div style={{ width: '14px' }} className="align-middle">
          <img
            className="text-white "
            alt={`${linkingFlow?.name}-icon`}
            src={linkingFlow?.icon}
          />
        </div>
        <span style={{ fontSize: '12px' }}>Verify</span>
      </Button>
    </a>
  )
}

const useGenerateLink = (
  linkingFlow: LinkingFlow,
  pubkey: string | undefined,
  appName: string | undefined,
  appTwitter: string | undefined,
  cluster?: string | undefined
): string => {
  if (!pubkey) return ''
  let link = ''
  switch (linkingFlow.name) {
    case 'twitter': {
      link = [
        `https://twitter.com/intent/tweet?text=`,
        encodeURIComponent(
          [
            `Claiming my Twitter handle as a @Solana NFT${
              appTwitter || appName ? ` on ${appTwitter || appName}` : ''
            } using @cardinal_labs protocol and linking it to my address ${pubkey}\n\n`,
            `Verify and claim yours at https://twitter.cardinal.so${
              cluster === 'devnet' ? '?cluster=devnet' : ''
            }!`,
          ].join('')
        ),
      ].join('')
      break
    }
    case 'discord': {
      link =
        'https://discord.com/oauth2/authorize?response_type=code&client_id=992004845101916191&scope=identify&state=15773059ghq9183habn&redirect_uri=http://localhost:3000/verification?linkingFlow=discord&prompt=consent'
      break
    }
    default: {
      throw new Error('Incorrect linking flow')
    }
  }
  return link
}
