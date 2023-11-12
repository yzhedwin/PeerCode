import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Tags from "../common/Tags";
import "../../css/solutions.scss";
import SolutionIcons from "./SolutionIcons";

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.secondary,
	...theme.typography.body2,
	color: theme.palette.text.secondary,
}));

export default function SolutionItem(props) {
	const { item, handleOpen, key } = props;
	return (
		<Item onClick={() => handleOpen && handleOpen(item)}>
			<div key={key} className="solution-item-container-1">
				<img alt="user-avatar" src={item.userAvatar} className="solution-item-avatar" />
				<div className="solution-item-container-2">
					<div>{item.username}</div>
					<div className="solution-item-title">{item.title}</div>
					<div>
						<Tags tags={item.solutionTags} />
					</div>
					<div>
						<SolutionIcons
							vote={item.voteCount}
							view={item.viewCount}
							comment={item.commentCount}
						/>
					</div>
				</div>
			</div>
		</Item>
	);
}
