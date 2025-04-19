import * as fs from "fs";
import * as path from "path";

export function generateServerFiles(input: string) {
  console.log("Generating server files with input");
  // Adjust the contentRoot to point to the correct preview folder
  const contentRoot = path.join("/Users/valtteri/Documents/Bittive/website-builder/preview1");

  // Ensure the /test directory exists
  if (!fs.existsSync(contentRoot)) {
    fs.mkdirSync(contentRoot, { recursive: true });
  }

  // Parse the input and extract <siteforgewrite>, <siteforgecode>, and <siteforgeadd-dependency> tags
  const siteforgeWriteRegex = /<siteforgewrite file="([^"]+)">([\s\S]*?)<\/siteforgewrite>/g;
  const siteforgeCodeRegex = /<siteforgecode>([\s\S]*?)<\/siteforgecode>/g;
  const siteforgeAddDependencyRegex = /<siteforgeadd-dependency name="([^"]+)"\/>/g;

  let match;

  // Handle <siteforgewrite> tags
  while ((match = siteforgeWriteRegex.exec(input)) !== null) {
    const filePath = match[1];
    const fileContent = match[2];

    const fullPath = path.join(contentRoot, filePath);
    const dir = path.dirname(fullPath);

    // Ensure the directory for the file exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write the content to the file
    fs.writeFileSync(fullPath, fileContent.trim(), "utf8");
    console.log(`File written: ${fullPath}`);
  }

  // Handle <siteforgecode> tags
  while ((match = siteforgeCodeRegex.exec(input)) !== null) {
    const codeContent = match[1];
    const codeFilePath = path.join(contentRoot, "generated-code.tsx");

    fs.writeFileSync(codeFilePath, codeContent.trim(), "utf8");
    console.log(`Code file written: ${codeFilePath}`);
  }

  // Handle <siteforgeadd-dependency> tags
  while ((match = siteforgeAddDependencyRegex.exec(input)) !== null) {
    const dependency = match[1];
    console.log(`Dependency to install: ${dependency}`);
    // Optionally, you could write these dependencies to a file or process them further
  }
}
