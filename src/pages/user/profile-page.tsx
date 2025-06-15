import { Flex, Typography } from "antd";
import ProfileForm from "../../features/user/profile-form";
import { useTranslation } from "react-i18next";

function ProfilePage() {
  const { t } = useTranslation();

  return (
    <Flex
      justify="center"
      align="center"
      vertical
      style={{
        width: "100%",
        position: "absolute",
      }}
    >
      <Typography.Title>{t("profileForm.title")}</Typography.Title>
      <ProfileForm />
    </Flex>
  );
}

export default ProfilePage;
