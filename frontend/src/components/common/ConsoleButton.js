import { Button } from "@mui/material";

function ConsoleButton(props) {
  const { title } = props;
  return (
    <Button variant="contained" color="secondary" {...props}>
      {title}
    </Button>
  );
}

export default ConsoleButton;
