import { WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import type { Transaction } from '@solana/web3.js'
import { Connection } from '@solana/web3.js'
import type { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { ConnectButton } from '../src/components/ConnectButton'
import { WalletIdentityProvider } from '../src/providers/WalletIdentityProvider'
import { tryPublicKey } from '../src/utils/format'

export default {
  title: 'Components/ConnectButton',
  component: ConnectButton,
  argTypes: {
    connection: {
      options: ['mainnet', 'devnet', 'testnet'],
      description: 'Solana RPC connection to fetch the mapping from',
      mapping: {
        mainnet: new Connection('https://api.mainnet-beta.solana.com'),
        devnet: new Connection('https://api.devnet.solana.com'),
        testnet: new Connection('https://api.testnet.solana.com'),
      },
    },
    address: {
      control: 'text',
    },
    appName: {
      control: 'text',
    },
    appTwitter: {
      control: 'text',
    },
  },
} as ComponentMeta<typeof ConnectButton>

type LinkTwitterModalControls = (
  props: React.ComponentProps<typeof ConnectButton> & { address: string }
) => JSX.Element

const Template: ComponentStory<LinkTwitterModalControls> = ({ ...args }) => {
  const publicKey = tryPublicKey(args.address)
  require('@solana/wallet-adapter-react-ui/styles.css')
  if (publicKey) {
    return (
      <WalletProvider wallets={[]}>
        <WalletModalProvider>
          <WalletIdentityProvider
            appName="App Name"
            appTwitter="@cardinal_labs"
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                alignItems: 'center',
              }}
            >
              <ConnectButton
                variant={args.variant}
                dev={args.dev}
                cluster={args.cluster}
                connection={
                  args.connection ||
                  new Connection('https://api.mainnet-beta.solana.com')
                }
                wallet={{
                  publicKey: publicKey,
                  signTransaction: async (tx: Transaction) => tx,
                  signAllTransactions: async (txs: Transaction[]) => txs,
                }}
                style={args.style}
                disabled={args.disabled}
                showManage={args.showManage}
              />
            </div>
          </WalletIdentityProvider>
        </WalletModalProvider>
      </WalletProvider>
    )
  }
  return <div>Invalid Public Key</div>
}

export const Primary = Template.bind({})
Primary.args = {
  address: 'DNVVBNkdyv6tMentHdjVz5cpYmjQYcquLfYkz1fApT7Q',
  connection: new Connection('https://api.mainnet-beta.solana.com'),
}
