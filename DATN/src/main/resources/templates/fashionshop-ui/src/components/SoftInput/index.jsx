import { forwardRef } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Custom styles for SoftInput
import SoftInputRoot from "components/SoftInput/SoftInputRoot";
import SoftInputWithIconRoot from "components/SoftInput/SoftInputWithIconRoot";
import SoftInputIconBoxRoot from "components/SoftInput/SoftInputIconBoxRoot";
import SoftInputIconRoot from "components/SoftInput/SoftInputIconRoot";

// Soft UI Dashboard React contexts
import { useSoftUIController } from "context";

const SoftInput = forwardRef(({ size, icon, error, success, disabled, ...rest }, ref) => {
  let template;
  const [controller] = useSoftUIController();
  // Đảm bảo controller luôn có giá trị hoặc fallback về ltr
  const direction = controller?.direction || "ltr";
  // Đảm bảo icon là object, nếu không thì fallback về object mặc định
  const safeIcon = icon && typeof icon === "object" ? icon : { component: false, direction: "none" };
  const iconDirection = safeIcon.direction;

  if (safeIcon.component && safeIcon.direction === "left") {
    template = (
      <SoftInputWithIconRoot ref={ref} ownerState={{ error, success, disabled }}>
        <SoftInputIconBoxRoot ownerState={{ size }}>
          <SoftInputIconRoot fontSize="small" ownerState={{ size }}>
            {safeIcon.component}
          </SoftInputIconRoot>
        </SoftInputIconBoxRoot>
        <SoftInputRoot
          {...rest}
          ownerState={{ size, error, success, iconDirection, direction, disabled }}
        />
      </SoftInputWithIconRoot>
    );
  } else if (safeIcon.component && safeIcon.direction === "right") {
    template = (
      <SoftInputWithIconRoot ref={ref} ownerState={{ error, success, disabled }}>
        <SoftInputRoot
          {...rest}
          ownerState={{ size, error, success, iconDirection, direction, disabled }}
        />
        <SoftInputIconBoxRoot ownerState={{ size }}>
          <SoftInputIconRoot fontSize="small" ownerState={{ size }}>
            {safeIcon.component}
          </SoftInputIconRoot>
        </SoftInputIconBoxRoot>
      </SoftInputWithIconRoot>
    );
  } else {
    template = (
      <SoftInputRoot {...rest} ref={ref} ownerState={{ size, error, success, disabled }} />
    );
  }

  return template;
});

// Setting default values for the props of SoftInput
SoftInput.defaultProps = {
  size: "medium",
  icon: {
    component: false,
    direction: "none",
  },
  error: false,
  success: false,
  disabled: false,
};

// Typechecking props for the SoftInput
SoftInput.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  icon: PropTypes.shape({
    component: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
    direction: PropTypes.oneOf(["none", "left", "right"]),
  }),
  error: PropTypes.bool,
  success: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default SoftInput;