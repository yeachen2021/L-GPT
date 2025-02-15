const useStreamDecoder = () => {
  // decode finish
  let decoderDone = false;
  const textDecoder = new TextDecoder();

  const checkFragmentErr = (fragment: string) => {
    try {
      if (JSON.parse(fragment).error) return true;
    } catch {}
    return false;
  };

  const checkFragment = (fragment: string) => {
    const lines = fragment.split("\n").filter((item) => item.trim());
    let valid = true;
    for (const line of lines) {
      const message = line.replace(/^data: /, "");
      try {
        if (message !== "[DONE]") JSON.parse(message);
      } catch {
        valid = false;
      }
    }
    return valid;
  };

  const decoder = async (
    reader: ReadableStreamDefaultReader<Uint8Array>,
    handler: (val: string) => void,
    errHandler: () => void
  ) => {
    // if error, add in errorFragment
    let errorFragment = "";
    decoderDone = false;

    const handleFragment = (fragment: string) => {
      const lines = fragment.split("\n").filter((item) => item.trim());
      for (const line of lines) {
        const message = line.replace(/^data: /, "");
        if (message === "[DONE]") decoderDone = true;
        try {
          const content = JSON.parse(message).choices[0].delta.content;
          if (content) handler(content);
        } catch {}
      }
    };

    return new Promise(async (resolve) => {
      while (!decoderDone) {
        const { done, value } = await reader.read();
        decoderDone = done;
        const fragment = textDecoder.decode(value);
        const checkIsError = checkFragmentErr(fragment);
        if (checkIsError) {
          decoderDone = true;
          return errHandler();
        }
        const check1 = checkFragment(fragment);
        if (!check1) {
          errorFragment += fragment;
          const check2 = checkFragment(errorFragment);
          if (check2) {
            handleFragment(errorFragment);
            errorFragment = "";
          }
        } else {
          if (errorFragment) errorFragment = "";
          handleFragment(fragment);
        }
        if (decoderDone) resolve(true);
      }
    });
  };

  return { decoder };
};

export { useStreamDecoder };
