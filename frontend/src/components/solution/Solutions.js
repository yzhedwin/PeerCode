import { memo, useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Divider } from "@mui/material";
import SolutionItem from "./SolutionItem";
import SolutionPopup from "../common/popup/SolutionPopup";
import axios from "axios";
import { API_GATEWAY } from "../../utils/constants";

function Solutions(props) {
	const { list } = props;
	const [open, setOpen] = useState(false);
	const [solution, setSolution] = useState({
		username: "",
		content: "",
		language: "",
		creationDate: "",
		voteCount: "",
		commentCount: "",
		userAvatar: "",
		reputation: "",
		solutionTags: [],
	});
	const handleOpen = useCallback(async (item) => {
		try {
			const { data } = await axios.get(`${API_GATEWAY}/api/v1/question/solution/community`, {
				params: { id: item.id },
			});
			setSolution({
				username: item?.username,
				content: data?.post?.content,
				creationDate: new Date(item.creationDate),
				voteCount: item?.voteCount,
				commentCount: item?.commentCount,
				userAvatar: item?.userAvatar,
				reputation: item?.reputation,
				solutionTags: item?.solutionTags,
				title: item?.title,
			});
			setOpen(true);
		} catch (e) {
			console.log(e);
		}
	}, []);
	const handleClose = useCallback(() => setOpen(false), []);

	return (
		<Box sx={{ width: "100%", overflow: "auto", height: "95%" }}>
			<SolutionPopup open={open} handleClose={handleClose} solution={solution} />
			<Stack spacing={0} divider={<Divider orientation="horizontal" flexItem />}>
				{list.map((l, index) => {
					return <SolutionItem key={index} item={l} handleOpen={handleOpen} />;
				})}
			</Stack>
		</Box>
	);
}
export default memo(Solutions);
