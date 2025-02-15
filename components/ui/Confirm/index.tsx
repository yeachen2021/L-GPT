import * as React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { AiFillExclamationCircle } from "react-icons/ai";
import { Button } from "@/components";

interface ConfirmProps {
  /** The AlertDialog's title */
  title?: React.ReactNode;

  /** Custom icon */
  icon?: React.ReactNode;

  /** The AlertDialog's content */
  content?: React.ReactNode;

  /** Whether to close the Alert dialog when the Overlay is clicked. default is true */
  maskClosable?: boolean;

  /** Specify a function that will be called when a user clicks the OK button */
  onOk?: () => void;

  /** A ReactNode that open the AlertDialog */
  trigger: React.ReactNode;
}

const Confirm = React.forwardRef<any, ConfirmProps>(
  (
    { title, icon, content, maskClosable = true, onOk, trigger },
    forwardedRef
  ) => {
    const { t } = useTranslation("common");
    const [open, setOpen] = React.useState(false);

    const onClickOverlay = (event: any) => {
      event.stopPropagation();
      if (maskClosable) setOpen(false);
    };

    const onClickOk = (event: any) => {
      event.stopPropagation();
      onOk?.();
    };

    return (
      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            className={classNames(
              "bg-gray-900/40 backdrop-blur-sm fixed inset-0 z-[1500]",
              "data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut"
            )}
            onClick={onClickOverlay}
          />
          <div className="fixed top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[1500]">
            <AlertDialog.Content
              className={classNames(
                "p-6 shadow rounded-md max-w-confirm-modal",
                "data-[state=open]:animate-fadeUp data-[state=closed]:animate-fadeOut",
                "bg-white",
                "dark:bg-slate-800 dark:border dark:border-neutral-700/30"
              )}
            >
              <AlertDialog.Title
                className={classNames(
                  "flex items-center gap-1.5 text-lg font-medium leading-6 w-[25rem]",
                  "text-gray-900",
                  "dark:text-white/90"
                )}
              >
                {icon || <AiFillExclamationCircle className="text-amber-500" />}
                {title || "Title"}
              </AlertDialog.Title>
              <AlertDialog.Description
                className={classNames(
                  "text-sm mt-2 mb-4",
                  "text-gray-500",
                  "dark:text-gray-400"
                )}
              >
                {content}
              </AlertDialog.Description>
              <div className="flex justify-end gap-2">
                <AlertDialog.Cancel asChild>
                  <Button
                    type="default"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {t("cancel")}
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <Button type="danger" onClick={onClickOk}>
                    {t("ok")}
                  </Button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </div>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    );
  }
);

Confirm.displayName = "Confirm";

export default Confirm;
