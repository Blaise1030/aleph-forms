// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from "next";
import {promises as fs} from "fs";
import path from "path";

export type TFormFields = {
  runningNumber: number;
  language: string;
  email: string;
  date: string;
  phone: string;
  username: string;
  age: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{count: number} | {status: string; error: unknown}>
) {
  if (req.method !== "GET")
    return res
      .status(405)
      .json({status: "failed", error: "Method Not Allowed"});
  const jsonDirectory = path.join("json");
  const fileContents = await fs.readFile(jsonDirectory + "/data.json", "utf8");
  const data: {runningNumber: number; data: TFormFields[]} =
    JSON.parse(fileContents);
  res.status(200).json({count: data.data.length});
}
