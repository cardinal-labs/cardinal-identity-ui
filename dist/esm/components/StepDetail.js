import { jsx as _jsx, jsxs as _jsxs } from "@emotion/react/jsx-runtime";
import styled from "@emotion/styled";
export const StepDetail = ({ icon, title, description, disabled, }) => {
    return (_jsxs(Wrapper, Object.assign({ disabled: disabled }, { children: [icon, _jsxs(Info, { children: [_jsx(Title, { children: title }, void 0), _jsx(Description, { children: description }, void 0)] }, void 0)] }), void 0));
};
const Wrapper = styled.div `
  display: grid;
  grid-template-columns: 18px 1fr;
  grid-column-gap: 9px;
  width: 100%;
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
`;
const Info = styled.div `
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const Title = styled.span `
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: -0.02em;
  color: #000000;
`;
const Description = styled.div `
  margin: 0;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: -0.02em;
  color: #696969;
`;
//# sourceMappingURL=StepDetail.js.map