function Testcase(props) {
	const { testCase } = props;
	//for each test case, display in a row,
	// when

	return (
		<div>
			{[...testCase]?.map((tc, index) => {
				console.log(tc.split("\n"));
				return tc;
			})}
		</div>
	);
}

export default Testcase;
