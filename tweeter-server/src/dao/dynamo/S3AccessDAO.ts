import { FileDAO } from "../DAOInterface";
import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";

export class S3AccessDAO implements FileDAO {
  private s3_url: string =
    "https://rsinema-340-bucket.s3.us-west-2.amazonaws.com/";
  readonly BUCKET: string = "rsinema-340-bucket";
  readonly REGION: string = "us-west-2";

  // async putFile(
  //   base64EncodedImage: string,
  //   userAlias: string
  // ): Promise<string> {
  //   try {
  //     const client = new S3Client();

  //     const decodedImageBuffer = Buffer.from(base64EncodedImage, "base64");

  //     const params = {
  //       Body: decodedImageBuffer,
  //       Bucket: "rsinema-340-bucket",
  //       Key: userAlias,
  //     };

  //     const command = new PutObjectCommand(params);
  //     await client.send(command);

  //     return this.s3_url + userAlias;
  //   } catch (error) {
  //     throw new Error(`[Database Error] ${(error as Error).message}`);
  //   }
  // }

  async putFile(
    imageStringBase64Encoded: string,
    fileName: string
  ): Promise<string> {
    let decodedImageBuffer: Buffer = Buffer.from(
      imageStringBase64Encoded,
      "base64"
    );
    const s3Params = {
      Bucket: this.BUCKET,
      Key: "image/" + fileName,
      Body: decodedImageBuffer,
      ContentType: "image/png",
      ACL: ObjectCannedACL.public_read,
    };
    const c = new PutObjectCommand(s3Params);
    const client = new S3Client({ region: this.REGION });
    try {
      await client.send(c);
      return `https://${this.BUCKET}.s3.${this.REGION}.amazonaws.com/image/${fileName}`;
    } catch (error) {
      throw Error("s3 put image failed with: " + error);
    }
  }
}
