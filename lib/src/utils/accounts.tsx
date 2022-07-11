import type { CertificateData } from '@cardinal/certificates'
import { CERTIFICATE_IDL, CERTIFICATE_PROGRAM_ID } from '@cardinal/certificates'
import { getBatchedMultipleAccounts } from '@cardinal/common'
import type { AccountData } from '@cardinal/token-manager'
import type { PaidClaimApproverData } from '@cardinal/token-manager/dist/cjs/programs/claimApprover'
import {
  CLAIM_APPROVER_ADDRESS,
  CLAIM_APPROVER_IDL,
} from '@cardinal/token-manager/dist/cjs/programs/claimApprover'
import type { TimeInvalidatorData } from '@cardinal/token-manager/dist/cjs/programs/timeInvalidator'
import {
  TIME_INVALIDATOR_ADDRESS,
  TIME_INVALIDATOR_IDL,
} from '@cardinal/token-manager/dist/cjs/programs/timeInvalidator'
import type { TokenManagerData } from '@cardinal/token-manager/dist/cjs/programs/tokenManager'
import {
  TOKEN_MANAGER_ADDRESS,
  TOKEN_MANAGER_IDL,
} from '@cardinal/token-manager/dist/cjs/programs/tokenManager'
import type { UseInvalidatorData } from '@cardinal/token-manager/dist/cjs/programs/useInvalidator'
import {
  USE_INVALIDATOR_ADDRESS,
  USE_INVALIDATOR_IDL,
} from '@cardinal/token-manager/dist/cjs/programs/useInvalidator'
import * as metaplex from '@metaplex-foundation/mpl-token-metadata'
import {
  EditionData,
  MasterEditionV2Data,
  MetadataKey,
} from '@metaplex-foundation/mpl-token-metadata'
import { BorshAccountsCoder } from '@project-serum/anchor'
import * as spl from '@solana/spl-token'
import type {
  AccountInfo,
  Connection,
  GetMultipleAccountsConfig,
  ParsedAccountData,
  PublicKey,
} from '@solana/web3.js'

export type AccountType =
  | 'metaplexMetadata'
  | 'editionData'
  | 'certificate'
  | 'tokenManager'
  | 'mint'
  | 'tokenAccount'
  | 'timeInvalidator'
  | 'paidClaimApprover'
  | 'useInvalidator'
  | 'stakePool'

export type AccountTypeData = {
  type: AccountType
  displayName?: string
}

export type AccountDataById = {
  [accountId: string]:
    | (AccountData<CertificateData> & AccountInfo<Buffer> & AccountTypeData)
    | (AccountData<TokenManagerData> & AccountInfo<Buffer> & AccountTypeData)
    | (AccountData<PaidClaimApproverData> &
        AccountInfo<Buffer> &
        AccountTypeData)
    | (AccountData<TimeInvalidatorData> & AccountInfo<Buffer> & AccountTypeData)
    | (AccountData<UseInvalidatorData> & AccountInfo<Buffer> & AccountTypeData)
    | (spl.AccountInfo & AccountTypeData)
    | (spl.MintInfo & AccountInfo<Buffer> & AccountTypeData)
    | (AccountData<metaplex.MetadataData> &
        AccountInfo<Buffer> &
        AccountTypeData)
    | (AccountData<metaplex.EditionData> &
        AccountInfo<Buffer> &
        AccountTypeData)
    | (AccountData<metaplex.MasterEditionData> &
        AccountInfo<Buffer> &
        AccountTypeData)
    | (AccountData<undefined> & AccountInfo<Buffer> & AccountTypeData)
}

