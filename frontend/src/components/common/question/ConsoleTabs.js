import { AppBar, Box, Tab, Tabs } from "@mui/material";
import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import ChatBox from "./ChatBox";
import ChatInput from "./ChatInput";
import Console from "./Console";
import Testcase from "./Testcase";

function TabPanel(props) {
	const { children, value, index, ...other } = props;
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`full-width-tabpanel-${index}`}
			aria-labelledby={`full-width-tab-${index}`}
			style={{
				flex: 1,
			}}
			{...other}
		>
			{value === index && <Box sx={{ height: "100%" }}>{children}</Box>}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `full-width-tab-${index}`,
		"aria-controls": `full-width-tabpanel-${index}`,
	};
}
function ConsoleTabs(props) {
	const { onSubmitChat, textInput, setTextInput, chatDisabled, testCase } = props;
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
							height: "5px",
						},
					}}
					value={value}
					onChange={handleChange}
					indicatorColor="secondary"
					textColor="inherit"
					variant="fullWidth"
					aria-label="full width tabs example"
				>
					<Tab label="Testcase" {...a11yProps(0)} />
					<Tab label="Result" {...a11yProps(1)} />
					<Tab label="Chat" {...a11yProps(2)} />
				</Tabs>
			</AppBar>
			<TabPanel value={value} index={0} dir={theme.direction}>
				<Testcase testCase={testCase} />
			</TabPanel>
			<TabPanel value={value} index={1} dir={theme.direction}>
				<Console />
			</TabPanel>
			<TabPanel value={value} index={2} dir={theme.direction}>
				<div className="chat-message-container">
					<ChatBox />
					<ChatInput
						onSubmitChat={onSubmitChat}
						textInput={textInput}
						setTextInput={setTextInput}
						disabled={chatDisabled}
					/>
				</div>
			</TabPanel>
		</Box>
	);
}

export default ConsoleTabs;
