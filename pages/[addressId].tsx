import styled from '@emotion/styled'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { Header } from 'common/Header'
import { PlaceholderProfile, Profile } from 'components/Profile'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

export const TwitterBackground = styled.div`
  z-index: -1;
  top: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  background: #1da1f2;
  //   background: linear-gradient(-45deg, #23a6d5, #1da1f2);
`

const TwitterClaim = () => {
  const wallet = useWallet()
  const router = useRouter()

  const { addressId } = router.query
  let address
  try {
    address = new PublicKey(addressId || '')
  } catch (err) {}

  useMemo(() => {
    if (
      wallet.connected &&
      addressId?.toString() !== wallet.publicKey?.toString()
    ) {
      router.push(`/${wallet?.publicKey?.toString()}`, undefined, {
        shallow: true,
      })
    }
  }, [wallet.connected, wallet.publicKey, addressId, router])

  return (
    <>
      <Header />
      <div style={{ marginTop: '45vh', transform: 'translateY(-50%)' }}>
        {address ? (
          <div
            style={{
              width: '320px',
              margin: '0px auto',
            }}
          >
            <Profile address={address} />
          </div>
        ) : (
          <div
            style={{
              padding: '20px',
              width: '320px',
              margin: '0px auto',
            }}
          >
            <PlaceholderProfile />
          </div>
        )}
      </div>
      <TwitterBackground />
    </>
  )
}

export default TwitterClaim
