import { Box, Button, Typography, alpha } from "@mui/material";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import notFoundImage from 'assets/images/backgrounds/404-page-not-found.svg';

function Error404Page() {
  const { t } = useTranslation("general");
  const navigate = useNavigate();
  console.log("Error404PageError404PageError404PageError404PageError404Page")
  return (
    <Box
      className="flex items-center justify-center flex-1 flex-col "
      sx={{ backgroundColor: (t) => alpha(t.palette.background.paper, 0.7) }}
    >
      <motion.div
        className="h-2/5"
        initial={{ opacity: 0, scale: 0, type: "spring" }}
        animate={{ opacity: 1, scale: 1, transition: { delay: 0.3 } }}
      >
        <img
          className="h-full"
          src={notFoundImage}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0, type: "spring" }}
        animate={{ opacity: 1, scale: 1, transition: { delay: 0.4 } }}
      >
        <Typography
          variant="h5"
          color="textSecondary"
          sx={{ whiteSpace: "pre-line", lineHeight: "45px" }}
          className="font-500 pt-3 text-center "
        >
          {t("PAGE_NOT_FOUND")}
        </Typography>
      </motion.div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, transition: { delay: 0.5 } }}
      >
        <Link to="/">
          <Button
            variant="contained"
            sx={{
              backgroundColor: "primary",
              marginRight: "10px",
              marginY: "30px",
            }}
            startIcon={<HomeIcon />}
          >
            {t("HOME_PAGE")}
          </Button>
        </Link>
        <Button
          onClick={() => navigate(-1)}
          variant="contained"
          endIcon={<ArrowBackIcon />}
        >
          {t("PREVIOUS_PAGE")}
        </Button>
      </motion.div>
    </Box>
  );
}

export default Error404Page;
