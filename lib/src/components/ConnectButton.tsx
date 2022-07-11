import { Button } from '../common/Button'
import { LinkingFlow } from '../common/LinkingFlows'
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
  disabled?: boolean
  variant?: 'primary' | 'secondary'
  forceFlow?: LinkingFlow
}

export const ConnectButton: React.FC<Props> = ({
  variant = 'primary',
  dev,
  cluster,
  connection,
  secondaryConnection,
  wallet,
  onClose,
  disabled,
  showManage,
  forceFlow,
  ...buttonProps
}: Props) => {
  const { show, linkingFlow, setLinkingFlow } = useWalletIdentity()
  return (
    <Button
      bgColor={forceFlow?.colors.primary || linkingFlow?.colors.primary}
      variant={variant}
      disabled={disabled}
      {...buttonProps}
      onClick={() => {
        if (!forceFlow) {
          !disabled &&
            show({
              wallet,
              connection,
              cluster,
              secondaryConnection,
              dev,
              onClose,
              showManage,
            })
        } else {
          setLinkingFlow(forceFlow)
        }
      }}
    >
      {(forceFlow && forceFlow.name !== 'default') ||
      linkingFlow.name !== 'default' ? (
        <>
          <div style={{ width: '14px' }} className="align-middle">
            <img
              className="text-white "
              alt={`${forceFlow?.name || linkingFlow?.name}-icon`}
              src={forceFlow?.icon || linkingFlow?.icon}
            />
          </div>
          <span className="ml-2">
            Link {forceFlow?.displayName || 'Profile'}
          </span>
        </>
      ) : (
        <>Link your identities</>
      )}
    </Button>
  )
}
