import { CodeBlock } from '../components/CodeBlock';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { CompileResponse, RunBody } from '../types/types';

export default function Home() {
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasCompiled, setHasCompiled] = useState<boolean>(false);

  const handleRun =async () => {
    if (!outputCode) {
      alert('Please compile some code first.');
      return;
    }
    // DANGEROUS
    return eval(outputCode);
  }

  const handleCompile = async () => {
    const maxCodeLength = 70000;

    if (!inputCode) {
      alert('Please enter some code.');
      return;
    }

    if (inputCode.length > maxCodeLength) {
      alert(
        `Please enter code less than ${maxCodeLength} characters. You are currently at ${inputCode.length} characters.`,
      );
      return;
    }

    setLoading(true);
    setOutputCode('');

    const controller = new AbortController();

    const body: RunBody = {
      inputCode,
    };

    const response = await fetch('/api/compile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setLoading(false);
      alert('Something went wrong.');
      return;
    }

    const data = await response.json() as CompileResponse;

    if (!data) {
      setLoading(false);
      alert('Something went wrong.');
      return;
    }

    let code = data.code;
    setOutputCode(code);

    setLoading(false);
    setHasCompiled(true);
    copyToClipboard(code);
  };

  const copyToClipboard = (text: string) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  useEffect(() => {
    if (hasCompiled) {
      handleCompile();
    }
  }, []);

  return (
    <>
      <Head>
        <title>Code Translator</title>
        <meta
          name="description"
          content="Use AI to Run code from one language to another."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-full min-h-screen flex-col items-center bg-[#0E1117] px-4 pb-20 text-neutral-200 sm:px-10">
        <div className="mt-10 flex flex-col items-center justify-center sm:mt-20">
          <div className="text-4xl font-bold">C0 Transpiler to JavaScript</div>
        </div>

        <div className="mt-2 flex items-center space-x-2">

          <button
            className="w-[140px] cursor-pointer rounded-md bg-violet-500 px-4 py-2 font-bold hover:bg-violet-600 active:bg-violet-700"
            onClick={() => handleCompile()}
            disabled={loading}
          >
            {loading ? 'Compiling...' : 'Compile'}
          </button>
          <button
            className="w-[140px] cursor-pointer rounded-md bg-green-500 px-4 py-2 font-bold hover:bg-green-600 active:bg-green-700"
            onClick={() => handleRun()}
            disabled={loading}
          >
            {loading ? 'Running...' : 'Run'}
          </button>
        </div>

        <div className="mt-2 text-center text-xs">
          {loading
            ? 'Translating...'
            : hasCompiled
              ? 'Output copied to clipboard!'
              : 'Enter some code and click "Compile"'}
        </div>

        <div className="mt-6 flex w-full max-w-[1200px] flex-col justify-between sm:flex-row sm:space-x-4">
          <div className="h-100 flex flex-col justify-center space-y-2 sm:w-2/4">
            <div className="text-center text-xl font-bold">Input</div>
            <CodeBlock
              code={inputCode}
              editable={!loading}
              onChange={(value: string) => {
                setInputCode(value);
                setHasCompiled(false);
              }}
            />
          </div>
          <div className="mt-8 flex h-full flex-col justify-center space-y-2 sm:mt-0 sm:w-2/4">
            <div className="text-center text-xl font-bold">Output</div>
            <CodeBlock code={outputCode} />
          </div>
        </div>
      </div>
    </>
  );
}
