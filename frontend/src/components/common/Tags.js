import { Chip } from "@mui/material";

function Tags(props) {
	const { tags } = props;
	return tags.map((tag) => {
		return <Chip label={tag.name} size="small" sx={{ ml: 1 }} />;
	});
}

export default Tags;
