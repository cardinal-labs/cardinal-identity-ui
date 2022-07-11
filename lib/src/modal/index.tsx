import styled from '@emotion/styled'
import darken from 'polished/lib/color/darken'
import React, { useEffect, useState } from 'react'
import { linkingFlows } from '../common/LinkingFlows'
import { useWalletIdentity } from '../providers/WalletIdentityProvider'

import { CloseIcon, BackIcon } from './icons'

export interface ModalProps {
  children: React.ReactNode
  isOpen: boolean
  onDismiss: () => void
  darkenOverlay?: boolean
  hideCloseButton?: boolean
  hideOtherLinkingFlows?: boolean
}

export const Modal: React.FC<ModalProps> = ({
  children,
  isOpen,
  onDismiss,
  darkenOverlay = true,
  hideCloseButton = false,
  hideOtherLinkingFlows = false,
}: ModalProps) => {
  const [mounted, setMounted] = useState(true)
  const { linkingFlow, setLinkingFlow } = useWalletIdentity()
  useEffect(() => {
    !isOpen
      ? setTimeout(() => {
          setMounted(false)
        }, 200)
      : setMounted(true)
  }, [isOpen])

  return (
    <>
      <StyledDialogOverlay
        isOpen={isOpen}
        darkenOverlay={darkenOverlay}
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          onDismiss()
        }}
      >
        <ModalWrapper
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          <TopArea>
            <div
              className="flex-between flex w-full"
              style={{
                justifyContent:
                  hideOtherLinkingFlows || linkingFlow.name === 'default'
                    ? 'flex-end'
                    : 'space-between',
              }}
            >
              {hideOtherLinkingFlows || linkingFlow.name === 'default' ? (
                <div />
              ) : (
                <ButtonIcon
                  onClick={(e) => {
                    setLinkingFlow(linkingFlows['default']!)
                  }}
                >
                  <BackIcon />
                </ButtonIcon>
              )}
              {hideCloseButton ? (
                <div />
              ) : (
                <ButtonIcon
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    onDismiss()
                  }}
                >
                  <CloseIcon />
                </ButtonIcon>
              )}
            </div>
          </TopArea>
          {mounted && children}
        </ModalWrapper>
      </StyledDialogOverlay>
    </>
  )
}

const TopArea = styled.div`
  padding: 12px 16px 0px 16px;
  top: 12px;
  left: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ButtonIcon = styled.div`
  flex: 0 0 24px;
  cursor: pointer;
  color: #ccd2e3;
  &:hover {
    color: ${darken(0.1, '#ccd2e3')};
  }
  transition: 0.1s ease;
`

const ModalWrapper = styled.div`
  * {
    box-sizing: border-box;
  }
  font-family: SFHello, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol';
  position: relative;
  box-shadow: 0px 4px 16px rgba(207, 207, 207, 0.25);
  width: 100%;
  max-width: 560px;
  border-radius: 8px;
  background: #fff;
  color: #696969;
  font-weight: normal;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: -0.02em;
  color: #696969;
  margin: 10vh auto;
`

const StyledDialogOverlay = styled.div<{
  darkenOverlay?: boolean
  isOpen?: boolean
}>`
  transition: 0.2s all;
  width: 100vw;
  height: 100vh;
  position: absolute;
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'collapse')};
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  background: ${({ darkenOverlay }) =>
    darkenOverlay ? 'rgba(0, 0, 0, 0.55)' : 'none'};
  z-index: 1000;
`
