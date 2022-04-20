import { Fragment as _Fragment, jsx as _jsx } from "@emotion/react/jsx-runtime";
import ContentLoader from 'react-content-loader';
import { HiUserCircle } from 'react-icons/hi';
import { useAddressImage } from '../hooks/useAddressImage';
export const AddressImage = ({ connection, address, style, height = '150px', width = '150px', dark = false, placeholder, }) => {
    const { addressImage, loadingImage } = useAddressImage(connection, address);
    if (!address)
        return _jsx(_Fragment, {}, void 0);
    return loadingImage ? (_jsx("div", Object.assign({ style: Object.assign(Object.assign({}, style), { height,
            width, borderRadius: '50%', overflow: 'hidden' }) }, { children: _jsx(ContentLoader, Object.assign({ backgroundColor: dark ? '#333' : undefined, foregroundColor: dark ? '#555' : undefined }, { children: _jsx("rect", { x: "0", y: "0", rx: width, ry: height, width: width, height: height }, void 0) }), void 0) }), void 0)) : addressImage ? (_jsx("img", { style: Object.assign(Object.assign({}, style), { height: height, width: width, borderRadius: '50%' }), alt: `profile-${address.toString()}`, src: addressImage }, void 0)) : (_jsx(_Fragment, { children: placeholder }, void 0) || (_jsx(HiUserCircle, { style: { width, height }, className: "text-gray-300" }, void 0)));
};
//# sourceMappingURL=AddressImage.js.map