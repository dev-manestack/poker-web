import { Flex, message } from "antd";
import AdminUserList from "../../features/admin/admin-user-list";
import { useAdminSearchUsersQuery } from "../../api/admin";

function UserPage() {
  const [_, contextHolder] = message.useMessage();
  const { data: users } = useAdminSearchUsersQuery();

  return (
    <Flex style={{ width: "100%" }} vertical gap={16}>
      {contextHolder}
      <AdminUserList users={users ? users : []} />
    </Flex>
  );
}

export default UserPage;
