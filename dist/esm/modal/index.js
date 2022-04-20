import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "@emotion/react/jsx-runtime";
import { css, Global } from "@emotion/react";
import styled from "@emotion/styled";
import { DialogContent, DialogOverlay } from "@reach/dialog";
import { animated, useSpring, useTransition } from "@react-spring/web";
import darken from "polished/lib/color/darken";
import { isMobile } from "react-device-detect";
import { useGesture } from "react-use-gesture";
import { BackIcon, CloseIcon } from "./icons";
export const Modal = ({ children, isOpen, onDismiss, darkenOverlay = true, onBack, hideCloseButton = false, }) => {
    const fadeTransition = useTransition(isOpen, {
        config: { duration: 150 },
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
    });
    const [{ y }, set] = useSpring(() => ({
        y: 0,
        config: { mass: 1, tension: 210, friction: 20 },
    }));
    const bind = useGesture({
        onDrag: (state) => {
            set({
                y: state.down ? state.movement[1] : 0,
            });
            if (state.movement[1] > 300 ||
                (state.velocity > 3 && state.direction[1] > 0)) {
                onDismiss();
            }
        },
    });
    return (_jsxs(_Fragment, { children: [_jsx(Global, { styles: css `
          :root {
            --reach-dialog: 1;
          }
          [data-reach-dialog-overlay] {
            background: hsla(0, 0%, 0%, 0.33);
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            overflow: auto;
            z-index: 100;
          }
          [data-reach-dialog-content] {
            width: 50vw;
            margin: 10vh auto;
            background: white;
            padding: 2rem;
            outline: none;
          }
        ` }, void 0), fadeTransition((props, item) => item && (_jsx(StyledDialogOverlay, Object.assign({ style: props, 
                // eslint-disable-next-line react/prop-types
                isOpen: isOpen || props.opacity.get() !== 0, onDismiss: onDismiss, darkenOverlay: darkenOverlay }, { children: _jsxs(ModalWrapper, Object.assign({ "aria-label": "dialog content" }, (isMobile
                    ? Object.assign(Object.assign({}, bind()), { style: {
                            transform: y.to((n) => `translateY(${n > 0 ? n : 0}px)`),
                        } }) : {}), { children: [_jsxs(TopArea, { children: [onBack ? (_jsx(ButtonIcon, Object.assign({ href: "#", onClick: (e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        onBack();
                                    } }, { children: _jsx(BackIcon, {}, void 0) }), void 0)) : (_jsx("div", {}, void 0)), hideCloseButton ? (_jsx("div", {}, void 0)) : (_jsx(ButtonIcon, Object.assign({ href: "#", onClick: (e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        onDismiss();
                                    } }, { children: _jsx(CloseIcon, {}, void 0) }), void 0))] }, void 0), _jsx(Content, { children: children }, void 0)] }), void 0) }), void 0)))] }, void 0));
};
const LogoWrapper = styled.div `
  flex: 1 1 auto;
  padding-left: 24px;
  padding-top: 10px;
  display: flex;
  justify-content: center;
  svg {
    width: 35%;
  }
`;
const TopArea = styled.div `
  padding: 12px 16px 0px 16px;
  top: 12px;
  left: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ButtonIcon = styled.a `
  flex: 0 0 24px;
  color: #ccd2e3;
  &:hover {
    color: ${darken(0.1, "#ccd2e3")};
  }
  transition: 0.1s ease;
`;
const Content = styled.div ``;
const ModalWrapper = styled(animated(DialogContent)) `
  * {
    box-sizing: border-box;
  }
  font-family: SFHello, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol";
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
`;
const StyledDialogOverlay = styled(animated(DialogOverlay), {
    shouldForwardProp(prop) {
        return prop !== "darkenOverlay";
    },
}) `
  [data-reach-dialog-content] {
    padding: 0;
  }
  ${({ darkenOverlay }) => darkenOverlay
    ? css `
          background: rgba(0, 0, 0, 0.55);
        `
    : css `
          background: none;
        `}
`;
//# sourceMappingURL=index.js.map