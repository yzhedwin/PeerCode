function Testcase(props) {
	const { testCase } = props;
	return (
		<div>
			{testCase?.map((tc, index) => {
				return tc;
			})}
		</div>
	);
}

export default Testcase;
