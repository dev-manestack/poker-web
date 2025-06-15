import { useTranslation } from "react-i18next";
import { Badge, Button, Flex, Form, Image, Input } from "antd";
import { useMeQuery, useUpdateMeMutation } from "../../api/user";

const imageChoices = [
  "https://i.imgur.com/SyIZEu7.png",
  "https://i.imgur.com/HyWk7G4.png",
  "https://i.imgur.com/AUPzUu4.png",
  "https://i.imgur.com/hqvAYa0.png",
  "https://i.imgur.com/deQAtE1.png",
];

function ProfileForm() {
  const { t } = useTranslation();
  const { data: myData } = useMeQuery();
  const [updateMe] = useUpdateMeMutation();

  return (
    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 18 }}>
      <Form.Item label={t("profileForm.usernameLabel")}>
        <Input
          placeholder={t("profileForm.usernamePlaceholder")}
          disabled
          value={myData?.username}
        />
      </Form.Item>
      <Form.Item label={t("profileForm.emailLabel")}>
        <Input
          placeholder={t("profileForm.emailPlaceholder")}
          disabled
          value={myData?.email}
        />
      </Form.Item>
      <Flex
        gap={8}
        justify="center"
        wrap="wrap"
        style={{
          padding: "16px",
        }}
      >
        {imageChoices?.map((image, index) => {
          return (
            <Button
              key={index}
              style={{
                width: "100px",
                height: "100px",
                padding: 0,
              }}
              onClick={() => {
                if (myData) {
                  updateMe({
                    ...myData,
                    profileUrl: image,
                  });
                }
              }}
            >
              <Badge
                dot={myData?.profileUrl === image}
                color={"#1890ff"}
                size="default"
              >
                <Image
                  preview={false}
                  src={image}
                  style={{
                    width: "100px",
                    height: "100px",
                    border:
                      myData?.profileUrl === image ? "5px solid #1890ff" : "",
                  }}
                />
              </Badge>
            </Button>
          );
        })}
      </Flex>
    </Form>
  );
}

export default ProfileForm;
