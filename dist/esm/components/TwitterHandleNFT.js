import { jsx as _jsx } from "@emotion/react/jsx-runtime";
import { formatName } from "@cardinal/namespaces";
import styled from "@emotion/styled";
import { apiBase } from "../utils/api";
export const TwitterHandleNFT = ({ handle, dev, cluster, }) => {
    return (_jsx(Outer, { children: _jsx(StyledImg, { alt: formatName("twitter", handle), src: `${apiBase(dev)}/img/?text=${formatName("twitter", handle)}${cluster && `&cluster=${cluster}`}` }, void 0) }, void 0));
};
const StyledImg = styled.img `
  border-radius: 10px;
  height: 120px;
  width: 120px;
  box-shadow: 0 10px 16px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 10%);
`;
const Outer = styled.div ``;
const CardInner = styled.div `
  margin: 0px 20px;
  width: 100%;
`;
const CardHeader = styled.div `
  height: 40px;
`;
const CardFooter = styled.div `
  height: 40px;
`;
//# sourceMappingURL=TwitterHandleNFT.js.map