import { AccountData } from '@cardinal/common'
import {
  ReverseEntryData,
} from '@cardinal/namespaces'
import type { Wallet } from '@saberhq/solana-contrib'
import {
  Connection,
} from '@solana/web3.js'
import { UserTokenData } from '../hooks/useUserNamesForNamespace'

import { handleUnlink } from './useHandleUnlink'

export const handleMigrate = async (
  wallet: Wallet,
  connection: Connection,
  namespaceName: string,
  userTokenData: UserTokenData,
  reverseNameEntryData?: AccountData<ReverseEntryData>
): Promise<string | undefined> => {
  if (userTokenData.certificate){
    // unlink
    console.log(`Initiate unlinking`)

    const unlinkTxid = await handleUnlink(connection, wallet, {
      namespaceName: namespaceName,
      userTokenData: userTokenData,
      reverseNameEntryData: reverseNameEntryData
    })

    console.log(`Unlinking txId ${unlinkTxid}`)

    // claim
    console.log(`Initiate claiming`)
    // claim v2 endpoint
    console.log(`Claiming txId ${''}`)
    return unlinkTxid
  }
}
