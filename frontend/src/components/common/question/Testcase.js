import "../../../css/testcase.scss";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { TabPanel } from "../../../utils/helper";
import { useTheme } from "@emotion/react";
import { useState } from "react";

export default function Testcase(props) {
	const [value, setValue] = useState(0);
	const { defaultTestCases, setStdin } = props;
	const [testCase, setTestCase] = useState(defaultTestCases); //get loaded testcase
	const theme = useTheme();
	const handleChangeInput = (e, caseIndex, param) => {
		let newTestCases = JSON.parse(JSON.stringify(testCase));
		newTestCases[caseIndex][param] = e.target.value;
		setTestCase(newTestCases);
		setStdin(newTestCases[value]);
	};
	const handleChange = (event, newValue) => {
		setValue(newValue);
		setStdin(testCase[newValue]);
	};
	return (
		<div className="testcase-container">
			<Box
				sx={{
					height: "40px",
					width: "100%",
					bgcolor: "primary.main",
				}}
			>
				<Tabs value={value} onChange={handleChange} sx={{ height: "40px" }}>
					{testCase?.map((_, index) => {
						return (
							<Tab
								sx={{
									":focus": { color: "primary.contrastText" },
									"&.Mui-selected": { color: "primary.contrastText" },
								}}
								label={`Case ${index + 1}`}
							/>
						);
					})}
				</Tabs>
			</Box>
			<Box sx={{ flex: 1, backgroundColor: "primary.main" }}>
				{testCase?.map((tc, caseIndex) => {
					return (
						<TabPanel value={value} index={caseIndex} dir={theme.direction}>
							<div className="testcase-item">
								{Object.keys(tc).map((param) => {
									return (
										<>
											<div className="testcase-param-title">
												{param + "="}
											</div>

											<div className="testcase-param-value">
												<input
													className="testcase-param-value-input"
													value={tc[param]}
													onChange={(e) =>
														handleChangeInput(e, caseIndex, param)
													}
												></input>
											</div>
										</>
									);
								})}
							</div>
						</TabPanel>
					);
				})}
			</Box>
		</div>
	);
}
