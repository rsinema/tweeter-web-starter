"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3AccessDAO = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
class S3AccessDAO {
    constructor() {
        this.s3_url = "https://rsinema-340-bucket.s3.us-west-2.amazonaws.com/";
        this.BUCKET = "rsinema-340-bucket";
        this.REGION = "us-west-2";
    }
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
    putFile(imageStringBase64Encoded, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            let decodedImageBuffer = Buffer.from(imageStringBase64Encoded, "base64");
            const s3Params = {
                Bucket: this.BUCKET,
                Key: "image/" + fileName,
                Body: decodedImageBuffer,
                ContentType: "image/png",
                ACL: client_s3_1.ObjectCannedACL.public_read,
            };
            const c = new client_s3_1.PutObjectCommand(s3Params);
            const client = new client_s3_1.S3Client({ region: this.REGION });
            try {
                yield client.send(c);
                return `https://${this.BUCKET}.s3.${this.REGION}.amazonaws.com/image/${fileName}`;
            }
            catch (error) {
                throw Error("s3 put image failed with: " + error);
            }
        });
    }
}
exports.S3AccessDAO = S3AccessDAO;
