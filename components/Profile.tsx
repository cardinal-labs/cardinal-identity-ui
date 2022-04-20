import {
  ConnectTwitterButton,
  formatShortAddress,
} from '@cardinal/namespaces-components'
import styled from '@emotion/styled'
import { useWallet } from '@solana/wallet-adapter-react'
import type { PublicKey } from '@solana/web3.js'
import { notify } from 'common/Notification'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import ContentLoader from 'react-content-loader'
import { FaShare, FaUserAlt } from 'react-icons/fa'

import { AddressLink } from './AddressLink'
import { Alert } from './Alert'
import { useAddressImage } from './useAddressImage'
import { formatTwitterLink, useAddressName } from './useAddressName'

interface Props {
  address: PublicKey
}

const ShareIcon = styled.div`
  cursor: pointer;
  transition: 0.1s all;
  &: hover {
    transform: scale(1.05);
  }
`

export const Profile: React.FC<Props> = ({ address }: Props) => {
  const router = useRouter()
  const wallet = useWallet()
  const { connection, environment } = useEnvironmentCtx()
  const dev = router.query['dev'] === 'true'
  const addressStr = address.toString()
  const { displayName, loadingName } = useAddressName(address)
  const { addressImage, loadingImage } = useAddressImage(address, dev)
  return (
    <div
      style={{
        padding: '1.5rem',
        borderRadius: '1rem',
        // boxShadow: '0 0 80px 50px rgba(255, 255, 255, 0.3)',
        boxShadow: '0 4px 34px rgb(0 0 0 / 30%)',
        background: '#FFF',
      }}
    >
      <div style={{ marginBottom: '30px' }}>
        {loadingName ? (
          <Alert message={'Loading'} type="warning" />
        ) : displayName ? (
          <Alert message={'Succesfully linked Twitter'} type="success" />
        ) : (
          <Alert message={'Twitter not linked'} type="warning" />
        )}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          alignItems: 'center',
        }}
      >
        {loadingImage ? (
          <div style={{ height: '150px', width: '150px', borderRadius: '50%' }}>
            <ContentLoader>
              <rect x="0" y="0" rx="5" ry="5" width="150" height="150" />
            </ContentLoader>
          </div>
        ) : addressImage ? (
          <div
            style={{
              position: 'relative',
              height: '156px',
              width: '156px',
              borderRadius: '50%',
              background: '#fff',
              backgroundImage: 'linear-gradient(84.06deg, #23a6d5, #1da1f2)',
              boxShadow: '0 5px 10px 0 rgb(97 83 202 / 30%)',
              padding: '5px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              style={{
                height: '150px',
                width: '150px',
                borderRadius: '50%',
                border: '4px solid white',
              }}
              alt={`profile-${addressStr}`}
              src={addressImage}
            ></img>
            <ShareIcon
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                notify({
                  message: 'Share link copied',
                  placement: 'bottom-right',
                })
              }}
              style={{
                position: 'absolute',
                fontSize: '12px',
                right: '-10px',
                bottom: '-5px',
                color: 'rgb(101,119,134,1)',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: 'rgba(100,116,139,0.1)',
              }}
            >
              <FaShare />
            </ShareIcon>
          </div>
        ) : (
          <div
            style={{
              height: '156px',
              width: '156px',
              borderRadius: '50%',
              background: '#DDD',
              boxShadow: '0 5px 10px 0 rgb(97 83 202 / 30%)',
              padding: '10px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FaUserAlt style={{ fontSize: '120px', color: '#FFF' }} />
          </div>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '16px' }}>
            {loadingName ? (
              <div
                style={{ height: '16px', width: '140px', borderRadius: '50%' }}
              >
                <ContentLoader>
                  <rect x="0" y="0" rx="5" ry="5" width="140" height="13" />
                </ContentLoader>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '5px' }}>
                {formatTwitterLink(displayName) || formatShortAddress(address)}
              </div>
            )}
          </span>
          <AddressLink address={address} />
        </div>
        <div style={{ margin: '10px auto' }}>
          <ConnectTwitterButton
            disabled={address?.toString() !== wallet?.publicKey?.toString()}
            // @ts-ignore
            address={wallet.publicKey}
            dev={dev}
            // @ts-ignore
            wallet={wallet}
            connection={connection}
            cluster={environment.label}
          />
        </div>
      </div>
    </div>
  )
}

export const PlaceholderProfile: React.FC = () => {
  return (
    <div
      style={{
        padding: '1.5rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 34px rgb(0 0 0 / 8%)',
        background: '#FFF',
      }}
    >
      <div style={{ marginBottom: '40px' }}>
        <Alert
          message={'Connect wallet to continue'}
          type="warning"
          // showIcon
        />
      </div>
      <ContentLoader viewBox="0 0 320 280">
        <rect x="80" y="0" rx="5" ry="5" width="160" height="160" />
        <rect x="90" y="180" rx="4" ry="4" width="140" height="13" />
        <rect x="100" y="200" rx="3" ry="3" width="120" height="10" />
      </ContentLoader>
    </div>
  )
}
