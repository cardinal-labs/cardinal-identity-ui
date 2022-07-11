import './styles.css'
import 'tailwindcss/tailwind.css'

import { WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { getWalletAdapters } from '@solana/wallet-adapter-wallets'
import { WalletIdentityProvider } from 'lib/src'
import type { AppProps } from 'next/app'
import {
  EnvironmentProvider,
  getInitialProps,
} from 'providers/EnvironmentProvider'

require('@solana/wallet-adapter-react-ui/styles.css')

const App = ({
  Component,
  pageProps,
  linkingFlowKey,
  cluster,
}: AppProps & { linkingFlowKey: string; cluster: string }) => (
  <EnvironmentProvider defaultCluster={cluster}>
    <WalletProvider wallets={getWalletAdapters()}>
      <WalletModalProvider>
        <WalletIdentityProvider linkingFlowKey={linkingFlowKey}>
          <Component {...pageProps} />
        </WalletIdentityProvider>
      </WalletModalProvider>
    </WalletProvider>
  </EnvironmentProvider>
)

App.getInitialProps = getInitialProps

export default App
