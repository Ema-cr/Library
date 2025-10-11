import React, { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  // 🔒 Bloquea scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClose={onClose}
      >
        {/* Fondo oscuro y desenfocado */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md transition-opacity" />
        </Transition.Child>

        {/* Panel principal con animación rápida y suave */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0 scale-95 translate-y-2"
          enterTo="opacity-100 scale-100 translate-y-0"
          leave="ease-in duration-100"
          leaveFrom="opacity-100 scale-100 translate-y-0"
          leaveTo="opacity-0 scale-95 translate-y-2"
        >
          <Dialog.Panel
            className="bg-[#FDFCF9] border border-[#D3C3A3] rounded-2xl shadow-[0_0_25px_rgba(139,94,60,0.3)] 
                       max-w-lg w-full p-6 relative z-50 transform transition-all"
          >
            <Dialog.Title className="text-xl font-semibold text-[#5C4033] mb-4 border-b border-[#D3C3A3] pb-2">
              {title}
            </Dialog.Title>

            <div>{children}</div>

            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-[#8B5E3C] hover:text-[#5C4033] font-bold text-lg transition"
            >
              ✕
            </button>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default EditModal;

