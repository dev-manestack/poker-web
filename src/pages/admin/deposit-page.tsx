import { Flex } from "antd";
import AdminDepositList from "../../features/admin/admin-deposit-list";
import { useFetchDepositsQuery } from "../../api/admin";

function DepositPage() {
  const { data: deposits, isLoading } = useFetchDepositsQuery(null);

  return (
    <Flex
      style={{
        width: "100%",
      }}
    >
      <AdminDepositList deposits={deposits ? deposits : []} />
    </Flex>
  );
}

export default DepositPage;
