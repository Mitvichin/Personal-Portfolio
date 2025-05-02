import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { APP_CONTAINER_ID } from '../utils/constants';
import ReactDOM from 'react-dom';
import { ModalProps } from '../types/ModalProps';
import { Button } from './Button';
import XIcon from '../assets/x-icon.svg?react';

export const Modal: React.FC<PropsWithChildren<ModalProps>> = ({
  children,
  isOpened = false,
  onClose,
  title,
  footerElements,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [className, setClassName] = useState('hidden');

  const onEscapePress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    setClassName('opacity-0');

    if (isOpened) {
      setTimeout(() => {
        setClassName('opacity-100');
        modalRef.current?.focus();
      }, 50);
    } else {
      setTimeout(() => {
        setClassName('hidden');
      }, 350);
    }
  }, [isOpened]);

  return ReactDOM.createPortal(
    <div
      ref={modalRef}
      className={`${className} z-50 size-full absolute top-0 start-0 transition-all duration-300 overflow-y-auto bg-black/70 pointer-events-auto`}
      tabIndex={-1}
      onKeyDown={onEscapePress}
    >
      <div className="w-9/10 md:w-2/3 m-3 mx-auto">
        <div className="flex flex-col bg-white border border-gray-200 shadow-md rounded-xl pointer-events-auto">
          <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-800 ">{title}</h3>
            <Button onClick={onClose} className="px-2!">
              <XIcon className="shrink-0 size-4" />
            </Button>
          </div>
          <div className="p-4 overflow-y-auto">{children}</div>
          <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-200">
            {footerElements}
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById(APP_CONTAINER_ID)!,
  );
};
