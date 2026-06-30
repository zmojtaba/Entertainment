import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

export function CircularProgressWithLabel({ value }) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"        
        value={value}
        size={50}
      />

      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" sx={{ fontSize: "13px" }} component="div">
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

// export default function App() {
//   return <CircularProgressWithLabel value={75} />;
// }
