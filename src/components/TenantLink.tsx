import { Link, type LinkProps } from "react-router-dom";
import { useTenant } from "@/context/TenantContext";

type TenantLinkProps = LinkProps & {
  preserveTenant?: boolean;
  forceTenant?: boolean;
};

const TenantLink = ({ to, preserveTenant = true, forceTenant = false, ...props }: TenantLinkProps) => {
  const { tenantPath } = useTenant();

  if (!preserveTenant) {
    return <Link to={to} {...props} />;
  }

  const tenantAwareTo =
    typeof to === "string"
      ? tenantPath(to, forceTenant)
      : tenantPath(`${to.pathname ?? ""}${to.search ?? ""}${to.hash ?? ""}`, forceTenant);

  return <Link to={tenantAwareTo} {...props} />;
};

export default TenantLink;