export const deserializeAccountInfos = (
  accountIds: (PublicKey | null)[],
  accountInfos: (AccountInfo<Buffer | ParsedAccountData> | null)[]
): AccountDataById => {
  return accountInfos.reduce((acc, accountInfo, i) => {
    const ownerString = accountInfo?.owner.toString()
    switch (ownerString) {
      case CERTIFICATE_PROGRAM_ID.toString():
        try {
          const type = 'certificate'
          const coder = new BorshAccountsCoder(CERTIFICATE_IDL)
          const parsed = coder.decode(
            type,
            accountInfo?.data as Buffer
          ) as CertificateData
          acc[accountIds[i]!.toString()] = {
            type,
            pubkey: accountIds[i]!,
            ...(accountInfo as AccountInfo<Buffer>),
            parsed,
          }
        } catch (e) {}
        return acc
      case TOKEN_MANAGER_ADDRESS.toString():
        try {
          const type = 'tokenManager'
          const coder = new BorshAccountsCoder(TOKEN_MANAGER_IDL)
          const parsed = coder.decode(
            type,
            accountInfo?.data as Buffer
          ) as TokenManagerData
          acc[accountIds[i]!.toString()] = {
            type,
            pubkey: accountIds[i]!,
            ...(accountInfo as AccountInfo<Buffer>),
            parsed,
          }
        } catch (e) {}
        return acc
      case TIME_INVALIDATOR_ADDRESS.toString():
        try {
          const type = 'timeInvalidator'
          const coder = new BorshAccountsCoder(TIME_INVALIDATOR_IDL)
          const parsed = coder.decode(
            type,
            accountInfo?.data as Buffer
          ) as TimeInvalidatorData
          acc[accountIds[i]!.toString()] = {
            type,
            pubkey: accountIds[i]!,
            ...(accountInfo as AccountInfo<Buffer>),
            parsed,
          }
        } catch (e) {}
        return acc
      case USE_INVALIDATOR_ADDRESS.toString():
        try {
          const type = 'useInvalidator'
          const coder = new BorshAccountsCoder(USE_INVALIDATOR_IDL)
          const parsed = coder.decode(
            type,
            accountInfo?.data as Buffer
          ) as UseInvalidatorData
          acc[accountIds[i]!.toString()] = {
            type,
            pubkey: accountIds[i]!,
            ...(accountInfo as AccountInfo<Buffer>),
            parsed,
          }
        } catch (e) {}
        return acc
      case CLAIM_APPROVER_ADDRESS.toString():
        try {
          const type = 'paidClaimApprover'
          const coder = new BorshAccountsCoder(CLAIM_APPROVER_IDL)
          const parsed = coder.decode(
            type,
            accountInfo?.data as Buffer
          ) as PaidClaimApproverData
          acc[accountIds[i]!.toString()] = {
            type,
            pubkey: accountIds[i]!,
            ...(accountInfo as AccountInfo<Buffer>),
            parsed,
          }
        } catch (e) {}
        return acc
      case spl.TOKEN_PROGRAM_ID.toString():
        const accountData = accountInfo?.data as ParsedAccountData
        acc[accountIds[i]!.toString()] =
          accountData.space === spl.MintLayout.span
            ? {
                type: 'mint',
                ...(accountInfo as AccountInfo<Buffer>),
                ...(accountData.parsed?.info as spl.MintInfo),
              }
            : {
                type: 'tokenAccount',
                ...(accountInfo as AccountInfo<Buffer>),
                ...(accountData.parsed?.info as spl.AccountInfo),
              }
        return acc
      case metaplex.MetadataProgram.PUBKEY.toString():
        try {
          acc[accountIds[i]!.toString()] = {
            type: 'metaplexMetadata',
            pubkey: accountIds[i]!,
            parsed: metaplex.MetadataData.deserialize(
              accountInfo?.data as Buffer
            ) as metaplex.MetadataData,
            ...(accountInfo as AccountInfo<Buffer>),
          }
        } catch (e) {}
        try {
          const key =
            accountInfo === null || accountInfo === void 0
              ? void 0
              : (accountInfo.data as Buffer)[0]
          let parsed
          if (key === MetadataKey.EditionV1) {
            parsed = EditionData.deserialize(accountInfo?.data as Buffer)
          } else if (
            key === MetadataKey.MasterEditionV1 ||
            key === MetadataKey.MasterEditionV2
          ) {
            parsed = MasterEditionV2Data.deserialize(
              accountInfo?.data as Buffer
            )
          }
          if (parsed) {
            acc[accountIds[i]!.toString()] = {
              type: 'editionData',
              pubkey: accountIds[i]!,
              parsed,
              ...(accountInfo as AccountInfo<Buffer>),
            }
          }
        } catch (e) {}
        return acc
      default:
        return acc
    }
  }, {} as AccountDataById)
}

export const accountDataById = async (
  connection: Connection,
  ids: (PublicKey | null)[]
): Promise<AccountDataById> => {
  const filteredIds = ids.filter((id): id is PublicKey => id !== null)
  const accountInfos = await getBatchedMultipleAccounts(
    connection,
    filteredIds,
    { encoding: 'jsonParsed' } as GetMultipleAccountsConfig
  )
  return deserializeAccountInfos(filteredIds, accountInfos)
}
