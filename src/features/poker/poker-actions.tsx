import { Button, Flex, Slider, Typography } from "antd";
import { motion } from "motion/react";

function PokerActions() {
  return (
    <Flex
      style={{
        width: "50%",
      }}
      vertical
    >
      <Flex justify="end" gap={8} align="center">
        <Button
          style={{
            color: "#fff",
            background: "#192135",
          }}
        >
          Min
        </Button>
        <Button
          style={{
            color: "#fff",
            background: "#192135",
          }}
        >
          Half
        </Button>
        <Button
          style={{
            color: "#fff",
            background: "#192135",
          }}
        >
          Pot
        </Button>
        <Button
          style={{
            color: "#fff",
            background: "#192135",
          }}
        >
          All In
        </Button>
      </Flex>
      <Typography.Text style={{ color: "#fff", fontSize: "16px" }}>
        500₮
      </Typography.Text>
      <Slider
        style={{ width: "100%" }}
        styles={{
          track: { backgroundColor: "#8CC15B" },
          rail: { backgroundColor: "#192135" },
          handle: { backgroundColor: "#8CC15B", borderColor: "#8CC15B" },
        }}
      />
      <Flex justify="space-around" align="center" gap={16}>
        <motion.div
          style={{
            width: "100%",
            height: "50px",
          }}
          whileHover={{ scale: 1.1 }}
        >
          <Button
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "20px",
              background: "#EA5C61",
              color: "#fff",
              textTransform: "uppercase",
              fontFamily: "Roboto, sans-serif",
              fontSize: "20px",
              border: "none",
            }}
          >
            Fold
          </Button>
        </motion.div>

        <motion.div
          style={{
            width: "100%",
            height: "50px",
          }}
          whileHover={{ scale: 1.1 }}
        >
          <Button
            style={{
              width: "100%",
              borderRadius: "20px",
              background: "#192135",
              height: "50px",
              color: "#fff",
              textTransform: "uppercase",
              fontFamily: "Roboto, sans-serif",
              border: "none",
              fontSize: "20px",
            }}
          >
            Check
          </Button>
        </motion.div>

        <motion.div
          style={{
            width: "100%",
            height: "50px",
          }}
          whileHover={{ scale: 1.1 }}
        >
          <Button
            style={{
              width: "100%",
              height: "50px",
              borderRadius: "20px",
              color: "#fff",
              background: "#8CC15B",
              textTransform: "uppercase",
              fontFamily: "Roboto, sans-serif",
              fontSize: "20px",
              border: "none",
            }}
          >
            Raise
          </Button>
        </motion.div>
      </Flex>
    </Flex>
  );
}

export default PokerActions;
