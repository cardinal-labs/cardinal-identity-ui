import { useWalletIdentity } from 'lib/src'
import { FaCheck, FaExclamation } from 'react-icons/fa'

export const Alert = ({ message, type }: { message: string; type: string }) => {
  const { linkingFlow } = useWalletIdentity()
  return (
    <div
      className="flex items-center justify-center rounded-lg py-2 text-center text-xs"
      style={{
        background: linkingFlow.colors.buttonColor || '#ffffff',
        color: linkingFlow.colors.secondaryFontColor || '#ffffff',
      }}
    >
      {type === 'success' && <FaCheck />}
      {type === 'warning' && <FaExclamation />}
      <span className="ml-2">{message}</span>
    </div>
  )
}
