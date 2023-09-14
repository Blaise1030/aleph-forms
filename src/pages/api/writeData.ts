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
  res: NextApiResponse<TFormFields | {status: string; error: unknown}>
) {
  if (req.method !== "POST")
    return res
      .status(405)
      .json({status: "failed", error: "Method Not Allowed"});

  try {
    const userInput: TFormFields = JSON.parse(req.body);
    const jsonDirectory = path.join(process.cwd(), "json");
    const fileContents = await fs.readFile(
      jsonDirectory + "/data.json",
      "utf8"
    );
    const data: {runningNumber: number; data: TFormFields[]} =
      JSON.parse(fileContents);
    const newData = {
      ...userInput,
      runningNumber: data.runningNumber,
      date: new Date().toJSON(),
    };
    const updateData: {runningNumber: number; data: TFormFields[]} = {
      runningNumber: data.runningNumber + 1,
      data: [newData, ...data.data],
    };
    await fs.writeFile(
      jsonDirectory + "/data.json",
      JSON.stringify(updateData),
      "utf8"
    );
    res.status(200).json(newData);
  } catch (error) {
    let err = error;
    return res.status(500).json({status: "failed", error: err});
  }
}
