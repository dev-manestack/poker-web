import { useFetchGameSessionsQuery } from "../../api/admin";
import { Button, Flex, Table, Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";

function AdminGameSession() {
  const { data } = useFetchGameSessionsQuery({ tableId: 4 });

  const columns = [
    {
      title: "ID",
      dataIndex: "sessionId",
      key: "sessionId",
    },
    {
      title: "Он сар",
      dataIndex: "createDate",
      render: (text: string) => {
        const date = new Date(text);
        const options: Intl.DateTimeFormatOptions = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        };
        return date.toLocaleString("mn-MN", options);
      },
    },
    {
      title: "Тоглогчдын жагсаалт",
      dataIndex: "details",
      key: "players",
      render: (details: any) => {
        return (
          <Flex gap={8} align="center" justify="center">
            <Typography.Text>{details?.players?.length}</Typography.Text>
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => {
                console.log("View players", details?.players);
              }}
            >
              Харах
            </Button>
          </Flex>
        );
      },
    },
    {
      title: "Ялагчид",
      dataIndex: "details",
      key: "gameType",
      render: (details: any) => {
        return (
          <Flex gap={8} align="center" justify="center">
            <Typography.Text>{details?.players?.length}</Typography.Text>
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => {
                console.log("View players", details?.players);
              }}
            >
              Харах
            </Button>
          </Flex>
        );
      },
    },
    {
      title: "Орлого",
      dataIndex: "details",
      key: "rake",
      render: (details: any) => {
        console.log(details);
        return (
          <Typography.Text>
            {details?.rake ? details.rake.toFixed(2) : "0.00"} ₮
          </Typography.Text>
        );
      },
    },
  ];

  return (
    <Flex>
      <Table dataSource={data} columns={columns} />
    </Flex>
  );
}

export default AdminGameSession;
