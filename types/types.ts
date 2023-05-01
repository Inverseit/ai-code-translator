export interface CompileResponse {
  code: string;
  failed: boolean;
  message: string;
}

export interface RunBody {
  inputCode: string;
}
