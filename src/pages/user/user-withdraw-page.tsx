import { Card, Flex, Tabs, Typography } from "antd";
import DepositTable from "../../features/user/deposit-table";
import WithdrawTable from "../../features/user/withdraw-table";
import OutcomeTable from "../../features/user/outcome-table";
import { useMeQuery } from "../../api/user";
import { useEffect } from "react";

function UserWithdrawPage() {
  const { data } = useMeQuery();

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <Flex
      style={{ width: "100%", height: "100%", padding: "8px 16px" }}
      vertical
      gap={16}
    >
      <Typography.Title level={3} style={{ textAlign: "center" }}>
        Үлдэгдэл
      </Typography.Title>
      <Flex justify="center" align="center" gap={16}>
        <Card
          style={{
            width: "200px",
            height: "200px",
          }}
        >
          <Flex
            vertical
            gap={8}
            style={{ height: "100%" }}
            align="center"
            justify="center"
          >
            <Typography.Text style={{ textAlign: "center", fontSize: "16px" }}>
              Үлдэгдэл
            </Typography.Text>
            <Typography.Text style={{ textAlign: "center", fontSize: "24px" }}>
              {`${data?.userBalance?.balance?.toLocaleString()}₮` || "0₮"}
            </Typography.Text>
          </Flex>
        </Card>
        <Card style={{ width: "200px", height: "200px" }}>
          <Flex
            vertical
            gap={8}
            style={{ height: "100%" }}
            align="center"
            justify="center"
          >
            <Typography.Text style={{ textAlign: "center", fontSize: "16px" }}>
              Түгжигдсэн
            </Typography.Text>
            <Typography.Text style={{ textAlign: "center", fontSize: "24px" }}>
              {`${data?.userBalance?.lockedAmount?.toLocaleString()}₮` || "0₮"}
            </Typography.Text>
          </Flex>
        </Card>
      </Flex>
      <Tabs
        style={{ width: "100%", height: "400px" }}
        items={[
          {
            key: "1",
            label: "Цэнэглэлт",
            children: <DepositTable />,
          },
          {
            key: "2",
            label: "Татан авалт",
            children: <WithdrawTable balance={data?.userBalance?.balance} />,
          },
          {
            key: "3",
            label: "Тоглолтын түүх",
            children: <OutcomeTable />,
          },
        ]}
      />
    </Flex>
  );
}

export default UserWithdrawPage;
