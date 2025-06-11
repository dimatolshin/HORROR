"use client";

import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import close_dialog from "@/app/assets/svg/close_dialog.svg";
import ReactDOM from "react-dom";
import classNames from "classnames";

interface DialogModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  classNameBTN?: string;
  classNameContent?: string;
}

const Dialog = ({
  children,
  isOpen,
  onClose,
  className,
  classNameBTN,
  classNameContent,
}: DialogModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  if (!isMounted) return null;

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className={classNames(
        "fixed inset-0 z-50 flex items-center justify-center bg-[#000000cd]"
      )}
      onClick={onClose}
    >
      <div
        className={classNames(
          "relative m-4 p-0 max-w-[1600px] h-auto max-h-[90vh] w-full bg-[#080f0f] border-3 border-[#ffffff47] rounded-[36px] outline-none overflow-y-auto",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={classNames(`w-full h-full relative`, classNameContent)}>
          <button
            className={classNames(
              "absolute top-[32px] right-8 sm:right-12 bg-transparent border-0 outline-none z-[1000] cursor-pointer",
              classNameBTN
            )}
            onClick={onClose}
          >
            <Image src={close_dialog} alt="close dialog" />
          </button>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Dialog;
