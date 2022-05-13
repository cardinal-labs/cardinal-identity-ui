import type { Wallet } from '@saberhq/solana-contrib'
import type { Cluster, Connection } from '@solana/web3.js'
import React from 'react'
import { BiChevronDown } from 'react-icons/bi'

import { AccountPopover } from './AccountPopover'
import { Popover } from './Popover'
import { ProfileSmall } from './ProfileSmall'

export const AccountConnect = ({
  connection,
  environment,
  wallet,
  style,
  dark,
  handleDisconnect,
}: {
  connection: Connection
  wallet: Wallet
  environment: Cluster
  handleDisconnect: () => void
  dark?: boolean
  style?: React.CSSProperties
}) => {
  if (!wallet.publicKey) return <></>
  return (
    <Popover
      offset={[-30, 20]}
      placement="bottom-end"
      content={
        <AccountPopover
          dark={dark}
          handleDisconnect={handleDisconnect}
          wallet={wallet}
          environment={environment}
          connection={connection}
          style={style}
        />
      }
    >
      <div className="flex cursor-pointer gap-2 text-gray-500 transition duration-200 hover:text-gray-300">
        <ProfileSmall
          dark={dark}
          connection={connection}
          address={wallet.publicKey}
        />
        <BiChevronDown className="h-10 text-[25px] hover:scale-105" />
      </div>
    </Popover>
  )
}
