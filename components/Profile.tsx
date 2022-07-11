import styled from '@emotion/styled'
import type { Wallet } from '@saberhq/solana-contrib'
import { useWallet } from '@solana/wallet-adapter-react'
import type { PublicKey } from '@solana/web3.js'
import { Connection } from '@solana/web3.js'
import { notify } from 'common/Notification'
import {
  ConnectButton,
  formatShortAddress,
  formatIdentityLink,
  useAddressImage,
  useAddressName,
  useWalletIdentity,
} from 'lib/src'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { FaShare, FaUserAlt } from 'react-icons/fa'

import { AddressLink } from './AddressLink'
import { Alert } from './Alert'

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
  const { query } = useRouter()
  const { linkingFlow, show } = useWalletIdentity()
  const wallet = useWallet()
  const { connection, environment } = useEnvironmentCtx()
  const dev = query['dev'] === 'true'
  const addressStr = address.toString()
  const { displayName, loadingName, refreshName } = useAddressName(
    connection,
    address
  )
  const { addressImage, loadingImage, addressNamespaceName } = useAddressImage(
    connection,
    address,
    dev
  )

  return (
    <div
      style={{
        padding: '1.5rem',
        borderRadius: '1rem',
        // boxShadow: '0 0 80px 50px rgba(255, 255, 255, 0.3)',
        boxShadow: '0 4px 34px rgb(0 0 0 / 30%)',
        background: linkingFlow.colors.secondary,
      }}
    >
      <div style={{ marginBottom: '30px' }}>
        {loadingName ? (
          <Alert message={'Loading'} type="warning" />
        ) : displayName ? (
          <Alert
            message={
              linkingFlow.name === 'default'
                ? `Default identity set ${
                    addressNamespaceName
                      ? 'to ' +
                        addressNamespaceName[0]!.toUpperCase() +
                        addressNamespaceName.substring(1)
                      : ''
                  }`
                : `Succesfully linked ${linkingFlow.displayName || ''}`
            }
            type="success"
          />
        ) : (
          <Alert
            message={
              linkingFlow.name === 'default'
                ? 'No global identity set'
                : `${linkingFlow.displayName} not linked`
            }
            type="warning"
          />
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
          <div
            style={{
              height: '156px',
              width: '156px',
              borderRadius: '50%',
              background: linkingFlow.colors.buttonColor,
            }}
            className="animate-pulse"
          ></div>
        ) : addressImage ? (
          <div
            style={{
              position: 'relative',
              height: '156px',
              width: '156px',
              borderRadius: '50%',
              background: linkingFlow.colors.primary,
              backgroundImage: linkingFlow.colors.primary,
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
            <FaUserAlt style={{ fontSize: '100px', color: '#FFF' }} />
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
                className="animate-pulse rounded-md"
                style={{
                  height: '24px',
                  width: '120px',
                  background: linkingFlow.colors.buttonColor,
                }}
              ></div>
            ) : (
              <div style={{ display: 'flex', gap: '5px' }}>
                {formatIdentityLink(displayName, addressNamespaceName) ||
                  formatShortAddress(address)}
              </div>
            )}
          </span>
          <AddressLink address={address} />
          {linkingFlow.name === 'default' && addressNamespaceName && (
            <span
              className="rounded-md border-2 text-sm"
              style={{ color: '#717174' }}
            >
              {addressNamespaceName[0]!.toUpperCase() +
                addressNamespaceName.substring(1)}
            </span>
          )}
        </div>
        <div className="mt-5">
          <ConnectButton
            disabled={address?.toString() !== wallet?.publicKey?.toString()}
            dev={dev}
            wallet={wallet as Wallet}
            connection={connection}
            secondaryConnection={
              environment.secondary
                ? new Connection(environment.secondary)
                : connection
            }
            onClose={refreshName}
            cluster={environment.label}
          />
        </div>
        {linkingFlow.name !== 'default' && (
          <button
            disabled={address?.toString() !== wallet?.publicKey?.toString()}
            className="rounded-md px-3 py-1 text-xs text-white"
            onClick={() =>
              show({
                wallet: wallet as Wallet,
                connection: connection,
                cluster: environment.label,
                secondaryConnection: environment.secondary
                  ? new Connection(environment.secondary)
                  : connection,
                dev,
                showManage: true,
              })
            }
            style={{
              borderColor: '#657786',
              background: linkingFlow.colors.buttonColor,
              color: linkingFlow.colors.secondaryFontColor,
              opacity:
                address?.toString() !== wallet?.publicKey?.toString() ? 0.5 : 1,
            }}
          >
            Manage Profiles
          </button>
        )}
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
        <Alert message={'Connect wallet to continue'} type="warning" />
      </div>
      <div className="flex flex-col items-center justify-center">
        <div
          className="animate-pulse bg-gray-200"
          style={{
            height: '156px',
            width: '156px',
            borderRadius: '50%',
            marginBottom: '15px',
          }}
        />
        <div
          style={{ height: '24px', width: '120px', marginBottom: '5px' }}
          className="animate-pulse rounded-md bg-gray-200"
        />
        <div
          style={{ height: '24px', width: '100px', marginBottom: '50px' }}
          className="animate-pulse rounded-md bg-gray-200"
        />
      </div>
    </div>
  )
}
