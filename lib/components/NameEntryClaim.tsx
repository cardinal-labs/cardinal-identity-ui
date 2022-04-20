import styled from '@emotion/styled'
import type { Wallet } from '@saberhq/solana-contrib'
import type { Connection } from '@solana/web3.js'
import { useEffect, useState } from 'react'

import { Alert } from '../common/Alert'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { useClaimRequest } from '../hooks/useClaimRequest'
import { useNameEntryData } from '../hooks/useNameEntryData'
import { useReverseEntry } from '../hooks/useReverseEntry'
import {
  apiBase,
  claimEntry,
  initAndClaimEntry,
  revokeAndClaim,
  setReverseEntry,
  tryGetNameEntry,
} from '../utils/api'
import { formatShortAddress, formatTwitterLink } from '../utils/format'
import { ButtonWithFooter } from './ButtonWithFooter'
import { Link, Megaphone, Verified } from './icons'
import { LabeledInput } from './LabeledInput'
import { PostTweet } from './PostTweet'
import { PoweredByFooter } from './PoweredByFooter'
import { StepDetail } from './StepDetail'
import { TwitterHandleNFT } from './TwitterHandleNFT'

const handleFromTweetUrl = (raw: string | undefined): string | undefined => {
  if (!raw) return undefined
  return raw.split('/')[3]
}

const tweetIdFromTweetUrl = (raw: string | undefined): string | undefined => {
  if (!raw) return undefined
  return raw.split('/')[5]?.split('?')[0]
}

