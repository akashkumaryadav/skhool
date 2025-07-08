import { Button, Drawer } from "antd";

const CustomDrawer = (props: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  enableCloseButton?: boolean;
  enableHeader?: boolean;
  enableFooter?: boolean;
  actions?: Array<{
    label: string;
    onClick: () => void;
    className?: string;
    variant?: "filled" | "outlined" | "text";
    disabled?: boolean;
  }>;
  footer?: React.ReactNode;
  header?: React.ReactNode;
}) => {
  return (
    <Drawer
      open={props.open}
      onClose={props.onClose}
      className={props.className}
      style={props.style}
      title={props.enableHeader ? props.header || "Drawer Title" : null}
      footer={<div className="flex justify-end space-x-2">
        {props.actions?.map((action, index) => (
          <Button
            key={index}
            onClick={action.onClick}
            className={`btn ${action.className || "btn-primary"}`}
            variant={action.variant || "filled"}
          >
            {action.label}
          </Button>
        ))}
      </div>}
    >
      <div className="drawer-content">{props.children}</div>
    </Drawer>
  );
};
export default CustomDrawer;
