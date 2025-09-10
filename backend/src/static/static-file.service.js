import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

const BUCKET = "synthetic-data-tests";
const REGION = process.env.AWS_REGION || "sa-east-1";

const s3 = new S3Client({ region: REGION });

export async function getStaticFileStream(key) {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  const response = await s3.send(command);
  return response.Body;
}
