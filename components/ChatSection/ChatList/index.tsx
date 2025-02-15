import * as React from "react";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { useDateFormat, useClipboard } from "l-hooks";
import {
  CopyIcon,
  ChatContent,
  useScrollToBottom,
  ContextMenu,
} from "@/components";
import type { ContextMenuOption } from "@/components";
import {
  AiOutlineLoading,
  AiOutlineDelete,
  AiOutlineCopy,
} from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";
import { useChannel, useRevoke } from "@/hooks";
import type { ChatItem } from "@/hooks";
import { useChatLoading } from "@/state";
import GPTSvg from "@/assets/gpt.svg";

const ChatList: React.FC = () => {
  const { t } = useTranslation("chat");
  const { copy } = useClipboard();
  const { format } = useDateFormat();

  const [channel, setChannel] = useChannel();
  const loadingStart = useChatLoading((state) => state.loadingResponseStart);

  const menuOptions: ContextMenuOption[] = [
    {
      label: "复制",
      value: "copy",
      icon: <AiOutlineCopy size={18} />,
    },
    {
      label: "删除",
      value: "delete",
      icon: <AiOutlineDelete size={18} />,
    },
  ];

  const chatList =
    channel.list.find((item) => item.channel_id === channel.activeId)
      ?.chat_list || [];

  const { set } = useRevoke({
    revoke: (value) => onRevoke(value),
    tip: t("content-deleted") as string,
    btn: t("undo") as string,
  });

  const scrollToBottom = useScrollToBottom();

  const onDelete = (item: ChatItem) => {
    const { id } = item;
    setChannel((channel) => {
      const { list, activeId } = channel;
      const findChannel = list.find((item) => item.channel_id === activeId);
      if (!findChannel) return channel;
      const findChatIndex = findChannel.chat_list.findIndex(
        (item) => item.id === id
      );
      set("chatItem", {
        id: activeId,
        index: findChatIndex,
        content: findChannel.chat_list[findChatIndex],
      });
      findChannel.chat_list = findChannel.chat_list.filter(
        (item) => item.id !== id
      );
      return channel;
    });
  };

  const onRevoke = (value: any[]) => {
    const { id, index, content } = value[0].value;
    setChannel((channel) => {
      const { list } = channel;
      const findChannel = list.find((item) => item.channel_id === id);
      if (!findChannel) return channel;
      findChannel.chat_list.splice(index, 0, content);
      return channel;
    });
  };

  const onSelectMenu = (params: ContextMenuOption, item: ChatItem) => {
    if (params.value === "copy") {
      copy(item.content);
    } else if (params.value === "delete") {
      onDelete(item);
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [channel.activeId]);

  return (
    <div>
      <div className="flex flex-col mt-5 gap-5 ">
        {chatList.map((item, index) => (
          <div
            key={item.id}
            className={classNames("flex gap-3 group", { "mt-12": index === 0 })}
          >
            <div>
              {item.role === "assistant" && (
                <div className="rounded-full flex bg-[#20a37f] h-8 w-8 justify-center items-center">
                  <GPTSvg />
                </div>
              )}
              {item.role === "user" && (
                <div
                  className={classNames(
                    "rounded-full flex h-8 w-8 justify-center items-center",
                    "bg-black/25 dark:bg-slate-50"
                  )}
                >
                  <FaUserAlt className="text-white dark:text-neutral-600" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm text-neutral-500 dark:text-neutral-300/90">
                {format(Number(item.time), "MM-DD HH:mm:ss")}
              </div>
              <ContextMenu
                options={menuOptions}
                onSelect={(params) => onSelectMenu(params, item)}
              >
                <div
                  className={classNames(
                    "self-start py-2.5 px-3 rounded-md relative border border-transparent",
                    { "bg-blue-200/70 dark:bg-blue-900": item.role === "user" },
                    {
                      "bg-neutral-200/60 dark:bg-neutral-800/90 dark:border-neutral-600/60":
                        item.role === "assistant",
                    }
                  )}
                >
                  <ChatContent data={item} />
                  <div
                    className={classNames(
                      "opacity-0 invisible border border-[#dee0e3] rounded-md flex gap-0.5 transition-all absolute group-hover:opacity-100 group-hover:visible",
                      "bg-white dark:bg-neutral-800",
                      "top-[-1.7rem] left-[6.5rem] group-hover:left-28",
                      "md:top-0 md:left-auto md:right-[-3.2rem] md:group-hover:right-[-3.7rem] md:group-hover:left-auto",
                      "text-neutral-500/90 dark:text-neutral-400 dark:border-neutral-700"
                    )}
                  >
                    <CopyIcon
                      className={classNames(
                        "transition-colors h-6 w-6 flex justify-center items-center cursor-pointer",
                        "hover:text-black/90 dark:hover:text-sky-400/90"
                      )}
                      content={item.content}
                    />
                    <div className="w-[1px] bg-neutral-200 dark:bg-neutral-600" />
                    <div
                      onClick={() => onDelete(item)}
                      className={classNames(
                        "transition-colors h-6 w-6 flex justify-center items-center cursor-pointer",
                        "hover:text-black/90 dark:hover:text-sky-400/90"
                      )}
                    >
                      <AiOutlineDelete size={18} />
                    </div>
                  </div>
                </div>
              </ContextMenu>
            </div>
          </div>
        ))}
        {loadingStart && (
          <AiOutlineLoading
            size={24}
            className="animate-spin text-sky-400 ml-11 dark:text-sky-400/90"
          />
        )}
      </div>
      <div className="h-32 overflow-hidden" />
    </div>
  );
};

export default ChatList;
