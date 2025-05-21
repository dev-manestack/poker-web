import { useEffect } from "react";
import { useFetchWithdrawalsQuery } from "../../api/admin";
import { Flex } from "antd";
import AdminWithdrawList from "../../features/admin/admin-withdraw-list";

function WithdrawPage() {
  const { data } = useFetchWithdrawalsQuery();

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <Flex style={{ width: "100%" }}>
      <AdminWithdrawList withdrawals={data ? data : []} />
    </Flex>
  );
}

export default WithdrawPage;
