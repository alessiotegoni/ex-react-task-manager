import { useState, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  title: string;
  children: ReactNode;
  btnClasses?: string;
  confirmText?: string;
  onConfirm: () => void;
};

export default function Modal({
  title,
  children,
  confirmText = "Conferma",
  btnClasses = "",
  onConfirm,
}: ModalProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowModal(false);
    };

    if (showModal) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showModal]);

  return (
    <>
      <button
        type="button"
        className={`btn ${btnClasses}`}
        onClick={() => setShowModal(true)}
      >
        {title}
      </button>
      {showModal &&
        createPortal(
          <ModalContent
            title={title}
            content={children}
            confirmText={confirmText}
            onClose={() => setShowModal(false)}
            onConfirm={onConfirm}
          />,
          document.body
        )}
    </>
  );
}

type ModalContentProps = {
  title: string;
  content: ReactNode;
  confirmText?: string;
  onClose: () => void;
  onConfirm: () => void;
};

function ModalContent({
  title,
  content,
  confirmText,
  onClose,
  onConfirm,
}: ModalContentProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex flex-col gap-3 justify-center items-center"
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl p-4 text-black">
        <h3 id="modal-title" className="text-2xl font-bold mb-2">
          {title}
        </h3>
        {content}
        <div className="flex justify-end gap-3 mt-5 text-white">
          <button className="btn bg-red-500" onClick={onClose}>
            Chiudi
          </button>
          <button
            className="btn bg-blue-500"
            onClick={() => {
              onClose();
              onConfirm();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
