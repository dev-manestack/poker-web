import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
} from "antd";
import {
  useCreateTableMutation,
  useFetchTablesQuery,
  useUpdateTableMutation,
  type GameTable,
} from "../../api/admin";
import AdminTableList from "../../features/admin/admin-table-list";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

function AdminTable() {
  const { data } = useFetchTablesQuery();
  const [modalType, setModalType] = useState<"create" | "edit" | "">("");
  const [
    createTable,
    { isError: isCreateError, error: createError, isSuccess: isCreateSuccess },
  ] = useCreateTableMutation();
  const [
    updateTable,
    { isError: isUpdateError, error: updateError, isSuccess: isUpdateSuccess },
  ] = useUpdateTableMutation();
  const [messageAPI, contextHolder] = message.useMessage();
  const [editTable, setEditTable] = useState<GameTable | null>(null);

  useEffect(() => {
    if (createError) {
      console.error(createError);
      if ("data" in createError && (createError as any).data?.errorMessage) {
        messageAPI.error(
          "Үүсгэхэд алдаа гарлаа: " + (createError as any).data.errorMessage
        );
      } else {
        messageAPI.error("Үүсгэхэд алдаа гарлаа");
      }
    }
  }, [isCreateError, createError]);

  useEffect(() => {
    if (isCreateSuccess) {
      messageAPI.success("Ширээ амжилттай үүслээ");
      setModalType("");
    }
  }, [isCreateSuccess]);

  useEffect(() => {
    if (isUpdateError) {
      console.error(updateError);
      if ("data" in updateError && (updateError as any).data?.errorMessage) {
        messageAPI.error(
          "Засахад алдаа гарлаа: " + (updateError as any).data.errorMessage
        );
      } else {
        messageAPI.error("Засахад алдаа гарлаа");
      }
    }
  }, [isUpdateError, updateError]);

  useEffect(() => {
    if (isUpdateSuccess) {
      messageAPI.success("Ширээ амжилттай засагдлаа");
      setModalType("");
    }
  }, [isUpdateSuccess]);

  return (
    <Flex
      style={{
        width: "100%",
      }}
      vertical
      gap={16}
    >
      {contextHolder}
      <Flex justify="end">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalType("create")}
        />
      </Flex>
      <Modal open={!!modalType} onCancel={() => setModalType("")} footer={null}>
        {modalType === "create" ||
          (modalType === "edit" && (
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={
                modalType === "edit" ? (editTable ? editTable : {}) : {}
              }
              onFinish={(values: GameTable) => {
                if (modalType === "edit") {
                  updateTable({
                    ...values,
                    tableId: editTable?.tableId ? editTable.tableId : 0,
                  });
                } else if (modalType === "create") {
                  createTable(values);
                }
              }}
            >
              <Form.Item label="Ширээний нэр" name="tableName">
                <Input type="text" placeholder="Ширээний нэр" />
              </Form.Item>
              <Form.Item label="Тоглогчийн тоо" name="maxPlayers">
                <InputNumber type="number" placeholder="12" max={12} min={2} />
              </Form.Item>
              <Form.Item label="Big Blind" name="bigBlind">
                <InputNumber type="number" placeholder="1,000" />
              </Form.Item>
              <Form.Item label="Small Blind" name="smallBlind">
                <InputNumber type="number" placeholder="500" />
              </Form.Item>
              <Form.Item label="Ширээний доод лимит" name="minBuyIn">
                <InputNumber type="number" placeholder="10,000" />
              </Form.Item>
              <Form.Item label="Ширээний дээд лимит" name="maxBuyIn">
                <InputNumber type="number" placeholder="50,000" />
              </Form.Item>
              <Form.Item label="Төрөл" name="variant">
                <Select
                  placeholder="Төрөл"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={[
                    {
                      label: "Texas Holdem",
                      value: "TEXAS",
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Ширээ үүсгэх
                </Button>
              </Form.Item>
            </Form>
          ))}
      </Modal>
      <AdminTableList
        tables={data ? data : []}
        deleteTable={() => {}}
        editTable={(table) => {
          setEditTable(table);
          setModalType("edit");
        }}
      />
    </Flex>
  );
}

export default AdminTable;
