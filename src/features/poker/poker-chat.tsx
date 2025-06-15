import { Flex, Tabs, Typography, type TabsProps } from "antd";
import { useEffect, useState } from "react";

interface Chat {
  id: number;
  username: string;
  message: string;
}

function PokerChat({
  isAdmin = false,
  chatList = [
    {
      id: 1,
      username: "User1",
      message: "Hello, this is a chat message fdfdfsdfds fdsfsdfds dff!",
    },
    {
      id: 1,
      username: "User1",
      message: "Hello, this is a chat message!",
    },
    {
      id: 1,
      username: "User1",
      message: "Hello, this is a chat message!",
    },
    {
      id: 1,
      username: "User1",
      message: "Hello, this is a chat message!",
    },
    {
      id: 1,
      username: "User1",
      message: "Hello, this is a chat message!",
    },
    {
      id: 1,
      username: "User1",
      message: "Hello, this is a chat message!",
    },
    {
      id: 1,
      username: "User1",
      message: "Hello, this is a chat message!",
    },
    {
      id: 1,
      username: "User1",
      message: "Hello, this is a chat message!",
    },
    {
      id: 1,
      username: "User1",
      message: "Hello, this is a chat message!",
    },
  ],
}: {
  isAdmin?: boolean;
  chatList?: Chat[];
}) {
  const [tabItems, setTabItems] = useState<TabsProps["items"]>([]);

  useEffect(() => {
    const tempTabItems = [
      {
        key: "1",
        label: "Chat",
        children: (
          <Flex
            style={{
              width: "100%",
              height: "200px",
              overflow: "scroll",
            }}
            vertical
            gap={8}
          >
            {chatList?.map((chat, index) => (
              <Typography.Text key={index}>
                <strong>{chat.username}:</strong> {chat.message}
              </Typography.Text>
            ))}
          </Flex>
        ),
      },
    ];
    if (isAdmin) {
      tempTabItems.push({
        key: "2",
        label: "Admin Chat",
        children: <></>,
      });
    }
    setTabItems(tempTabItems);
  }, [isAdmin]);

  return (
    <Tabs
      items={tabItems}
      style={{
        height: "300px",
        width: "400px",
        borderRadius: "8px",
        background: "#10152E",
        paddingLeft: "16px",
      }}
    />
  );
}

export default PokerChat;
