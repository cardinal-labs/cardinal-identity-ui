import type { PublicKey } from '@solana/web3.js'

import { Button } from '../common/Button'
import { TwitterIcon } from '../common/TwitterIcon'
import type { ShowParams } from '../providers/WalletIdentityProvider'
import { useWalletIdentity } from '../providers/WalletIdentityProvider'

interface Props
  extends Omit<
      React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >,
      'onClick'
    >,
    ShowParams {
  address?: PublicKey
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

export const ConnectTwitterButton: React.FC<Props> = ({
  variant = 'primary',
  dev,
  cluster,
  connection,
  secondaryConnection,
  wallet,
  onClose,
  address,
  disabled,
  ...buttonProps
}: Props) => {
  const { show } = useWalletIdentity()
  return (
    <Button
      variant={variant}
      disabled={disabled}
      {...buttonProps}
      onClick={() =>
        !disabled &&
        show({ wallet, connection, cluster, secondaryConnection, dev, onClose })
      }
    >
      <div style={{ height: '14px', width: '20px' }}>
        <TwitterIcon disabled={disabled} height={14} width={20} />
      </div>
      <span>Link Profile</span>
    </Button>
  )
}
