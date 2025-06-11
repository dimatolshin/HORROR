"use client";

import { forwardRef, ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import close_dialog from "@/app/assets/svg/close_dialog.svg";
import ReactDOM from "react-dom";
import classNames from "classnames";

interface DialogModalProps {
  children: ReactNode;
  onClose: () => void;
  className?: string;
  classNameBTN?: string;
  classNameContent?: string;
}

const Dialog = forwardRef<HTMLDialogElement, DialogModalProps>(
  ({ children, onClose, className, classNameBTN, classNameContent }, ref) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const handleClose = () => {
      document.body.style.overflow = "";
      onClose();
    };

    return ReactDOM.createPortal(
      <dialog
        ref={ref}
        className={classNames(
          "m-auto p-0 max-w-[1600px] h-[80%] w-full bg-[#080f0f] border-3 border-[#ffffff47] rounded-[36px] outline-none backdrop:bg-[#000000cd]",
          className
        )}
        onCancel={onClose}
      >
        <div className={classNames(`w-full h-full relative`, classNameContent)}>
          <button
            className={classNames(
              "absolute top-[32px] left-[calc(100%-5em)] bg-transparent border-0 outline-none z-[1000] cursor-pointer",
              classNameBTN
            )}
            onClick={handleClose}
          >
            <Image src={close_dialog} alt="close dialog" />
          </button>
          {children}
        </div>
      </dialog>,
      document.body
    );
  }
);

Dialog.displayName = "Dialog";

export default Dialog;
