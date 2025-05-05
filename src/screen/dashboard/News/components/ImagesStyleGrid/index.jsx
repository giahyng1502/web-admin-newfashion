import React from "react";
import { Box } from "@mui/material";

const radius = "20px";
const gap = 0.4;

export default function ImagesStyleGrid({ images }) {
  const count = images.length;

  // Xác định grid template & grid areas theo số ảnh
  let gridTemplate = {};
  let areas = [];

  switch (count) {
    case 1:
      gridTemplate = {
        gridTemplateColumns: "1fr",
        gridTemplateRows: "1fr",
        gridTemplateAreas: `"a"`,
      };
      areas = ["a"];
      break;

    case 2:
      gridTemplate = {
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "auto",
        gridTemplateAreas: `"a b"`,
      };
      areas = ["a", "b"];
      break;

    case 3:
      gridTemplate = {
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "auto auto",
        gridTemplateAreas: `
          "a b"
          "c c"
        `,
      };
      areas = ["a", "b", "c"];
      break;

    case 4:
      gridTemplate = {
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "auto auto",
        gridTemplateAreas: `
          "a b"
          "c d"
        `,
      };
      areas = ["a", "b", "c", "d"];
      break;

    case 5:
      gridTemplate = {
        gridTemplateColumns: "1fr 1fr 1fr",
        gridTemplateRows: "auto auto",
        gridTemplateAreas: `
          "a b b"
          "c d e"
        `,
      };
      areas = ["a", "b", "c", "d", "e"];
      break;

    default:
      return null;
  }

  return (
    <Box
      sx={{
        display: "grid",
        gap,
        overflow: "hidden",
        border: "1px solid #7a7a7a",
        mt: 0.8,
        borderRadius: radius,
        width: "100%",
        ...gridTemplate,
      }}
    >
      {areas.map((area, i) => {
        const url = images[i];
        if (!url) return null;

        // Tính border-radius chỉ cho góc ngoài
        let br = "";
        if (count === 1) {
          br = radius;
        } else {
          // Với mỗi vị trí, check nó có nằm góc ngoài không
          const topRow = area === "a" || area === "b";
          const bottomRow = ["c", "d", "e"].includes(area);
          const leftCol = area === "a" || area === "c";
          const rightCol = area === "b" || area === "e";

          const tl = topRow && leftCol ? radius : 0;
          const tr = topRow && rightCol ? radius : 0;
          const bl = bottomRow && leftCol ? radius : 0;
          const brc = bottomRow && rightCol ? radius : 0;

          br = `${tl} ${tr} ${brc} ${bl}`;
        }

        return (
          <Box
            key={i}
            sx={{
              gridArea: area,
              position: "relative",
              width: "100%",
              pt: "100%", // để giữ tỉ lệ 1:1
              overflow: "hidden",
              borderRadius: br,
            }}
          >
            <Box
              component="img"
              src={url}
              alt={`img-${i}`}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
}
