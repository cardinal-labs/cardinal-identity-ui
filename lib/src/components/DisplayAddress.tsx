import type { Connection, PublicKey } from '@solana/web3.js'
import ContentLoader from 'react-content-loader'

import { useAddressName } from '../hooks/useAddressName'
import { formatShortAddress, formatIdentityLink } from '../utils/format'

export const DisplayAddress = ({
  connection,
  address,
  height = '20px',
  width = '100px',
  dark = false,
  style,
}: {
  connection: Connection
  address: PublicKey | undefined
  height?: string
  width?: string
  dark?: boolean
  style?: React.CSSProperties
}) => {
  const { displayName, loadingName, addressNamespaceName } = useAddressName(
    connection,
    address
  )

  if (!address) return <></>
  return loadingName ? (
    <div
      style={{
        ...style,
        height,
        width,
        overflow: 'hidden',
      }}
    >
      <ContentLoader
        backgroundColor={dark ? '#333' : undefined}
        foregroundColor={dark ? '#555' : undefined}
      >
        <rect style={{ ...style }} x={0} y={0} width={width} height={height} />
      </ContentLoader>
    </div>
  ) : (
    <div style={{ display: 'flex', gap: '5px', ...style }}>
      {displayName?.includes('@')
        ? formatIdentityLink(displayName, addressNamespaceName)
        : displayName || formatShortAddress(address)}
    </div>
  )
}
