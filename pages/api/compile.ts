import { CompileResponse, RunBody } from '../../types/types';
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = CompileResponse

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { inputCode } = req.body as RunBody;

    const response: CompileResponse = {
      code: inputCode,
      failed: false,
      message: "success!"
    }
    res.status(200).json(response)
    return response;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: "",
      failed: true,
      message: "Error"
    })
  }
}