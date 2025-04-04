import { createUploadthing, type FileRouter } from "uploadthing/next";


const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .onUploadComplete(async ({ file }) => {
      console.log("file url", file.url);
      return { uploadedBy: 'Someone'};
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
