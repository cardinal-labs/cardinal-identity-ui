import styled from '@emotion/styled'
import type { Wallet } from '@saberhq/solana-contrib'
import type { Cluster, Connection } from '@solana/web3.js'
import { useUserNamesForNamespace } from '../hooks/useUserNamesForNamespace'
import { useState } from 'react'

import { Alert } from '../common/Alert'
import { Button, ButtonLight } from '../common/Button'
import { LinkingFlow, linkingFlows } from '../common/LinkingFlows'
import { useReverseEntry } from '../hooks/useReverseEntry'
import { useWalletIdentity } from '../providers/WalletIdentityProvider'
import { formatIdentityLink } from '../utils/format'
import { ConnectButton } from './ConnectButton'
import { NameEntryClaim } from './NameEntryClaim'
import { NameManager } from './NameManager'
import { PoweredByFooter } from './PoweredByFooter'
import { nameFromMint } from './NameManager'

export type ClaimCardProps = {
  dev?: boolean
  cluster?: Cluster
  wallet?: Wallet
  connection?: Connection
  secondaryConnection?: Connection
  appName?: string
  appTwitter?: string
  namespaceName: string
  showManage?: boolean
  notify?: (arg: { message?: string; txid?: string }) => void
  onComplete?: (arg: string) => void
}

export const ClaimCard = ({
  appName,
  appTwitter,
  dev,
  cluster,
  connection,
  secondaryConnection,
  wallet,
  notify,
  onComplete,
  showManage: showManageDefault,
  namespaceName,
}: ClaimCardProps) => {
  const { linkingFlow } = useWalletIdentity()
  const [showManage, setShowManage] = useState(showManageDefault)
  const reverseEntry = useReverseEntry(
    connection,
    namespaceName,
    wallet?.publicKey
  )
  return (
    <div className="relative px-2 pb-8 md:px-8 md:pt-2">
      {linkingFlow.name === 'default' ? (
        <>
          <Instruction>
            {appName ? `${appName} uses` : 'Use'} Cardinal to link your online
            identities to your <strong>Solana</strong> address.
          </Instruction>
          {(!wallet?.publicKey || !connection) && (
            <Alert
              style={{ marginBottom: '20px' }}
              message={
                <>
                  <div>Connect wallet to continue</div>
                </>
              }
              type="warning"
              showIcon
            />
          )}
          <div className="my-5 text-center text-lg font-medium text-black">
            <hr
              style={{
                height: '1px',
                border: 'none',
                color: '#333',
                backgroundColor: '#333',
                marginBottom: '5px',
              }}
            />
            <span>Choose the identity you want to link</span>
            <hr
              style={{
                height: '1px',
                border: 'none',
                color: '#333',
                backgroundColor: '#333',
                marginTop: '5px',
              }}
            />
          </div>
          <div className="flex flex-col gap-3">
            {Object.entries(linkingFlows).map(([name, flow]) => {
              if (name === 'default' || !connection || !wallet) return ''
              return (
                <>
                  <div className="mt-5 flex flex-row">
                    <span className="text-lg font-semibold text-black">
                      {flow.displayName}
                    </span>
                  </div>
                  <div className="flex flex-row justify-between">
                    <LinkedHandles
                      connection={connection}
                      wallet={wallet}
                      linkingFlow={flow}
                    />
                    <ConnectButton
                      dev={dev}
                      wallet={wallet as Wallet}
                      connection={connection}
                      forceFlow={flow}
                      cluster={dev ? 'devnet' : 'mainnet-beta'}
                    />
                  </div>
                </>
              )
            })}
          </div>
        </>
      ) : (
        <>
          <Instruction>
            {appName ? `${appName} uses` : 'Use'} Cardinal to link your{' '}
            {linkingFlow.displayName} identity to your <strong>Solana</strong>{' '}
            address.
          </Instruction>
          {(!wallet?.publicKey || !connection) && (
            <Alert
              style={{ marginBottom: '20px' }}
              message={
                <>
                  <div>Connect wallet to continue</div>
                </>
              }
              type="warning"
              showIcon
            />
          )}
          {!reverseEntry.isFetching && reverseEntry.data?.parsed.entryName && (
            <Alert
              style={{ marginBottom: '20px', width: '100%' }}
              message={
                <>
                  <div>
                    Your address is linked to{' '}
                    {formatIdentityLink(
                      reverseEntry.data?.parsed.entryName,
                      reverseEntry.data?.parsed.namespaceName
                    )}
                    . Link a new {linkingFlow.displayName} handle below.
                  </div>
                </>
              }
              type="info"
              showIcon
            />
          )}
          {connection && wallet?.publicKey && (
            <ButtonLight
              className="absolute right-8 z-10"
              onClick={() => setShowManage((m) => !m)}
            >
              {showManage ? 'Back to linking' : 'Manage linked accounts'}
            </ButtonLight>
          )}
          {connection &&
            wallet &&
            (showManage ? (
              <NameManager
                cluster={cluster}
                connection={connection}
                wallet={wallet}
                namespaceName={namespaceName}
              />
            ) : (
              <NameEntryClaim
                dev={dev}
                cluster={cluster}
                wallet={wallet}
                connection={connection}
                namespaceName={linkingFlow.name}
                secondaryConnection={secondaryConnection}
                appName={appName}
                appTwitter={appTwitter}
                setShowManage={setShowManage}
                notify={notify}
                onComplete={onComplete}
              />
            ))}
          <PoweredByFooter />
        </>
      )}
    </div>
  )
}

const LinkedHandles = ({
  connection,
  wallet,
  linkingFlow,
}: {
  connection: Connection
  wallet: Wallet
  linkingFlow: LinkingFlow
}) => {
  const userNamesForNamespace = useUserNamesForNamespace(
    connection,
    wallet.publicKey,
    linkingFlow.name
  )
  return (
    <>
      {userNamesForNamespace?.data && userNamesForNamespace?.data.length > 0 ? (
        <div className="mt-auto">
          {userNamesForNamespace.data.map((userTokenData) => (
            <div className="text-sm">
              {formatIdentityLink(
                nameFromMint(
                  userTokenData.metaplexData?.parsed.data.name || '',
                  userTokenData.metaplexData?.parsed.data.uri || ''
                )[1],
                linkingFlow.name
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-auto text-sm">No accounts linked</div>
      )}
    </>
  )
}

const Instruction = styled.h2`
  margin-top: 0px;
  margin-bottom: 20px;
  font-weight: normal;
  font-size: 24px;
  line-height: 30px;
  text-align: center;
  letter-spacing: -0.02em;
  color: #000000;
`
