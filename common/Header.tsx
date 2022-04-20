import styled from '@emotion/styled'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

export const StyledHeader = styled.div`
  z-index: 100;
  position: fixed;
  transition-delay: 10s;
  @media (max-width: 500px) {
    padding: 0px 20px;
  }
  justify-content: space-between;
  display: flex;
  transition: 2s;
  top: 0;
  width: 95%;
  left: 50%;
  transform: translateX(-50%);
  height: 100px;
  align-items: center;

  .left {
    padding-left: 10px;
    display: flex;
    align-items: center;
    gap: 18px;
    width: 20%;

    img {
      height: 40px;
      width: auto;
    }
  }

  .right {
    display: flex;
    align-items: center;
    gap: 18px;
    width: 20%;
    justify-content: flex-end;
  }

  .center {
    color: rgba(255, 255, 255, 0.8);
    font-weight: 200;
    padding: 0px 20px;
  }

  .title {
    color: rgba(255, 255, 255, 0.8);
    font-size: 40px;
    position: relative;

    .subscript {
      font-size: 10px;
      font-style: italic;
      position: absolute;
      bottom: -5px;
      right: -35px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 6px;
      padding: 3px 5px;
    }
  }

  .vote {
    border-radius: 5px;
    border: 1px solid rgba(255, 255, 255, 0.8);
    padding: 4px 10px;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    transition: 0.3s;
    margin-top: 10px;
    display: inline-block;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 1);
    }
  }

  .back {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s;
    font-size: 20px;

    i {
      transition: 0.3s;
      color: rgba(255, 255, 255, 0.8);
      margin-right: 5px;
      margin-top: 3px;
    }
    span {
      font-size: 24px;
      color: rgba(255, 255, 255, 0.8);
    }
    &:hover {
      i {
        margin-right: 7px;
        color: rgba(255, 255, 255, 0.8);
      }
      span {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
`

const WalletButton = styled(WalletMultiButton)`
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  z-index: 10;
  height: 38px;
  border: none;
  background: none;
  background-color: none;
  &:hover {
    background: none !important;
    background-color: none !important;
  }
`

export const Header = ({ title }: { title?: string }) => {
  const { environment } = useEnvironmentCtx()
  return (
    <StyledHeader>
      <div className="left">
        <div className="title">
          <img
            style={{ position: 'relative', top: '10px' }}
            src="/assets/cardinal-titled.png"
            alt="Cardinal titled"
          />
          <div className="subscript">alpha</div>
        </div>
      </div>
      {title && <div className="center">{title}</div>}
      <div className="right">
        {environment.label !== 'mainnet' && (
          <div
            style={{
              color: 'rgb(101,119,134,1)',
              padding: '4px 6px',
              background: '#DDD',
              borderRadius: '5px',
            }}
          >
            {environment.label}
          </div>
        )}
        <WalletButton />
      </div>
    </StyledHeader>
  )
}
