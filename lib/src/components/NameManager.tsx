import { getQueryParam } from '@cardinal/common'
import { breakName, formatName } from '@cardinal/namespaces'
import type { Wallet } from '@saberhq/solana-contrib'
import type { Connection } from '@solana/web3.js'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import { AiFillStar } from 'react-icons/ai'
import { BiUnlink } from 'react-icons/bi'

import { Alert } from '../common/Alert'
import { ButtonLight } from '../common/Button'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { useHandleSetDefault } from '../handlers/useHandleSetDefault'
import { useHandleUnlink } from '../handlers/useHandleUnlink'
import { useReverseEntry } from '../hooks/useReverseEntry'
import type { UserTokenData } from '../hooks/useUserNamesForNamespace'
import { useUserNamesForNamespace } from '../hooks/useUserNamesForNamespace'
import { formatIdentityLink } from '../utils/format'
import { BoltIcon } from './icons'
import { StepDetail } from './StepDetail'

export const nameFromMint = (name: string, uri: string): [string, string] => {
  if (uri.includes('name')) {
    return [name, decodeURIComponent(getQueryParam(uri, 'name') || '')]
  }
  return [breakName(name || '')[0], breakName(name || '')[1]]
}

export const NameEntryRow = ({
  cluster,
  connection,
  wallet,
  namespaceName,
  userTokenData,
  setError,
  setSuccess,
}: {
  cluster?: string
  connection: Connection
  wallet: Wallet
  namespaceName: string
  userTokenData: UserTokenData
  setError: (e: unknown) => void
  setSuccess: (e: ReactElement) => void
}) => {
  const userNamesForNamespace = useUserNamesForNamespace(
    connection,
    wallet.publicKey,
    namespaceName
  )
  const reverseEntry = useReverseEntry(
    connection,
    namespaceName,
    wallet.publicKey
  )
  const handleUnlink = useHandleUnlink(
    connection,
    wallet,
    namespaceName,
    userTokenData
  )
  const handleSetDefault = useHandleSetDefault(
    connection,
    wallet,
    namespaceName
  )
  useEffect(() => {
    if (handleUnlink.isLoading || handleSetDefault.isLoading) {
      setError(undefined)
    }
  }, [handleUnlink.isLoading, handleSetDefault.isLoading])
  return (
    <div className="flex items-center justify-between gap-5 px-2">
      <div
        className="cursor-point flex cursor-pointer items-center gap-1"
        style={{ fontSize: '14px' }}
      >
        {formatIdentityLink(
          nameFromMint(
            userTokenData.metaplexData?.parsed.data.name || '',
            userTokenData.metaplexData?.parsed.data.uri || ''
          )[1],
          nameFromMint(
            userTokenData.metaplexData?.parsed.data.name || '',
            userTokenData.metaplexData?.parsed.data.uri || ''
          )[0]
        )}
        {reverseEntry.data &&
          formatName(namespaceName, reverseEntry.data.parsed.entryName) ===
            formatName(
              ...nameFromMint(
                userTokenData.metaplexData?.parsed.data.name || '',
                userTokenData.metaplexData?.parsed.data.uri || ''
              )
            ) && <AiFillStar />}
      </div>
      <div className="flex items-center gap-2">
        {(!reverseEntry.data ||
          (reverseEntry.data &&
            formatName(namespaceName, reverseEntry.data.parsed.entryName) !==
              formatName(
                ...nameFromMint(
                  userTokenData.metaplexData?.parsed.data.name || '',
                  userTokenData.metaplexData?.parsed.data.uri || ''
                )
              ))) && (
          <ButtonLight
            onClick={() =>
              handleSetDefault.mutate(
                {
                  tokenData: userTokenData,
                },
                {
                  onSuccess: (txid) => {
                    userNamesForNamespace.remove()
                    reverseEntry.refetch()
                    setSuccess(
                      <div>
                        Succesfully set default with{' '}
                        <a
                          className="cursor-pointer text-blue-500"
                          target={`_blank`}
                          href={`https://explorer.solana.com/tx/${txid}?cluster=${cluster}`}
                        >
                          transaction
                        </a>
                        . Changes will be reflected shortly.
                      </div>
                    )
                  },
                  onError: (e) => setError(e),
                }
              )
            }
          >
            {handleSetDefault.isLoading ? (
              <LoadingSpinner height="15px" fill="#000" />
            ) : (
              <>Set Default</>
            )}
          </ButtonLight>
        )}
        <ButtonLight
          className="flex items-center gap-1"
          onClick={async () =>
            handleUnlink.mutate(
              {
                reverseNameEntryData:
                  reverseEntry.data &&
                  formatName(
                    namespaceName,
                    reverseEntry.data.parsed.entryName
                  ) ===
                    formatName(
                      ...nameFromMint(
                        userTokenData.metaplexData?.parsed.data.name || '',
                        userTokenData.metaplexData?.parsed.data.uri || ''
                      )
                    )
                    ? reverseEntry.data
                    : undefined,
              },
              {
                onSuccess: (txid) => {
                  userNamesForNamespace.remove()
                  reverseEntry.refetch()
                  setSuccess(
                    <div>
                      Succesfully unlinked{' '}
                      {formatIdentityLink(
                        nameFromMint(
                          userTokenData.metaplexData?.parsed.data.name || '',
                          userTokenData.metaplexData?.parsed.data.uri || ''
                        )[1],
                        nameFromMint(
                          userTokenData.metaplexData?.parsed.data.name || '',
                          userTokenData.metaplexData?.parsed.data.uri || ''
                        )[0]
                      )}
                      . Changes will be reflected shortly.{' '}
                      <a
                        className="cursor-pointer text-blue-500"
                        target={`_blank`}
                        href={`https://explorer.solana.com/tx/${txid}?cluster=${cluster}`}
                      >
                        transaction
                      </a>
                    </div>
                  )
                },
                onError: (e) => setError(e),
              }
            )
          }
        >
          {handleUnlink.isLoading ? (
            <LoadingSpinner height="15px" fill="#000" />
          ) : (
            <>
              <BiUnlink />
              Unlink
            </>
          )}
        </ButtonLight>
      </div>
    </div>
  )
}

