// ✅ Put all imports at the very top
import React, { useState } from "react";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  Flex,
  Switch,
  Text,
  useColorMode,
  useColorModeValue,
  Select,
  Input
} from "@chakra-ui/react";

// Simple horizontal separator
function HSeparator() {
  return <Box h="1px" bg="gray.300" my="12px" />;
}

export default function Configurator(props) {
  const {
    isOpen,
    onClose,
    onSwitch,
    onLanguageChange,
    onPrimaryColorChange,
    onFontSizeChange,
    onNotificationToggle,
    onTimeFormatChange,
    onLogout
  } = props;

  const [navbarFixed, setNavbarFixed] = useState(false);
  const [language, setLanguage] = useState("en");
  const [primaryColor, setPrimaryColor] = useState("#3182ce");
  const [fontSize, setFontSize] = useState("md");
  const [notifications, setNotifications] = useState(true);
  const [timeFormat24, setTimeFormat24] = useState(false);

  const { colorMode, toggleColorMode } = useColorMode();
  const bgDrawer = useColorModeValue("white", "gray.800");

  // Apply changes to parent
  const handleApply = () => {
    onSwitch?.(navbarFixed);
    onLanguageChange?.(language);
    onPrimaryColorChange?.(primaryColor);
    onFontSizeChange?.(fontSize);
    onNotificationToggle?.(notifications);
    onTimeFormatChange?.(timeFormat24);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement={document.documentElement.dir === "rtl" ? "left" : "right"}
    >
      <DrawerContent bg={bgDrawer}>
        <DrawerCloseButton />
        <DrawerHeader>Settings</DrawerHeader>

        <DrawerBody>
          <Flex direction="column" gap="20px">
            {/* 🌐 Language */}
            <Flex justify="space-between" align="center">
              <Text>Language</Text>
              <Select
                value={language}
                w="150px"
                size="sm"
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="ta">தமிழ்</option>
                <option value="hi">हिन्दी</option>
              </Select>
            </Flex>

            {/* 📌 Navbar Fixed */}
            <Flex justify="space-between" align="center">
              <Text>Navbar Fixed</Text>
              <Switch
                isChecked={navbarFixed}
                onChange={() => setNavbarFixed(!navbarFixed)}
              />
            </Flex>

            {/* 🌙 Theme */}
            <Flex justify="space-between" align="center">
              <Text>Theme</Text>
              <Button size="sm" onClick={toggleColorMode}>
                Toggle {colorMode === "light" ? "Dark" : "Light"}
              </Button>
            </Flex>

            {/* 🎨 Primary Color */}
            <Flex justify="space-between" align="center">
              <Text>Primary Color</Text>
              <Input
                type="color"
                value={primaryColor}
                w="60px"
                p="0"
                onChange={(e) => setPrimaryColor(e.target.value)}
              />
            </Flex>

            {/* 🔠 Font Size */}
            <Flex justify="space-between" align="center">
              <Text>Font Size</Text>
              <Select
                value={fontSize}
                w="100px"
                size="sm"
                onChange={(e) => setFontSize(e.target.value)}
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </Select>
            </Flex>

            {/* 🔔 Notifications */}
            <Flex justify="space-between" align="center">
              <Text>Notifications</Text>
              <Switch
                isChecked={notifications}
                onChange={() => setNotifications(!notifications)}
              />
            </Flex>

            {/* ⏰ Time Format */}
            <Flex justify="space-between" align="center">
              <Text>24-Hour Time</Text>
              <Switch
                isChecked={timeFormat24}
                onChange={() => setTimeFormat24(!timeFormat24)}
              />
            </Flex>

            <HSeparator />

            {/* 🚪 Logout */}
            <Button colorScheme="red" onClick={onLogout}>
              Log Out
            </Button>

            <Button mt={4} colorScheme="blue" onClick={handleApply}>
              Apply Changes
            </Button>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
