const http = process.env.HTTP || "http"; // Default to 'http' if not set
const port = process.env.PORT || 3000; // Default to 3000 if not set
const host = process.env.HOST || "localhost"; // Default to 'localhost' if not set

const serverUrl = `${http}://${host}:${port}`;

function relativePathGenerator(files) {
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error("No files provided");
  }

  const pathArr = [];

  files.forEach((file) => {
    if (!file || !file.path) {
      throw new Error("File path is missing");
    }

    const relativePath = `${serverUrl}/${file.path.replace(/\\/g, "/")}`; // Ensure paths are correctly formatted for URLs

    pathArr.push(relativePath);
  });

  return pathArr;
}

function absolutePathGenerator(relativeFilesPath) {
  if (Array.isArray(relativeFilesPath) || !relativeFilesPath.length) {
    throw new Error("no files provided");
  }

  let absolutePath = [];

  for (let i = 0; i < relativeFilesPath.length; i++) {
    const path = relativeFilesPath.replace(`${serverUrl}`, `./public/temp`);

    absolutePath.push(path);
  }

  return absolutePath;
}

module.exports = { relativePathGenerator, absolutePathGenerator };

// mycode
// const http = process.env.HTTP;
// const port = process.env.PORT;
// const host = process.env.HOST;

// const serverUrl = `${http}://${host}:${port}`;

// function relativePathGenerator(files) {
//   const pathArr = [];

//   for (let i = 0; i < files.length; i++) {
//     const absolutePath = files["professionalCertificates"][i].path;

//     const relativePath = `${serverUrl}/${absolutePath}`;

//     pathArr.push(relativePath);
//   }

//   return pathArr;
// }

// module.exports = { relativePathGenerator };