export const NameManager = ({
  connection,
  wallet,
  namespaceName,
}: {
  cluster?: string
  connection: Connection
  wallet: Wallet
  namespaceName: string
}) => {
  const [error, setError] = useState<unknown>()
  const [success, setSuccess] = useState<ReactElement>()
  const handleSetDefault = useHandleSetDefault(
    connection,
    wallet,
    namespaceName
  )
  const userNamesForNamespace = useUserNamesForNamespace(
    connection,
    wallet.publicKey,
    namespaceName
  )
  const reverseEntry = useReverseEntry(
    connection,
    namespaceName,
    wallet.publicKey
  )
  return (
    <div className="mb-10 flex flex-col gap-2">
      <StepDetail
        icon={<BoltIcon />}
        title="Manage existing handles"
        description={<></>}
      />
      <div className="my-1 h-[1px] bg-gray-200"></div>
      {!userNamesForNamespace.isFetched || !reverseEntry.isFetched ? (
        <>
          <div className="h-8 w-full animate-pulse rounded-lg bg-gray-200"></div>
          <div className="h-8 w-full animate-pulse rounded-lg bg-gray-200"></div>
        </>
      ) : userNamesForNamespace.data?.length === 0 ? (
        <div className="px-2 text-gray-400">No names found</div>
      ) : (
        <>
          {userNamesForNamespace.data
            ?.sort((userTokenData) =>
              reverseEntry.data &&
              formatName(namespaceName, reverseEntry.data.parsed.entryName) ===
                formatName(
                  ...nameFromMint(
                    userTokenData.metaplexData?.parsed.data.name || '',
                    userTokenData.metaplexData?.parsed.data.uri || ''
                  )
                )
                ? -1
                : 1
            )
            .map((userTokenData) => (
              <NameEntryRow
                key={userTokenData.tokenAccount?.pubkey.toString()}
                connection={connection}
                wallet={wallet}
                namespaceName={namespaceName}
                userTokenData={userTokenData}
                setError={setError}
                setSuccess={setSuccess}
              />
            ))}
          {handleSetDefault.error && (
            <Alert
              style={{
                marginTop: '10px',
                height: 'auto',
                wordBreak: 'break-word',
                justifyContent: 'center',
              }}
              message={
                <>
                  <div>{`${handleSetDefault.error}`}</div>
                </>
              }
              type="error"
              showIcon
            />
          )}
          {error && (
            <Alert
              style={{
                marginTop: '10px',
                height: 'auto',
                wordBreak: 'break-word',
                justifyContent: 'center',
              }}
              message={
                <>
                  <div>{`${error}`}</div>
                </>
              }
              type="error"
              showIcon
            />
          )}
          {success && (
            <Alert
              style={{
                marginTop: '10px',
                height: 'auto',
                wordBreak: 'break-word',
                justifyContent: 'center',
              }}
              message={success}
              type="success"
              showIcon
            />
          )}
        </>
      )}
    </div>
  )
}
