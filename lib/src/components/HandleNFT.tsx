import { formatName } from '@cardinal/namespaces'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { useWalletIdentity } from '../providers/WalletIdentityProvider'

interface Props {
  handle: string
  cluster?: string
  dev?: boolean
}

export const HandleNFT: React.FC<Props> = ({ handle, dev, cluster }: Props) => {
  const { linkingFlow } = useWalletIdentity()
  return (
    <Outer>
      <StyledImg
        alt={formatName('twitter', handle)}
        src={encodeURI(
          `https://${
            dev ? 'dev-nft' : 'nft'
          }.cardinal.so/img/?text=@${encodeURIComponent(handle)}:${
            linkingFlow.name
          }${cluster && `&cluster=${cluster}`}`
        )}
      />
    </Outer>
  )
}

const StyledImg = styled.img`
  border-radius: 10px;
  height: 120px;
  width: 120px;
  box-shadow: 0 10px 16px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 10%);
`

const Outer = styled.div``
