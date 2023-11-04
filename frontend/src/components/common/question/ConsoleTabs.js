import { AppBar, Box, Tab, Tabs } from "@mui/material";
import { useCallback, useState } from "react";
import { useTheme } from "@mui/material/styles";
import ChatBox from "./ChatBox";
import ChatInput from "./ChatInput";
import Console from "./Console";
import Testcase from "./Testcase";
import { TabPanel, a11yProps } from "../../../utils/helper";

function ConsoleTabs(props) {
  const {
    onSubmitChat,
    onSubmitAIChat,
    textInput,
    aiTextInput,
    setTextInput,
    setAITextInput,
    chatDisabled,
    defaultTestCases,
    setStdin,
  } = props;
  const [value, setValue] = useState(0);
  const handleChange = useCallback(async (event, newValue) => {
    setValue(newValue);
  }, []);
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: "secondary",
        width: "100%",
        height: "100%",
      }}
    >
      <AppBar position="static" sx={{ height: "30px" }}>
        <Tabs
          TabIndicatorProps={{
            style: {
              height: "2px",
            },
          }}
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
          sx={{
            height: "30px",
            minHeight: "30px",
          }}
        >
          <Tab label="Testcase" {...a11yProps(0)} />
          <Tab label="Result" {...a11yProps(1)} />
          {!chatDisabled && <Tab label="Chat" {...a11yProps(2)} />}
          <Tab label="AI Assistant" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} dir={theme.direction}>
        <Testcase defaultTestCases={defaultTestCases} setStdin={setStdin} />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <Console />
      </TabPanel>
      {!chatDisabled && (
        <TabPanel value={value} index={2} dir={theme.direction}>
          <div className="chat-message-container">
            <ChatBox isAI={false} />
            <ChatInput
              onSubmitChat={onSubmitChat}
              textInput={textInput}
              setTextInput={setTextInput}
              disabled={chatDisabled}
            />
          </div>
        </TabPanel>
      )}
      <TabPanel
        value={value}
        index={chatDisabled ? 2 : 3}
        dir={theme.direction}
      >
        <div className="chat-message-container">
          <ChatBox isAI={true} />
          <ChatInput
            onSubmitChat={onSubmitAIChat}
            textInput={aiTextInput}
            setTextInput={setAITextInput}
          />
        </div>
      </TabPanel>
    </Box>
  );
}

export default ConsoleTabs;