export const NameEntryClaim = ({
  dev = false,
  cluster = 'mainnet',
  connection,
  wallet,
  namespaceName = 'twitter',
  appName,
  appTwitter,
  notify,
  onComplete,
}: {
  dev?: boolean
  cluster?: string
  connection: Connection | null
  wallet: Wallet | null
  namespaceName?: string
  appName?: string
  appTwitter?: string
  notify?: (arg: { message?: string; txid?: string }) => void
  onComplete?: (arg0: string) => void
}) => {
  const [verifyError, setVerifyError] = useState<React.ReactNode | undefined>(
    undefined
  )
  const [ownedError, setOwnedError] = useState<React.ReactNode | undefined>(
    undefined
  )
  const [claimError, setClaimError] = useState<React.ReactNode | undefined>(
    undefined
  )
  const [loadingVerify, setLoadingVerify] = useState(false)
  const [loadingRevoke, setLoadingRevoke] = useState(false)
  const [loadingClaim, setLoadingClaim] = useState(false)

  const [tweetSent, setTweetSent] = useState(false)
  const [tweetUrl, setTweetUrl] = useState<string | undefined>(undefined)
  const handle = handleFromTweetUrl(tweetUrl)
  const tweetId = tweetIdFromTweetUrl(tweetUrl)
  const [claimed, setClaimed] = useState(false)

  const { reverseEntryData, getReverseEntryData } = useReverseEntry(
    connection,
    wallet?.publicKey
  )

  const { nameEntryData, loadingNameEntry, refreshNameEntryData } =
    useNameEntryData(connection, namespaceName, handle)

  const { claimRequest, loadingClaimRequest, getClaimRequestData } =
    useClaimRequest(connection, namespaceName, handle, wallet?.publicKey)

  const verifyTwitter = async () => {
    setLoadingVerify(true)
    setVerifyError(undefined)
    setOwnedError(undefined)
    try {
      const response = await fetch(
        `${apiBase(
          dev
        )}/twitter/approve?tweetId=${tweetId}&publicKey=${wallet?.publicKey.toString()}&handle=${handle}${
          cluster && `&cluster=${cluster}`
        }`
      )
      const json = await response.json()
      if (response.status !== 200) throw new Error(json.error)
    } catch (e) {
      setVerifyError(`Failed to approve tweet url: ${e}`)
    } finally {
      await getClaimRequestData()
      setLoadingVerify(false)
    }
  }

  const revokeHandle = async () => {
    setLoadingRevoke(true)
    setOwnedError(undefined)
    try {
      const response = await fetch(
        `${apiBase(
          dev
        )}/twitter/revoke?tweetId=${tweetId}&publicKey=${wallet?.publicKey.toString()}&handle=${handle}${
          cluster && `&cluster=${cluster}`
        }`
      )
      await refreshNameEntryData()
      const json = await response.json()
      if (response.status !== 200) throw new Error(json.error)
    } catch (e) {
      setOwnedError(`Failed to revoke tweet url: ${e}`)
    } finally {
      setLoadingRevoke(false)
    }
  }

  const setDefault = async () => {
    setLoadingRevoke(true)
    setOwnedError(undefined)
    try {
      if (!handle) throw new Error('Handle not found')
      if (!connection) throw new Error('Connection not found')
      if (!wallet) throw new Error('Wallet not connected')
      console.log('Setting reverse entry entry:', handle)
      const txid = await setReverseEntry(
        connection,
        wallet,
        namespaceName,
        handle,
        nameEntryData?.nameEntry.parsed.mint!
      )
      notify && notify({ message: 'Set default successful', txid })
      setClaimed(true)
      onComplete && onComplete(handle)
    } catch (e) {
      console.log(e)
      setOwnedError(`Failed to set default handle: ${e}`)
    } finally {
      setLoadingRevoke(false)
    }
  }

  useEffect(() => {
    if (
      tweetUrl &&
      tweetSent &&
      (!claimRequest || !claimRequest?.parsed?.isApproved)
    ) {
      verifyTwitter()
    }
  }, [wallet, tweetUrl, handle, tweetSent, tweetId, claimRequest])

  const handleClaim = async () => {
    try {
      if (!handle) throw new Error('Handle not found')
      if (!connection) throw new Error('Connection not found')
      if (!wallet) throw new Error('Wallet not connected')
      setLoadingClaim(true)
      setClaimError(undefined)
      const checkNameEntry = await tryGetNameEntry(
        connection,
        namespaceName,
        handle
      )
      if (!checkNameEntry) {
        console.log('Initializing and claiming entry:', handle)
        const txid = await initAndClaimEntry(
          cluster,
          connection,
          wallet,
          namespaceName,
          handle,
          null
        )
        notify && notify({ message: 'Claim successful', txid })
        setClaimed(true)
        onComplete && onComplete(handle)
      } else if (checkNameEntry && !checkNameEntry.parsed.isClaimed) {
        console.log('Claiming entry:', handle)
        const txid = await claimEntry(
          connection,
          wallet,
          namespaceName,
          handle,
          checkNameEntry.parsed.mint,
          null
        )
        notify && notify({ message: 'Claim successful', txid })
        setClaimed(true)
        onComplete && onComplete(handle)
      } else {
        console.log('Revoking and claiming entry:', handle)
        const txid = await revokeAndClaim(
          cluster,
          connection,
          wallet,
          namespaceName,
          handle,
          null,
          reverseEntryData?.pubkey!,
          claimRequest!.pubkey,
          checkNameEntry.parsed.mint,
          nameEntryData!.owner!
        )
        notify && notify({ message: 'Init and claim successful', txid })
        setClaimed(true)
        onComplete && onComplete(handle)
      }
    } catch (e: any) {
      if (e?.message.includes('0x1')) {
        setClaimError(<>Not enough sol!</>)
      } else {
        setClaimError(<>Failed to claim: {e?.message}</>)
      }
    } finally {
      refreshNameEntryData()
      getReverseEntryData()
      setLoadingClaim(false)
    }
  }

  const alreadyOwned =
    nameEntryData &&
    nameEntryData.owner?.toString() &&
    !nameEntryData.isOwnerPDA
      ? true
      : false

  return (
    <Wrapper>
      <Instruction>
        {appName ? `${appName} uses` : 'Use'} Cardinal to link your Twitter
        identity to your <strong>Solana</strong> address.
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
      {reverseEntryData?.parsed.entryName && (
        <Alert
          style={{ marginBottom: '20px', width: '100%' }}
          message={
            <>
              <div>
                Your address is linked to{' '}
                {formatTwitterLink(
                  reverseEntryData?.parsed.entryName as string
                )}
                . You can change your Twitter handle by linking a new profile.
              </div>
            </>
          }
          type="info"
          showIcon
        />
      )}
      <DetailsWrapper>
        <StepDetail
          disabled={!wallet?.publicKey || !connection}
          icon={<Megaphone />}
          title="Tweet!"
          description={
            <>
              <div>Tweet your public key</div>
              <PostTweet
                wallet={wallet}
                appName={appName}
                appTwitter={appTwitter}
                disabled={false}
                callback={() => setTweetSent(true)}
                cluster={cluster}
              />
            </>
          }
        />
        <StepDetail
          disabled={!tweetSent}
          icon={<Link />}
          title="Paste the URL of the tweet"
          description={
            <div>
              <LabeledInput
                disabled={!tweetSent}
                label="Tweet"
                name="tweet"
                onChange={(e) => setTweetUrl(e.target.value)}
              />
            </div>
          }
        />
        <StepDetail
          disabled={!handle}
          icon={<Verified />}
          title="Claim your handle"
          description={
            <>
              <div>
                You will receive a non-tradeable NFT to prove you own your
                Twitter handle.
              </div>
              {handle && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    paddingTop: '20px',
                  }}
                >
                  <TwitterHandleNFT
                    handle={handle}
                    cluster={cluster}
                    dev={dev}
                  />
                  <div
                    style={{
                      padding: '10px',
                      maxWidth: 'calc(100% - 120px - 20px)',
                    }}
                  >
                    {claimRequest && claimRequest.parsed.isApproved ? (
                      <StyledAlert>
                        <Alert
                          style={{
                            margin: '10px 0px',
                            height: 'auto',
                            wordBreak: 'break-word',
                          }}
                          message={
                            <>
                              <div>
                                Verified ownership of{' '}
                                {formatTwitterLink(handle)}
                              </div>
                            </>
                          }
                          type="success"
                          showIcon
                        />
                      </StyledAlert>
                    ) : loadingVerify || loadingClaimRequest ? (
                      <div style={{ padding: '10px' }}>
                        <LoadingSpinner fill="#000" />
                      </div>
                    ) : (
                      <StyledAlert>
                        <Alert
                          style={{
                            marginTop: '10px',
                            height: 'auto',
                            wordBreak: 'break-word',
                          }}
                          message={
                            <>
                              <div>{verifyError}</div>
                            </>
                          }
                          type="error"
                          showIcon
                        />
                        <ButtonWrapper>
                          <ButtonLight onClick={() => verifyTwitter()}>
                            Retry
                          </ButtonLight>
                        </ButtonWrapper>
                      </StyledAlert>
                    )}
                    {claimRequest &&
                      claimRequest.parsed.isApproved &&
                      !claimed &&
                      (loadingNameEntry || loadingRevoke ? (
                        <div style={{ padding: '10px' }}>
                          <LoadingSpinner fill="#000" />
                        </div>
                      ) : (
                        alreadyOwned && (
                          <>
                            <Alert
                              style={{
                                marginBottom: '10px',
                                height: 'auto',
                                wordBreak: 'break-word',
                              }}
                              message={
                                <>
                                  <div>
                                    Owned by{' '}
                                    {formatShortAddress(nameEntryData?.owner)}
                                  </div>
                                </>
                              }
                              type="warning"
                              showIcon
                            />
                            {nameEntryData?.owner?.toString() ===
                            wallet?.publicKey?.toString() ? (
                              <>
                                <div>
                                  You already own this handle! If you want to
                                  set it as your default, click below.
                                </div>
                                <ButtonWrapper>
                                  <ButtonLight onClick={() => setDefault()}>
                                    Set Default
                                  </ButtonLight>
                                </ButtonWrapper>
                              </>
                            ) : (
                              <>
                                <div>
                                  If you wish to continue, you will revoke this
                                  handle from them.
                                </div>
                                <ButtonWrapper>
                                  <ButtonLight onClick={() => revokeHandle()}>
                                    Revoke
                                  </ButtonLight>
                                </ButtonWrapper>
                              </>
                            )}
                            {ownedError && (
                              <StyledAlert>
                                <Alert
                                  style={{
                                    marginTop: '10px',
                                    height: 'auto',
                                    wordBreak: 'break-word',
                                  }}
                                  message={
                                    <>
                                      <div>{ownedError}</div>
                                    </>
                                  }
                                  type="error"
                                  showIcon
                                />
                              </StyledAlert>
                            )}
                          </>
                        )
                      ))}
                    {claimError && (
                      <StyledAlert>
                        <Alert
                          style={{ marginTop: '10px', height: 'auto' }}
                          message={
                            <>
                              <div>{claimError}</div>
                            </>
                          }
                          type="error"
                          showIcon
                        />
                      </StyledAlert>
                    )}
                  </div>
                </div>
              )}
            </>
          }
        />
      </DetailsWrapper>
      <ButtonWithFooter
        loading={loadingClaim}
        complete={claimed}
        disabled={
          !claimRequest ||
          !claimRequest.parsed.isApproved ||
          loadingNameEntry ||
          alreadyOwned
        }
        onClick={handleClaim}
        footer={<PoweredByFooter />}
      >
        Claim {handle && `@${handle}`}
      </ButtonWithFooter>
    </Wrapper>
  )
}

const ButtonWrapper = styled.div`
  display: flex;
  margin-top: 5px;
  justify-content: center;
`

const ButtonLight = styled.div`
  border-radius: 5px;
  padding: 5px 8px;
  border: none;
  background: #eee;
  color: #777;
  cursor: pointer;
  transition: 0.1s all;
  &:hover {
    background: #ddd;
  }
`

const StyledAlert = styled.div``

const Wrapper = styled.div`
  padding: 10px 28px 28px 28px;
`

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

const DetailsWrapper = styled.div`
  display: grid;
  grid-row-gap: 28px;
`
