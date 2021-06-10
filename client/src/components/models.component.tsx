import { PropsWithChildren } from "react";
import { Button, Modal } from "react-bootstrap";
function CustomModal({
  show,
  handleClose,
  title,
  children,
}: PropsWithChildren<{
  show: boolean;
  handleClose: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
}>) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
}

export default CustomModal;
