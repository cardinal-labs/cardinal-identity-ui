import { __rest } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "@emotion/react/jsx-runtime";
import { Button } from "../common/Button";
import { TwitterIcon } from "../common/TwitterIcon";
import { useWalletIdentity } from "../providers/WalletIdentityProvider";
export const ConnectTwitterButton = (_a) => {
    var { variant = "primary", dev, cluster, connection, wallet, address, disabled } = _a, buttonProps = __rest(_a, ["variant", "dev", "cluster", "connection", "wallet", "address", "disabled"]);
    const { show } = useWalletIdentity();
    return (_jsxs(Button, Object.assign({ variant: variant, disabled: disabled }, buttonProps, { onClick: () => !disabled && show(wallet, connection, cluster, dev) }, { children: [_jsx("div", Object.assign({ style: { height: "14px", width: "20px" } }, { children: _jsx(TwitterIcon, { disabled: disabled, height: 14, width: 20 }, void 0) }), void 0), _jsx("span", { children: "Link Profile" }, void 0)] }), void 0));
};
//# sourceMappingURL=ConnectTwitterButton.js.map