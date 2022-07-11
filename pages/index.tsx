import styled from '@emotion/styled'
import { useWallet } from '@solana/wallet-adapter-react'
import { Header } from 'common/Header'
import { PlaceholderProfile } from 'components/Profile'
import { useWalletIdentity } from 'lib/src'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const TwitterBackground = styled.div`
  z-index: -1;
  top: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  background: #1da1f2;
`

const TwitterHome = () => {
  const wallet = useWallet()
  const router = useRouter()
  const { linkingFlow } = useWalletIdentity()

  useEffect(() => {
    if (wallet.connected) {
      router.push(`/${wallet?.publicKey?.toString()}`, undefined, {
        shallow: true,
      })
    }
  }, [wallet.connected, wallet.publicKey, router])

  return (
    <div
      className={`fixed h-full w-full`}
      style={{ background: linkingFlow.colors.primary }}
    >
      <Header />
      <div style={{ marginTop: '10vh' }}>
        <div
          style={{
            width: '320px',
            margin: '0px auto',
          }}
        >
          <PlaceholderProfile />
        </div>
      </div>
    </div>
  )
}

export default TwitterHome
