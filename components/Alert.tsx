import styled from '@emotion/styled'
import { FaCheck, FaExclamation } from 'react-icons/fa'

export const Alert = ({ message, type }: { message: string; type: string }) => {
  return (
    <StyledAlert>
      {type === 'success' && <FaCheck />}
      {type === 'warning' && <FaExclamation />}
      {message}
    </StyledAlert>
  )
}

const StyledAlert = styled.div`
  text-align: center;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 0.8125rem;
  border-color: rgba(101, 119, 134, 1);
  background-color: rgba(100, 116, 139, 0.1);
  color: rgb(101, 119, 134, 1);
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    padding-right: 5px;
    font-size: 18px;
  }
`
