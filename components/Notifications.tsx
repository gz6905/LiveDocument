"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  InboxNotification,
  InboxNotificationList,
  LiveblocksUiConfig,
} from "@liveblocks/react-ui";
import {
  useInboxNotifications,
  useUnreadInboxNotificationsCount,
} from "@liveblocks/react/suspense";
import Image from "next/image";
import { ReactNode } from "react";

const Notifications = () => {
  const { inboxNotifications } = useInboxNotifications();
  const { count } = useUnreadInboxNotificationsCount();

  const unreadNotifications = inboxNotifications.filter(
    (notification) => !notification.readAt
  );

  return (
    <Popover>
      <PopoverTrigger className="relative flex size-10 items-center justify-center rounded-lg">
        <Image src="assets/icons/bell.svg" alt="inbox" width={24} height={24} />
        {count > 0 && (
          <div className="absolute right-2 top-2 z-20 size-2 rounded-full bg-blue-500" />
        )}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="shad-popover z-[999999] overflow-visible"
        style={{ zIndex: 999999, overflow: 'visible' }}
      >
        <LiveblocksUiConfig
          overrides={{
            INBOX_NOTIFICATION_TEXT_MENTION: (user: ReactNode) => (
              <>{user} mentioned you.</>
            ),
          }}
        >
          <div className="[&_.lb-root]:z-[100000] [&_.lb-popover]:z-[100000] [&_.lb-dropdown]:z-[100000]">
            <InboxNotificationList className="">
            {unreadNotifications.length <= 0 && (
              <p className="py-2 text-center text-dark-500">
                No new notifications
              </p>
            )}

            {unreadNotifications.length > 0 &&
              unreadNotifications.map((notification) => {
                // Check if this is a "removed" notification by checking if roomId exists and userType is "removed"
                const isRemovedNotification =
                  notification.kind === "$documentAccess" &&
                  !notification.roomId;

                return (
                  <InboxNotification
                    key={notification.id}
                    inboxNotification={notification}
                    className="!bg-dark-200 !text-white border-none relative z-[10000]"
                    href={
                      notification.roomId && !isRemovedNotification
                        ? `/documents/${notification.roomId}`
                        : undefined
                    }
                    showActions={true}
                    kinds={{
                      thread: (props) => (
                        <InboxNotification.Thread
                          {...props}
                          className="!bg-dark-200 !text-white relative z-[10001]"
                          showActions={true}
                          showRoomName={false}
                        />
                      ),
                      textMention: (props) => (
                        <InboxNotification.TextMention
                          {...props}
                          className="!bg-dark-200 !text-white relative z-[10001]"
                          showRoomName={false}
                        />
                      ),
                      $documentAccess: (props) => (
                        <InboxNotification.Custom
                          {...props}
                          className="!bg-dark-200 !text-white relative z-[10001]"
                          title={
                            props.inboxNotification.activities[0].data.title
                          }
                          aside={
                            <InboxNotification.Icon className="bg-transparent">
                              <Image
                                src={
                                  (props.inboxNotification.activities[0].data
                                    .avatar as string) || ""
                                }
                                alt="avatar"
                                width={36}
                                height={36}
                                className="rounded-full"
                              />
                            </InboxNotification.Icon>
                          }
                        >
                          {props.children}
                        </InboxNotification.Custom>
                      ),
                    }}
                  />
                );
              })}
          </InboxNotificationList>
          </div>
        </LiveblocksUiConfig>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
